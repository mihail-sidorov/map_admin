'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const { Model } = require("objection")


const knex = Knex(dbConfig)

Model.knex(knex)

module.exports = class Shop extends Model {
    static get tableName() {
        return "shops"
    }

    static get relationMappings() {
        const User = require("./user")
        const Moder_status = require("./moder_status")

        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "users.id",
                    to: "shops.user_id"
                }
            },

            moder_status: {
                relation: Model.HasManyRelation,
                modelClass: Moder_status,
                join: {
                    from: "moder_statuses.id",
                    to: "shops.moder_status_id"
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["lng", "lat", "user_id"],

            properties: {
                lng: { "type": "number" },
                lat: { "type": "number" },
                user_id: { "type": "integer" },
                isActive: { "type": "boolean" }
            }
        }
    }
}