const User = require("../orm/user")
const Shop = require("../orm/shop")
const Permission = require("../orm/permission")
const fetch = require('node-fetch')
const Moder_status = require("../orm/moder_status")
const apiYandex = require("../../../serverConfig").yandex.apiKey

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
    return Moder_status.query().where("moder_status", moderStatus).then(res => res.map(elem => elem.id))
}

async function getPrepareForInsert(fields) {
    const geoData = {}
    if (+fields.lat && +fields.lng) {
        geoData.lat = +fields.lat
        geoData.lng = +fields.lng
        await getGeoData(geoData)
    }

    switch (fields.isActive) {
        case undefined: fields.isActive = true; break;
        case "false": case "0": fields.isActive = false; break;
    }
    fields.isActive = Boolean(fields.isActive)

    return Object.assign({
        title: fields.title,
        apartment: fields.apartment,
        hours: fields.hours,
        phone: fields.phone,
        site: fields.site,
        isActive: fields.isActive,
        description: fields.description,
    }, geoData)
}

function getGeoData(point) { //должен содержать поля lat, lng; модефецирует обьект добовляя full_city_name, city, street, house
    return fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiYandex}&geocode=${point.lat},${point.lng}&format=json&kind=house&results=1`)
        .then(res => res.json())
        .then(res => res.response.GeoObjectCollection.featureMember[0].GeoObject)
        .then(gedObject => {
            point.full_city_name = gedObject.description
            point.city = gedObject.description.split(",")[0]
            const geoComponents = gedObject.metaDataProperty.GeocoderMetaData.Address.Components
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

async function getPointUser(userId,pointId) {
    return Shop
        .query()
        .withGraphFetched("moder_status")
        .skipUndefined()
        .select("id", "title", "lng", "lat", "apartment", "hours", "phone", "site", "isActive", "description")
        .andWhere({"user_id": userId, "id": pointId})
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