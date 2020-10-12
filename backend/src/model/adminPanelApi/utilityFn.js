'use strict'
const Shop = require("../orm/shop")
const fetch = require('node-fetch')
const Moder_status = require("../orm/moder_status")
const { nanoid } = require("nanoid")
const Region = require("../orm/region")
const apiYandex = require("../../../serverConfig").yandex.apiKey

/**
 * Функция исполняет колбеки при различных статусах точки(moder_status)
 * @param {number} pointId ID точки
 * @param {object} moderStatusObject Объект с колбеками 
 * {"%moder_status%":
 *  {
 *      before: callback, //если колбек вернет результат true то выполнение функций дальше остановится, а выводом будут этот результат
 *      hasAcceptCopy: callback,
 *      notHasAcceptCopy: callback, 
 *      after: callback 
 *  },
 *  "%moder_status1%": callback
 * }
 * 
 * Колбеки вызваются с параметрами (child, pointData), данные точки и ее потомка
 * @return {*} результат функции before, если она что то вернет, то выполнение калбеков
 * на ней прекратится.
 * Если нет то вернет результат after если он не равен undifiend
 * Если after не выдаст результата будут возвращены результаты  hasAcceptCopy или notHasAcceptCopy
 */
async function startFnByModerStatus(pointId, moderStatusObject) {
    if (!moderStatusObject) throw "moderStatusObject must be not empty"

    let result, callback

    const pointData = await Shop.query().findById(pointId)
    if (pointData.parent_id) throw "only the main point can be edited"

    const child = await Shop.query().where("parent_id", pointId).first()
    const isHasChild = Boolean(child)

    const { moder_status } = await Moder_status.query().findById(pointData.moder_status_id)

    if (isHasChild && moder_status == "accept") {
        await Shop.delPoint(child.id)
        throw "only non-accept point can have an copy"
    }

    for (let key in moderStatusObject) {
        if (key.includes(moder_status)) {
            callback = moderStatusObject[key]
        }
    }

    //условия для выполнение other, что нет функции для выполнения в данном случае
    if (
        (
            !callback
            ||
            (
                !callback.after
                &&
                !callback.before
                &&
                !(isHasChild && callback.hasAcceptCopy)
                &&
                !(!isHasChild && callback.notHasAcceptCopy)
                &&
                typeof callback !== "function"
            )
        )
        &&
        moderStatusObject.other
    ) {
        return run(moderStatusObject.other)
    } else if (!callback) {
        return
    }

    async function run(fn) {
        if (typeof fn === "function") return fn(child, pointData)
    }

    if (typeof callback === "function") {
        return callback(child, pointData)
    }
    //если before вернет true, то дальше ничего выполнятся не будет, а просто выведется возвращенный результат
    if (typeof callback.before === "function" && (result = callback.before(child, pointData))) {
        return result
    }
 
    if (isHasChild) {
        result = await run(callback.hasAcceptCopy)
    } else {
        result = await run(callback.notHasAcceptCopy)
    }

    const returnAfter = await run(callback.after)

    return returnAfter ? returnAfter: result
}

async function throwDuplicate(point, pointId) {
    const points = await getDuplicate(point, pointId)
    if (points && !point.force) {
        throw {
            "outputAsIs": true,
            "duplicate": {
                "points": points,
                "point": {
                    title: point.title,
                    hours: point.hours,
                    phone: point.phone,
                    site: point.site,
                    lat: point.lat,
                    lng: point.lng,
                    full_city_name: point.full_city_name,
                    city: point.city,
                    street: point.street,
                    house: point.house,
                    apartment: point.apartment
                }
            }
        }
    } else if (!points && point.force) {
        delete (point.force)
    }
}

async function getDuplicate(point, pointId) {
    const pointAccuratyMeter = 200
    const pointAccuratyDegrees = 0.00000900900900900901 * pointAccuratyMeter
    const select = ["shops.id", "full_city_name", "street", "house", "title", "lng", "lat", "apartment", "hours", "phone", "site", "email"]
    const dupCoord = await Shop.query().select(...select, "duplicateGroup").joinRelated("user")
        .whereBetween("lat", [+point.lat - pointAccuratyDegrees, +point.lat + pointAccuratyDegrees])
        .andWhereBetween("lng", [+point.lng - pointAccuratyDegrees, +point.lng + pointAccuratyDegrees])
        .skipUndefined().andWhereNot("shops.id", pointId)

    if (!dupCoord[0]) {
        return false
    }
    let dupIds
    const dupGroup = dupCoord.map((value) => {
        return value.duplicateGroup
    })
    //выбираем только уникальные и непустые значения из массива групп
    const dupGroupUnique = dupGroup.filter((v, i, a) => (v != null && a.indexOf(v) === i))

    if (dupGroupUnique.length) {
        dupIds = dupCoord.map((value) => {
            return value.id
        })
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
        .skipUndefined().andWhereNot("shops.id", pointId)
}

async function markDuplicate(pointId, point, force) {

    if (!point || !point.lat || !point.lng) {
        return
    }
    if (!force) {
        return await Shop.query().findById(pointId).patch({ "duplicateGroup": null })
    }
    const duplicate = await getDuplicate(point)
    const dupIds = duplicate.map((elem) => {
        return elem.id
    })

    if (dupIds.length == 1) {
        return await Shop.query().findByIds(dupIds).patch({ "duplicateGroup": null })
    } else if (dupIds.length > 1) {
        return await Shop.query().findByIds(dupIds).patch({ "duplicateGroup": nanoid() })
    }
}

function checkTimeStamp(pointId, timeStamp) {
    timeStamp = timeStamp.replace(/T/, " ").slice(0, 19)
    return Shop.query()
        .first()
        .where({ "id": pointId, "timeStamp": timeStamp })
        .then(Boolean)
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

exports.checkTimeStamp = checkTimeStamp
exports.throwDuplicate = throwDuplicate
exports.markDuplicate = markDuplicate
exports.getGeoData = getGeoData
exports.startFnByModerStatus = startFnByModerStatus