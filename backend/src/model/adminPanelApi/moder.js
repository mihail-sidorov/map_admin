'use strict'

const Shop = require("../orm/shop")
const { getIdByModerStatus, getIdByIsModerated } = require("./utilityFn")
const Region = require("../orm/region")

/**
 * Получение точек для модерации по id региона
 * @param {number} regionId id региона модератора
 * @return {} Возвращаем список точке в виде обьектов со свойствами точки в
 * массиве AAA
 */
async function getPointsModer(regionId) {
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

    const regionUsers = await Region.query().findById(regionId)
        .withGraphJoined("user.shop.moder_status", { "joinOperation": "innerJoin" })
        .modifyGraph('user.shop', bulder => {
            bulder.select(...select)
        })
        .modifyGraph('user.shop.moder_status', bulder => {
            bulder.where("isModerated", 1)
        })
        .first()

    if (regionUsers.length) {
        throw "not found users in this region"
    }

    for (let regionUser of regionUsers.user) {
        if (regionUser.shop[0] && regionUser.shop[0]) {
            points.push(...regionUser.shop)
        }
    }

    points.forEach(elem => {
        elem.moder_status = elem.moder_status[0].moder_status
    })

    return (points)
}

async function setPointRefuse(user, pointId, description) {
    const { moder_status, isModerated } = await Shop.getModerStatusByPointId(pointId)
    if (isModerated == 0) throw "this point does not require moderation"
    switch (moder_status) {
        case "moderated":
            const newModerStatusId =  
            Shop.query()
                .withGraphJoined("[user,moder_status]")
                .modifyGraph('user', bulder => {
                    bulder.where("region_id", user.region_id)
                })
                .where()
            Region.query().findById(user.region_id)
                .withGraphJoined("user.shop.moder_status", { "joinOperation": "innerJoin" })
                .modifyGraph('user.shop.moder_status', bulder => {
                    bulder.where("isModerated", 1)
                })
                .first()
            break
    }
    await Region.query().findById(user.region_id)
        .withGraphJoined("user.shop.moder_status", { "joinOperation": "innerJoin" })
        .modifyGraph('user.shop.moder_status', bulder => {
            bulder.where("isModerated", 1)
        })
        .first()

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
 * с флагом moder_status = "moderated", после радактирования статус точки меняется на accept
 * @param {number} pointId id редактируемой точки 
 * @param {object} point объект содержащий свойства для добавления
 * @return {number} id отредактированной точки
 * @throws {"incorrect pointId"} pointId невозможно преобразовать к целочисленному типу
 * @throws {"fail"} редактирование не удалось
 */
async function editPointModer(pointId, point) {

    if (!pointId || !Number.isInteger(+pointId)) {
        throw "incorrect pointId"
    }
    const moderStatusModerated = await getIdByModerStatus("moderated")
    const moderStatusAccept = await getIdByModerStatus("accept")
    point.description = null
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