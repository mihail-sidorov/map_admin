const Knex = require("knex")
const dbConfig = require("../../../serverConfig").db
const apiYandex = require("../../../serverConfig").yandex.apiKey
const fetch = require('node-fetch')

const { Model } = require("objection")

const knex = Knex(dbConfig)

Model.knex(knex)

module.exports = class Shop extends Model {
    static get tableName() {
        return "shops"
    }

    static get relationMappings() {
        const User = require("./user")
        return {
            user: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: "users.id",
                    to: "shops.user_id"
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["lng", "lat", "user_id"],

            properties: {
                lng: { "type": "number" },
                lat: { "type": "number" },
                user_id: { "type": "integer" },
            }
        }
    }

    //title, lng, lat, apartment, hours, phone, site, user_description
    static async addPoint(point, id) {
        await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiYandex}&geocode=${point.lat},${point.lng}&format=json&kind=house&results=1`)
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


        const point_id = await this.query().insert({
            full_city_name: point.full_city_name,
            city: point.city,
            user_id: id,
            title: point.title,
            lng: +point.lng,
            lat: +point.lat,
            apartment: point.apartment,
            hours: point.hours,
            phone: point.phone,
            site: point.site,
            user_description: point.user_description,
            street: point.street,
            house: point.house
        }).then(a => a.id)

        return point_id
    }
}