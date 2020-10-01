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
                isActive: { "type": "boolean,integer" }
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

    static async patchData(pointId, data) {
        return this.query().findById(pointId).patch(data)
    }

    static async delParentAndChild(pointId) {
        return await this.query().delete().where("parent_id", pointId).orWhere("id", pointId)
    }

    static async delPoint(pointId) {
        if (await this.query().deleteById(pointId)) {
            return { delete: true }
        }
    }

    static async getPoint(pointId) {
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
            "moder_status",
            "email"]

        return this.query().findById(pointId).joinRelated("[moder_status,user]").select(...select).then(res => [res])
    }

    static async returnAcceptCopyToMaster(pointId) {
        const child = await this.query().where("parent_id", pointId).first()
        if (child) {
            await this.transaction(async (trx) => {
                await this.query(trx).deleteById(child.id)
                child.id = undefined
                child.parent_id = null
                await this.query(trx).findById(pointId).patch(child)
            })
        } else {
            throw "fail"
        }
    }

    static async createNewMasterWithStatus(pointId, moderStatus) {
        const masterPoint = await this.query().findById(pointId)
        if (masterPoint.parent_id) {
            throw "fail"
        }
        const moder_status_id = await require("./moder_status").getIdByModerStatus(moderStatus)
        await this.query().findById(pointId).patch({ moder_status_id, parent_id: null })
        masterPoint.id = undefined
        masterPoint.parent_id = pointId
        await this.query().insert(masterPoint)
    }
}