'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

/** @module model/orm/moder_status */

/**@namespace Moder_status */
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

    /**
     * Выдает массив id имеющих соответствуйщий isModerated в БД
     * @memberof module:model/orm/moder_status~Moder_status
     * @static
     * @async
     * @function getIdByIsModerated
     * @param {number} isModerated Значение isModerated в БД
     * @return {} массив вида [1,2,3]
     * @throws {"incorrect isModerated"} статус isModerated невозможно корректно преобразовать в целое
     * @throws {"this isModerated not found"} по такому статусу небыло найдено ни одного id
     */
    static async getIdByIsModerated(isModerated) {
        if (!isModerated || !Number.isInteger(+isModerated)) {
            throw "incorrect isModerated"
        }
        isModerated = +isModerated
        //делаем запрос по полю isModerated
        const moder_status = await this.query()
            .where("isModerated", isModerated)
            //переопределяем массив вида [{id:1,moder_status: "add", ...}, ...] в
            //массив id [1,2,3,...]
            .then(res => res.map(elem => elem.id))
        if (moder_status.length !== 0) {
            return moder_status
        } else {
            throw "this isModerated not found"
        }

    }

    static async getIdByModerStatus (moderStatus) {
        const res = await this.query().whereIn("moder_status", [moderStatus]).first().select("id").then(res => res.id)
        if (res) {
            return res  
        } else {
            throw "this moderStatus not found"
        }
    }
}