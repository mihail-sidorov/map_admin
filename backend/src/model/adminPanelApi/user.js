'use strict'
const Shop = require("../orm/shop")
const { markDuplicate, getPoint, startFnByModerStatus } = require("./utilityFn")
const Moder_status = require("../orm/moder_status")
const { getPointSelect } = require("../globalValue")

async function getPointsFree(user) {

    return Shop.query()
        .joinRelated("[user.permission, moder_status]")
        .whereIn("permission", ["moder"])
        .where({ region_id: user.region_id, moder_status: "accept", parent_id: null })
        .orWhere({ moder_status: "return", "user_id": user.id })
        .select(...getPointSelect)
}

async function takePoint(pointId, user) { 
    await startFnByModerStatus(pointId, {
        accept: {
            notHasAcceptCopy: async () => {
                await Shop.createNewMasterWithStatus(pointId, "take")
                await Shop.patchData(pointId, { user_id: user.id })
            }
        },
        return: {
            hasAcceptCopy: async () => {
                await Shop.returnAcceptCopyToMaster(pointId)
            }
        },
        other: () => {
            throw "fail"
        }
    })

    return Shop.getPoint(pointId)
}

async function returnPoint(pointId) {
    await startFnByModerStatus(pointId, {
        accept: {
            notHasAcceptCopy: async () => {
                await Shop.createNewMasterWithStatus(pointId, "return")   
            }
        },
        take: {
            hasAcceptCopy: async () => {
                await Shop.returnAcceptCopyToMaster(pointId)
            }
        },
        other: () => {
            throw "fail"
        }
    }) 

    return Shop.getPoint(pointId)
}

async function addPoint(user, point, force) {

    point.user_id = user.id
    point.moder_status_id = await Moder_status.getIdByModerStatus("moderated")
    const pointId = await Shop
        .query()
        .insert(point)
        .then(res => res.id)

    await markDuplicate(pointId, point, force)
    return Shop.getPoint(pointId)
}

async function getPoints(user) {
    let userId

    if (user.permission[0].permission == "user") {
        userId = user.id
    }

    return Shop.query()
        .joinRelated("[user,moder_status]")
        .whereNull("parent_id")
        .skipUndefined()
        .andWhere({ "user_id": userId, "region_id": user.region_id })
        .select(...getPointSelect)
}

async function delPoint(pointId) {
    return await startFnByModerStatus(pointId, {
        "moderated, refuse": {
            "notHasAcceptCopy": async () => {
                await Shop.delPoint(pointId)
                return { delete: true}
            },
            "hasAcceptCopy": async () => {
                await Shop.returnAcceptCopyToMaster(pointId)
                await Shop.createNewMasterWithStatus(pointId, "delete")
                return { delete: false, point: (await Shop.getPoint(pointId))[0] }
            }
        },
        "delete": () => { throw "point already has delete status" },
        "accept": async () => {
            await Shop.createNewMasterWithStatus(pointId, "delete")
            return { delete: false, point: (await Shop.getPoint(pointId))[0] }
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
        },
        "other": () => {
            throw "fail"
        }

    })

    await markDuplicate(pointId, point, force)

    return response

}

exports.addPoint = addPoint
exports.getPoints = getPoints
exports.delPoint = delPoint
exports.editPoint = editPoint
exports.getPointsFree = getPointsFree
exports.takePoint = takePoint
exports.returnPoint = returnPoint