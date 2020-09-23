'use strict'
const Shop = require("../orm/shop")

const { getDuplicate, markDuplicate, checkTimeStamp, getPoint, getIdByModerStatus, getPrepareForInsert, getGeoData } = require("./utilityFn")
const Moder_status = require("../orm/moder_status")

async function addPoint(user, point, force) {
    //добовляем street, house, full_city_name
    await getGeoData(point)

    const points = await getDuplicate(point)
    if (points && !force) {
        return {
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
                }
            }
        }
    }

    point.user_id = user.id
    point.moder_status_id = await Moder_status.getIdByModerStatus("moderated")

    const pointId = await Shop
        .query()
        .insert(point)
        .then(res => res.id)

    await markDuplicate(point, force, pointId)
    return getPoint(user, pointId)
}

async function getPoints(user) {
    return getPoint(user)
}

async function delPoint(userId, pointId) {
    return Shop
        .query()
        .delete()
        .where({ "id": pointId, "user_id": userId })
        .then(res => {
            if (res) {
                return "OK"
            } else {
                throw "point id not found"
            }
        })
}

/**
 * Функция редактирования точек пользоателем. Стауc меняется на moderated в случаях:
 * Меняются любые поля кроме isActive, description;
 * Меняется discription при статусе refuse
 * @param {number} user.id id пользователя
 * @param {string} user.permission[0].permission права пользователя
 * @param {number} pointId id точки
 * @param {object} point обьект с полями для редактирования см.  editPointUserRequest.v1.json
 * @return {object} данные добавленной точки в случае успеха см. {@link ../openApi/models/getPointsUser.v1.json} 
 * в случае дубликата (точка ближе чем ~200 метров к другой точке с базы) см. {@link ../openApi/models/duplicate.v1.json} 
 */

async function editPoint(user, pointId, point) {

    const { moder_status, isModerated } = await Shop.getModerStatusByPointId(pointId)
    if (moder_status == "accept" ||
        !req.body.description) {
        delete (req.body.description)
    }

    const moderStatusRefuse = await Moder_status.getIdByModerStatus("refuse")
    const moderStatusModerated = await Moder_status.getIdByModerStatus("moderated")

    const { description, ...checkData } = point
    checkData.id = pointId
    checkData.user_id = user.id

    await Shop.query().skipUndefined().first().where(checkData).then((res) => {
        //если хоть одно поле меняется кроме isActiv или description тогда ставим статуы moderated
        //если меняется комментарии при статусе refuse тогда статус тоже ставим moderated
        if (!res || (res.description != description && res.moder_status_id == moderStatusRefuse)) {
            updateData.moder_status_id = moderStatusModerated
            //если ничего не меняли при статусе не равном refuse и moderated то отчищаем комментарии
        } else if (res.moder_status_id != moderStatusModerated) {
            res.description = null
        }
    })

    const isSuccess = await Shop
        .query()
        .where({ "id": pointId, "user_id": user.id })
        .patch(updateData).then(Boolean)
    if (isSuccess) {
        markDuplicate(dupIds, pointId)
        return getPoint(user, pointId)
    } else {
        throw "editing failed"
    }
}

exports.addPoint = addPoint
exports.getPoints = getPoints
exports.delPoint = delPoint
exports.editPoint = editPoint