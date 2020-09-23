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

    /**
     * Возвращет данные модерации по точке
     * @param {number} pointId id точки
     * @typedef {Object} getModerStatusByPointId
     * @property {string} moder_status значение соответствуйщего поля в бд
     * @property {number} isModerated значение соответствуйщего поля в бд
     * @returns {getModerStatusByPointId} {moder_status:"accept", isModerated: 0}
     */
    static async getModerStatusByPointId(pointId) {
        return this.query().findById(pointId).joinRelated("moder_status").select("moder_status", "isModerated")
    }

    static async hasPointId(pointId) {
        return this.query().findById(pointId).then(Boolean)
    }
}