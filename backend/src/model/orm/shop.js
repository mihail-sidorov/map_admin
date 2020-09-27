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

    static async isMasterPoint(pointId) {
        return this.query().findById(pointId).whereNotNull("parent_id").then(res => !res)
    }

    static async getParentId(pointId) {
        return this.query().findById(pointId).select("parent_id").then(res => res.parent_id)
    }

    static async setStatus(pointId, moder_status) {
        return this.query()
            .findById(pointId)
            .patch({
                moder_status_id: await require("./moder_status")
                    .getIdByModerStatus(moder_status)
            })
    }

    static async setMaster(pointId) {
        const pointData = await this.query().findById(pointId)
        this.transaction()
        try {
            return await Person.transaction(async trx => {
                await this.query(trx).findById(pointId).patch({ "parent_id": null })
                await this.query(trx).delete().where("id", pointData.parent_id).orWhere("parent_id", pointData.parent_id)
                pointData.parent_id = null
                return pointData
            })
        } catch (err) {
            throw "fail"
        }
    }

    static async patchData(pointId, data) {
        return this.query().findById(pointId).patch(data)
    }

    static async delPointGroup(pointId) {
        const pointData = await this.query().findById(pointId)
        if (pointData.parent_id) {
            await this.query().deleteById(pointData.parent_id)
        }
        await this.query().where("id", pointId).orWhere("parent_id", pointData.parent_id)
        return "OK"
    }

    static async delPoint(pointId) {
        return this.query().deleteById(pointId)
    }

    static async createChild(pointId, moderStatus) {
        const pointData = await this.query().findById(pointId)
        pointData.id = undefined
        pointData.moder_status_id = await require("./moder_status").getIdByModerStatus(moderStatus)
        pointData.parent_id = pointId
        const newPointData = await this.query().insert(pointData)
        return this.getPoint(newPointData.id)
    }

    static async getPoint (pointId) {
        const select = [
            "shops.id",
            "full_city_name",
            "street",
            "house",
            "title",
            "lng",
            "lat",
            "apartment",
            "hours",
            "phone",
            "site",
            "isActive",
            "description",
            "timeStamp",
            "moder_status"]

        return this.query().findById(pointId).joinRelated("moder_status").select(...select).then(res => [res])
    }
}