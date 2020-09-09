'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

module.exports = class Moder_status extends Model {
    static get tableName() {
        return "moder_statuses"
    }

    static get relationMappings() {

        const Shop = require("./shop")

        return {
            shop: {
                relation: Model.HasManyRelation,
                modelClass: Shop,
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
            required: ["moder_status"],

            properties: {
                id: { type: "integer" },
                permission: { type: 'string', minLength: 1, maxLength: 10 }
            }
        }
    }
}