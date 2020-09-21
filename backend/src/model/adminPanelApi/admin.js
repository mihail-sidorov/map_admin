'use strict'
const User = require("../orm/user")
const Permission = require("../orm/permission")
const Region = require("../orm/region")

/** @module model/adminPanelApi/admin */

/**
 * Редактирует пользователя, можно редактировать пароль и email как
 * по отдельности так и вместе
 * @param {number} userId id редактируемого пользователя
 * @param {string} email новый email
 * @param {string} password новый пароль, если отправляется пустая строка
 * пароль не обновляется
 * @return {} см. User.getUserById
 * @see {@link module:model/orm/user~User.getUserById} формат вывода
 * @throw {"userId must be integer"} userId нельзя преобразовать в целое
 * @throw {"fail"} не удалось отредактировать пользователя
 */
async function editUser(userId, email, password) {
    return User
        .query()
        .findById(userId)
        .first()
        .patch({ email, password })
        .then(res => {
            if (res) {
                return User.getUserById(userId)
            } else {
                throw "fail"
            }
        })
}

/**
 * Добавляет нового пользователя
 * @param {string} email Все пробелы вначале и конце будут стерты
 * JSON Scheme формат email, другой формат не пройдет валидацию
 * @param {string} password пароль не короче 8 символов максимальная длина 72
 * @param {number} permission_id id назначаемых пользователю прав
 * @param {number} region_id id назначаемого пользователю региона
 * @return {} см. User.getUserById
 * @see {@link module:model/orm/user~User.getUserById} формат вывода
 */
async function addUser(email, password, permission_id, region_id) {
    const userId = await User.query().insert({ email, password, permission_id, region_id }).then(res => res.id)
    return await User.getUserById(userId)
}

/**
 * Возвращает данные всех пользователей
 * @return {} см. User.getUserById
 * @see {@link module:model/orm/user~User.getUserById}
 */
async function getUsers() {
    return User.getUserById()
}

/**
 * Добавляет регион в таблицу
 * @param {string} region Имя добавляемого региона
 * @return {} ответ вида [{"id": 1, "region": "адыгея"}]
 * @see {@link module:model/orm/region~Region.getRegionById} формат вывода.
 * @throws {"incorrect region"} region либо пустое либо не является строкой
 */
async function addRegion(region) {
    return [await Region.query().insert({ region })]
}

/**
 * Возвращает данные всех регионов из базы данных
 * @return {} см. Region.getRegionById
 * @see {@link module:model/orm/region~Region.getRegionById} формат вывода.
 */
async function getRegions() {
    return Region.getRegionById()
}

/**
 * Редактирование региона
 * @param {number} regionId id региона который будем редактировать
 * @param {string} region новое имя региона
 * @return {} см. Region.getRegionById
 * @see {@link module:model/orm/region~Region.getRegionById} формат вывода.
 * @throws {"incorrect regionId"} параметр regionId не integer
 * @throws {"incorrect region"} параметр region не string
 * @throws {"fail"} не удалось добавить в базу, вероятно нет такого regionId
 */
async function editRegion(regionId, region) {
    const getRegion = await Region.query().findById(regionId).patch({ region })
    if (getRegion) {
        return await Region.getRegionById(regionId)
    } else {
        throw "fail"
    }
}

/**
 * Возвращает данные всех прав из базы данных
 * @return {} ответ вида [{"id": 1, "permission": "admin"}]
 * @see AAA
 */
function getPermission() {
    return Permission.query()
}

function delUser(id) {
    User.query().delete().where("email", email)
}

exports.editRegion = editRegion
exports.getRegions = getRegions
exports.addRegion = addRegion
exports.editUser = editUser
exports.addUser = addUser
exports.getUsers = getUsers
exports.getPermission = getPermission