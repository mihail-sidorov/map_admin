'use strict'

const Shop = require("../orm/shop")
const { getIdByModerStatus, getIdByIsModerated, getPrepareForInsert } = require("./utilityFn")
const Moder_status = require("../orm/moder_status")
const Region = require("../orm/region")

/**
 * Получение точек для модерации по id региона
 * @param {number} regionId id региона модератора
 * @return {} Возвращаем список точке в виде обьектов со свойствами точки в
 * массиве
 */
async function getPointsModer(regionId) {
    //какие данные мы должны получить из базы
    const select = [
        "id",
        "title",
        "apartment",
        "hours",
        "phone",
        "site",
        "description",
        "full_city_name",
        "house",
        "street",
        "isActive"]
    const points = []
    //проверка чтоб regionId был целым числом
    if (!regionId || !Number.isInteger(+regionId)) {
        throw "incorrect regionId"
    }
    //только точки с данным статусом будет видеть модератор
    const isModerated = await Moder_status.getIdByIsModerated(1)
    //получаем всех пользователей данного региона
    const regionUsers = await Region.query().findById(regionId).withGraphFetched("user.shop.moder_status")
        .modifyGraph('user.shop', bulder => {
            bulder.select(...select)
        }).first()
    //если пользователей нет выдаем ошибку
    if (regionUsers.length) {
        throw "not found users in this region"
    }
    //обьеденяем точки всех пользователей в один массив
    for (let regionUser of regionUsers.user) {
        if (regionUser.shop[0]) {
            points.push(...regionUser.shop)
        }
    }
    //подменяем массив moder_status просто статусом в текстовом формате
    points.forEach(elem => {
        elem.moder_status = elem.moder_status[0].moder_status
    })

    return (points)
}

async function setPointRefuse(pointId, description) {
    pointId = +pointId
    if (!pointId) throw "pointId must not be empty"
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("refuse")

    if (!description) {
        description = null
    }
    return Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere("id", pointId)
        .patch({ "description": description, "moder_status_id": moderStatus })
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

async function setPointAccept(pointId) {
    pointId = +pointId
    if (!pointId) throw "pointId must not be empty"
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("accept")
    return Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere("id", pointId)
        .patch({ "moder_status_id": moderStatus, description: null })
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}
/**
 * Редактирование точки модератором, возможно редактировать только точки
 * с флагом moder_status = "moderated", после радактирования статус точки стаится на accept
 * @param {number} pointId id редактируемой точки 
 * @param {object} point объект содержащий свойства для добавления
 * @return {number} id отредактированной точки
 * @throws {"incorrect pointId"} pointId невозможно преобразовать к целочисленному типу
 * @throws {"fail"} редактирование не удалось
 */
async function editPointModer(pointId, point) {
    //проверяем корректность pointId
    if (!pointId || !Number.isInteger(+pointId)) {
        throw "incorrect pointId"
    }
    //получаем id статусов которые должен видеть модератор
    const moderStatusModerated = await getIdByModerStatus("moderated")
    //получаем id статуса accept
    const moderStatusAccept = await getIdByModerStatus("accept")
    //обнуляем описание
    point.description = null
    //модер статус ставим в accept
    point.moder_status_id = moderStatusAccept

    return await Shop
        .query()
        .whereIn("moder_status_id", moderStatusModerated)
        .andWhere({ "id": pointId })
        .patch(point)
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse
exports.setPointAccept = setPointAccept
exports.editPointModer = editPointModer