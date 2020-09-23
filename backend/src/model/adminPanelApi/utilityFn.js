'use strict'
const User = require("../orm/user")
const Shop = require("../orm/shop")
const Permission = require("../orm/permission")
const fetch = require('node-fetch')
const Moder_status = require("../orm/moder_status")
const { nanoid } = require("nanoid")
const Region = require("../orm/region")
const apiYandex = require("../../../serverConfig").yandex.apiKey

async function getDuplicate(point) {
    const pointAccuratyMeter = 200
    const pointAccuratyDegrees = 0.00000900900900900901 * pointAccuratyMeter
    const select = ["shops.id", "full_city_name", "street", "house", "title", "lng", "lat", "apartment", "hours", "phone", "site", "email as user"]
    const dupCoord = await Shop.query().select(...select, "duplicateGroup").joinRelated("user")
        .whereBetween("lat", [+point.lat - pointAccuratyDegrees, +point.lat + pointAccuratyDegrees])
        .andWhereBetween("lng", [+point.lng - pointAccuratyDegrees, +point.lng + pointAccuratyDegrees])

    let dupIds
    //ищем уже расставленные группы
    let dupGroup = await dupCoord.$query().distinct("duplicateGroup")
    //если еть формируем массив из групп [group1,group2,...] и из id
    if (dupGroup && dupGroup[0]) {
        dupGroup = dupGroup.map((value) => {
            return value.duplicateGroup
        })

        dupIds = dupCoord.map((value) => {
            return value.id
        })
        //если нет просто отправляем точки удалив столбец duplicateGroup
    } else {
        dupCoord.forEach((value) => {
            value.duplicateGroup = undefined
        })
        return dupCoord
    }

    return await Shop.query()
        .select(...select)
        .joinRelated("user")
        .whereIn("shops.id", dupIds)
        .orWhereIn("duplicateGroup", dupGroup)
}

async function markDuplicate(point,force,pointId) {
    if (!point.lat || !point.lng) {
        return
    }
    if (!force) {
        return await Shop.query().findById(pointId).patch({ "duplicateGroup": null })
    }
    const duplicate = await getDuplicate(point)
    const dupIds = duplicate.map((elem) => {
        return elem.id
    })
    if (dupIds.length == 1){
        return await Shop.query().findByIds(dupIds).patch({ "duplicateGroup": null })
    } else if (dupIds.length > 1) {
        return await Shop.query().findByIds(dupIds).patch({ "duplicateGroup": nanoid() })
    }
}

function checkTimeStamp(pointId, timeStamp) {
    return Shop.query()
        .first()
        .where({ "id": pointId, "timeStamp": timeStamp })
        .then(Boolean)
}

async function hasUserId(userId) {
    return await User.query()
        .first()
        .findById(userId)
        .then(Boolean)
}

async function hasEmail(email) {
    return await User.query()
        .first()
        .where("email", email)
        .then(Boolean)
}

function getIdByPermission(permission) {
    return Permission.query()
        .first()
        .where("permission", permission)
        .then(result => {
            if (result) {
                return result.id
            } else {
                throw `${permission} permission not found`
            }
        })
}

function getIdByIsModerated(isModerated) {
    return Moder_status.query().where("isModerated", isModerated).then(res => res.map(elem => elem.id))
}

function getIdByModerStatus(moderStatus) {
    return Moder_status.query().where("moder_status", moderStatus).first().then(res => res.id)
}

/**
 * Получение геоданных
 * заполняет свойство street, house, city, full_city_name
 * @param {number} point.lat широта
 * @param {number} point.lng долгота
 * @throws {failed to get geodata} неудалось получить геоданные
 */
function getGeoData(point) { //должен содержать поля lat, lng; модифецирует обьект добовляя full_city_name, city, street, house
    return fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiYandex}&geocode=${point.lat},${point.lng}&format=json&kind=house&results=1`)
        .then(res => res.json())
        .then(res => {
            if (!res.response.GeoObjectCollection.featureMember[0]) {
                throw "failed to get geodata"
            } else {
                return res.response.GeoObjectCollection.featureMember[0].GeoObject
            }
        })
        .then(geoObject => {
            point.full_city_name = geoObject.description
            point.city = geoObject.description.split(",")[0]
            const geoComponents = geoObject.metaDataProperty.GeocoderMetaData.Address.Components
            geoComponents.forEach((elem) => {
                if (elem.kind == "street") {
                    point.street = elem.name
                }
                if (elem.kind == "house") {
                    point.house = elem.name
                }
            })
        })
}

async function getPoint(user, pointId) {
    const points = []
    let userId
    const select = [
        "id",
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
        "timeStamp"]

    if (user.permission[0].permission == "user") {
        userId = user.id
    }

    const regionUsers = await Region.query()
        .withGraphJoined("user.shop.moder_status", { "joinOperation": "innerJoin" })
        .skipUndefined()
        .where({ "regions.id": user.region_id })
        .modifyGraph('user.shop', bulder => {
            bulder.skipUndefined().where({ "shops.id": pointId, "user_id": userId }).select(...select)
        })
        .first()
    if (!regionUsers) return []
    for (let regionUser of regionUsers.user) {
        points.push(...regionUser.shop)
    }

    points.forEach(elem => {
        elem.moder_status = elem.moder_status[0].moder_status
    })

    return points
}

exports.hasUserId = hasUserId
exports.hasEmail = hasEmail
exports.getIdByPermission = getIdByPermission
exports.getIdByIsModerated = getIdByIsModerated
exports.getIdByModerStatus = getIdByModerStatus
exports.getPoint = getPoint
exports.checkTimeStamp = checkTimeStamp
exports.getDuplicate = getDuplicate
exports.markDuplicate = markDuplicate
exports.getGeoData = getGeoData