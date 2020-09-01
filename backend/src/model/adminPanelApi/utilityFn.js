const User = require("../orm/user")
const Shop = require("../orm/shop")
const Permission = require("../orm/permission")
const fetch = require('node-fetch')
const Moder_status = require("../orm/moder_status")
const apiYandex = require("../../../serverConfig").yandex.apiKey

function checkTimeStamp(pointId, timeStamp) {
    if (!point.timeStamp) throw "the field timeStamp in must not be empty"
    return Shop
        .query()
        .first()
        .where({ "id": pointId, "timeStamp": timeStamp })
        .then(res => {
            if (res) {
                return true
            } else {
                throw "timeStamp does not match"
            }
        })
}

function hasEmail(email) {
    return User
        .query()
        .first()
        .where("email", email)
        .then(Boolean)
}

function getIdByPermission(permission) {
    return Permission
        .query()
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

async function getPrepareForInsert(fields, flag = "user") {
    const flagData = {}
    if (flag == "user") {

        if (+fields.lat && +fields.lng) {
            flagData.lat = +fields.lat
            flagData.lng = +fields.lng
            await getGeoData(flagData)
        }

        switch (fields.isActive) {
            case "true": case "1": case 1: fields.isActive = true; break;
            case "false": case "0": case 0: fields.isActive = false; break;
            case null: case "null": case "": fields.isActive = undefined; break;
        }

        flagData.isActive = fields.isActive

    } else if (flag == "moder") {
        flagData.street = fields.street
        flagData.house = fields.house
    }

    return Object.assign({
        title: fields.title,
        apartment: fields.apartment,
        hours: fields.hours,
        phone: fields.phone,
        site: fields.site,
        description: fields.description,
    }, flagData)
}

function getGeoData(point) { //должен содержать поля lat, lng; модифецирует обьект добовляя full_city_name, city, street, house
    return fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiYandex}&geocode=${point.lat},${point.lng}&format=json&kind=house&results=1`)
        .then(res => res.json())
        .then(res => res.response.GeoObjectCollection.featureMember[0].GeoObject)
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

async function getPointUser(userId, pointId) {
    return Shop
        .query()
        .withGraphFetched("moder_status")
        .skipUndefined()
        .select("id", "title", "lng", "lat", "apartment", "hours", "phone", "site", "isActive", "description", "timeStamp")
        .andWhere({ "user_id": userId, "id": pointId })
        .then(res => {
            res.forEach(elem => {
                elem.moder_status = elem.moder_status[0].moder_status
            })
            return res
        })
}

exports.hasEmail = hasEmail
exports.getIdByPermission = getIdByPermission
exports.getIdByIsModerated = getIdByIsModerated
exports.getIdByModerStatus = getIdByModerStatus
exports.getPrepareForInsert = getPrepareForInsert
exports.getPointUser = getPointUser
exports.checkTimeStamp = checkTimeStamp