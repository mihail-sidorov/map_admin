'use strict'
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
                email: { type: "string", maxLength: 320, format: "email" },
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
}
