'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

module.exports = class Permission extends Model {
    static get tableName() {
        return "permissions"
    }

    static get relationMappings() {

        const User = require("./user")

        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'permissions.id',
                    to: 'users.permission_id'
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["permission"],

            properties: {
                id: { type: "integer" },
                permission: { type: 'string', minLength: 1, maxLength: 5 }
            }
        }
    }
}