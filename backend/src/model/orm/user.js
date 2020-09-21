'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const Password = require("objection-password")()
const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

/**@module model/orm/user*/
/**@namespace User*/

module.exports = class User extends Password(Model) {
    static get tableName() {
        return "users"
    }

    static get jsonSchema() { 
        return {
            type: "object",
            required: ["email", "password", "permission_id","region_id"],

            properties: {
                id: { type: "integer" },
                email: { type: "string", maxLength: 320, format: "email" },
                password: { type: "string", minLength: 8, maxLength: 72 },
                permission_id: { type: "integer" },
                region_id: { type: "integer" }
            },
        }
    }

    static get relationMappings() {

        const Permission = require("./permission")
        const Shop = require("./shop")
        const Region = require("./region")

        return {
            permission: {
                relation: Model.HasManyRelation,
                modelClass: Permission,
                join: {
                    from: 'permissions.id',
                    to: 'users.permission_id'
                }
            },

            region: {
                relation: Model.HasManyRelation,
                modelClass: Region,
                join: {
                    from: "regions.id",
                    to: "users.region_id"
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

    /**
     * Проверка на существования email в таблице users
     * @memberof module:model/orm/user~User
     * @static
     * @async
     * @function hasEmail
     * @param {string} email email пользователя
     * @return {boolean} Возвращает результат проверки
     */
    static async hasEmail(email) {
        return User.query()
            .first()
            .whereIn("email", [email])
            .then(Boolean)
    }
    /**
     * Функция получения данных пользователя по его id,
     * включая данные из связанных таблиц, если id будет
     * пустой возвратить данные по всем пользователям
     * @memberof module:model/orm/user~User
     * @static
     * @async
     * @param {number} userId id пользователя
     * @return {} AAA
     * @throw {"incorrect userId"} userId не целочисленный и не
     * undefined
     */
    static async getUserById(userId) {
        //валидация userId, пропускает undefined и целые числа
        if (userId === null || (userId !== undefined && !Number.isInteger(+userId))) {
            throw "incorrect userId"
        }
        
        return this.query()
            .withGraphJoined("[permission, region]")
            .select("users.id", "email")
            .skipUndefined()
            .where("users.id", userId)
            .then(res => {
                res.forEach(elem => {
                    elem.region = elem.region[0].region
                    elem.permission = elem.permission[0].permission
                })
                return res
            })
    }

    static async hasUserId(userId) {
        return this.query()
            .first()
            .findById(userId)
            .then(Boolean)
    }
}