'use strict'

const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db
const { Model } = require("objection")
const knex = Knex(dbConfig)

Model.knex(knex)

/** @module model/orm/region */

/**@namespace Region */

module.exports = class Region extends Model {
    static get tableName() {
        return 'regions'
    }

    static get jsonSchema() {
        return {
            type: "object",
            require: ["region"],

            properties: {
                region: { "type": "string" }
            }
        }
    }

    static get relationMappings() {

        const User = require("./user")

        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "regions.id",
                    to: "users.region_id"
                }
            }
        }
    }

    /**
     * Возвращает данные региона по id, если id пустой возвратит данные всех регионов
     * @memberof module:model/orm/region~Region
     * @static
     * @async
     * @function getRegionById
     * @param {number} regionId id региона, должен быть целым
     * @return {} Вернет значение вида [{"id": 1, "region": "Адыгея"}],
     * если id не будет отправлен в функцию тогда массив будет содержать все регионы,
     * формат вывода 
     * @see {@link ..\openApi\models\getRegions.v1.json JSON-schema возвращаемых данных} AAA
     * @throws {"incorrect regionId"} если regionId присутствует но не является целым
     * @throws {"failed to find a region with this regionId"} если такого id
     * нет в базе
     */

    static async getRegionById(regionId) {
        //если regionId не является целым числом выдаем ошибку
        if (regionId === null || (regionId !== undefined && !Number.isInteger(+regionId))) {
            throw "incorrect regionId"
        }

        const region = await this.query()
            .skipUndefined()
            .where("id", regionId)

        if (region.length) {
            return region
        } else {
            throw "failed to find a region with this regionId"
        }

    }
}