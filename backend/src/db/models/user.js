const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const Password = require("objection-password")()
const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

module.exports = class User extends Password(Model) {
    static get tableName() {
        return "users"
    }

    static get jsonSchema() { //проверка типов при обновление или добовлении в таблицу
        return {
            type: "object",
            required: ["email", "password"],

            properties: {
                id: { type: "integer" },
                email: { type: "string", minLength: 1, maxLength: 320, format: "email" },
                password: { type: "string", minLength: 8, maxLength: 72 },
                permission_id: { type: "integer" }
            },
        }
    }

    static get relationMappings() {

        const Permission = require("./permission")
        const Shop = require("./shop")

        return {
            permission: {
                relation: Model.HasManyRelation,
                modelClass: Permission,
                join: {
                    from: 'permissions.id',
                    to: 'users.permission_id'
                }
            },

            shop: {
                relation: Model.HasManyRelation,
                modelClass: Shop,
                join: {
                    from: "users.id",
                    to: "shops.user_id"
                }
            }
        }
    }

    static getUserById(id) {
        return this.query().withGraphFetched("permission").findById(id)
    }

    static isIdValid(id) {
        return this.query().findById(id).then(Boolean)
    }

    static checkLoginPassword(email, password) { //Проверка на присутствие в базе пары логин/пароль
        return this
            .query()
            .withGraphFetched("permission")
            .first()
            .where("email", email)
            .then(user => {
                return (user && user.verifyPassword(password)) ? user : false
            })
    }

    static async getPointsUser(id) {
        const Moder_status = require("./moder_status")
        const moderStatusIdModerated = await Moder_status.getIdByIsModerated(1)

        return this.query()
            .findById(id)
            .withGraphFetched("shop.moder_status")
            .modifyGraph('shop', builder => builder
                .select("id", "title", "lng", "lat", "apartment", "hours", "phone", "site", "isActive", "description")
                .whereIn("moder_status_id", moderStatusIdModerated))
            .first()
            .then(res => {
                res.shop.forEach(elem => {
                    elem.moder_status = elem.moder_status[0].moder_status
                })
                return res.shop
            })
    }

    static addUser(email, password, permission = "user") { //Добавить пользователя, если пользоватьель существует, то возвращает false
        function next(err) { throw err }
        const Permission = require("./permission")
        return this.transaction(async trx => { //проверяем есть ли пользователь в базе
            const isHasEmail = await this
                .query(trx)
                .first()
                .withGraphJoined("permission")
                .where("email", email)
            if (isHasEmail) { // если есть возвращаем ошибку
                next("this user already exists")
            } else { // если нет возвращаем результат
                const permission_id = await Permission
                    .query(trx)
                    .where("permission", permission)
                    .first()
                    .then(result => result ? result.id : next(`${permission} permission not found`)) //ошибка если в бд нет таких прав
                await this.query(trx).insert({ email, password, permission_id })
                return "OK"
            }
        })


    }

    static setPassword(email, password) { //сменить пароль, если пользоватьель не существует, то возвращает false, в противном случае true
        return this
            .query()
            .first()
            .where("email", email)
            .patch({ password })
            .then(Boolean)
    }

    static setPermission(email, permission) {

    }
}
