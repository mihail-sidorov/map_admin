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
    return getPoint(user, pointId)
}

async function getPoints(user) {
    return getPoint(user)
}

async function delPoint(pointId) {
    const result = await startFnByModerStatus(pointId, {
        "moderated, refuse": {
            "parent": async () => { await Shop.delPoint(pointId) },
            "child": async (pointData) => {
                await Shop.delPoint(pointId)
                return Shop.createChild(pointData.parent_id, "delete")
            }
        },
        "delete": () => { throw "point already has delete status" },
        "accept": {
            "parent": async () => {
                return Shop.createChild(pointId, "delete")
            },
            "child": async () => { await Shop.delPoint(pointId) }
        }
    })

    if (result) {
        return result
    } else {
        return "OK"
    }
}


async function editPoint(pointId, point) {

    const { description, ...data } = point
    if (!description) description = null
    if (!Object.keys(point).length) return Shop.getPoint(pointId)

    //проверка данных на изменение
    //если все поля пустые, то ничего не изменилось

    let checkResult = await Shop.query().where("id",pointId).andWhere(data).first()
    if (checkResult && !checkResult.description) checkResult.description = null
    const isDescChange = (checkResult.description != description)
    const isDataChange = !checkResult
    
    if (!isDataChange && !isDescChange) return Shop.getPoint(pointId)

    return await startFnByModerStatus(pointId, {
        "accept": async () => {
            if (!isDataChange) return Shop.getPoint(pointId)
            const childPointData = await Shop.createChild(pointId, "moderated")
            await Shop.patchData(childPointData.id, point)
            return Shop.getPoint(childPointData.id)
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
            await Shop.patchData(pointId, {description:point.description})
            return Shop.getPoint(pointId)
        }

    })

}

exports.addPoint = addPoint
exports.getPoints = getPoints
exports.delPoint = delPoint
exports.editPoint = editPoint