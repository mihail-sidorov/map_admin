'use strict'
const Shop = require("../orm/shop")
const { markDuplicate, getPoint, startFnByModerStatus } = require("./utilityFn")
const Moder_status = require("../orm/moder_status")

async function addPoint(user, point, force) {
    point.user_id = user.id
    point.moder_status_id = await Moder_status.getIdByModerStatus("moderated")

    const pointId = await Shop
        .query()
        .insert(point)
        .then(res => res.id)

    await markDuplicate(point, force, pointId)
    return Shop.getPoint(pointId)
}

async function getPoints(user) {
    let userId
    const select = [
        "shops.id",
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
        "timeStamp",
        "moder_status",
        "email"
    ]

    if (user.permission[0].permission == "user") {
        userId = user.id
    }

    return Shop.query()
        .joinRelated("[user,moder_status]")
        .whereNull("parent_id")
        .skipUndefined()
        .andWhere({ "user_id": userId, "region_id": user.region_id })
        .select(...select)
}

async function delPoint(pointId) {
    return await startFnByModerStatus(pointId, {
        "moderated, refuse": {
            "notHasAcceptCopy": async () => await Shop.delPoint(pointId),
            "hasAcceptCopy": async () => {
                await Shop.returnAcceptCopyToMaster(pointId)
                await Shop.createNewMasterWithStatus(pointId, "delete")
                return { delete: false }
            }
        },
        "delete": () => { throw "point already has delete status" },
        "accept": async () => {
            await Shop.createNewMasterWithStatus(pointId, "delete")
            return { delete: false }
        }
    })
}


async function editPoint(pointId, point, force) {

    let { description, ...data } = point
    if (!description) description = null
    if (!Object.keys(point).length) return Shop.getPoint(pointId)

    //проверка данных на изменение
    //если все поля пустые, то ничего не изменилось

    let currentPointData = await Shop.query().findById(pointId)
    let checkResult = await currentPointData.$query().skipUndefined().andWhere(data)
    if (!currentPointData.description) currentPointData.description = null
    const isDescChange = (currentPointData.description != description)
    const isDataChange = !checkResult

    if (!isDataChange && !isDescChange) return Shop.getPoint(pointId)

    const response = await startFnByModerStatus(pointId, {
        "accept": async () => {
            if (!isDataChange) return Shop.getPoint(pointId)
            await Shop.createNewMasterWithStatus(pointId, "moderated")
            await Shop.patchData(pointId, point)
            return Shop.getPoint(pointId)
        },
        "refuse": async () => {
            await Shop.setStatus(pointId, "moderated")
            await Shop.patchData(pointId, point)
            return Shop.getPoint(pointId)
        },
        "moderated": async () => {
            await Shop.patchData(pointId, point)
            return Shop.getPoint(pointId)
        },
        "delete": async () => {
            if (!isDescChange) return Shop.getPoint(pointId)
            //при удалении меняем только комментарии
            await Shop.patchData(pointId, { description: point.description })
            return Shop.getPoint(pointId)
        }

    })

    await markDuplicate(pointId, point, force)

    return response

}

exports.addPoint = addPoint
exports.getPoints = getPoints
exports.delPoint = delPoint
exports.editPoint = editPoint