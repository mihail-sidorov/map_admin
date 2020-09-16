'use strict'
const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db

const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

/**@module model/orm/permission*/
/**@namespace Permission*/

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

    /**
     * Проверка на существования id в таблице permissions
     * @memberof module:model/orm/permission~Permission
     * @static
     * @async
     * @function hasPermission
     * @param {number} permission_id id прав в бд
     * @return {boolean} Возвращает результат проверки
     */
    static async hasPermission(permission_id) {
        if (!permission_id || !Number.isInteger(permission_id)) {
            throw "permission_id must be integer"
        }
        return this.query().findById(permission_id).first().then(Boolean)
    }

    /**
     * Получение id данного permission
     * @memberof module:model/orm/permission~Permission
     * @static
     * @async
     * @function getIdByPermission
     * @param {string} permission название прав в бд
     * @return {number} Возвращает id полученого permission
     * @throw {"this permission not found"} если такого permission
     * нет в бд
     */
    static async getIdByPermission(permission) {
        if (!permission) throw "this permission not found"
        return this.query()
            .first()
            .where("permission", permission)
            .then(result => {
                if (result) {
                    return result.id
                } else {
                    throw "this permission not found"
                }
            })
    }
}