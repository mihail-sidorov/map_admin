'use strict'
const Shop = require("../orm/shop")

const { getDuplicate, markDuplicate, checkTimeStamp, getPointUser, getIdByModerStatus, getPrepareForInsert } = require("./utilityFn")

async function addPoint(point, id) {
    if (!(+point.lat && +point.lng)) throw "lat and lng must not be empty"

    const insertField = await getPrepareForInsert(point)
    const { points, dupIds } = await getDuplicate(insertField)
    if (points && !point.force) {
        const response = {
            "outputAsIs": true,
            "duplicate": {
                "points": points,
                "point": insertField
            }
        }
        throw response
    }

    insertField.user_id = id
    insertField.moder_status_id = await getIdByModerStatus("moderated")
    const pointId = await Shop
        .query()
        .insert(insertField)
        .then(res => res.id)

    await markDuplicate(dupIds, pointId)
    return getPointUser(id, pointId)
}

async function getPointsUser(userId) {
    if (Number.isInteger(userId)){
        return getPointUser(userId)
    } else {
        throw "userId must not be empty"
    }
}

async function delPoint(userId, pointId) {
    userId=+userId
    pointId=+pointId
    if (!userId) throw "userId must not be empty"
    if (!pointId) throw "pointId must not be empty"
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

async function editPoint(userId, pointId, point) {
    await checkTimeStamp(pointId, point.timeStamp)
    const moderStatusRefuse = await getIdByModerStatus("refuse")
    const updateData = await getPrepareForInsert(point)
    const { isActive, description, ...checkData } = updateData
    const { points, dupIds } = await getDuplicate(point,pointId)

    if (points && !point.force) {
        const response = {
            "outputAsIs": true,
            "duplicate": {
                "points": points,
                "point": updateData
            }
        }
        throw response
    }

    checkData.id = pointId
    checkData.user_id = userId
    await Shop.query().skipUndefined().first().where(checkData).then(async (res) => {
        if (!res || (res.description != description && res.moder_status_id == moderStatusRefuse)) {
            updateData.moder_status_id = await getIdByModerStatus("moderated")
        }
    })

    const isSuccess = await Shop
        .query()
        .where({ "id": pointId, "user_id": userId })
        .patch(updateData).then(Boolean)
    if (isSuccess) {
        markDuplicate(dupIds, pointId)
        return getPointUser(userId, pointId)
    } else {
        throw "editing failed"
    }
}

exports.addPoint = addPoint
exports.getPointsUser = getPointsUser
exports.delPoint = delPoint
exports.editPoint = editPoint