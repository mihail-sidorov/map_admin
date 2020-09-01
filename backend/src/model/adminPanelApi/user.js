
const Shop = require("../orm/shop")

const { getPointUser, getIdByModerStatus, getPrepareForInsert } = require("./utilityFn")

async function addPoint(point, id) {
    const insertField = await getPrepareForInsert(point)
    insertField.user_id = id
    insertField.moder_status_id = await getIdByModerStatus("accept")

    pointId = await Shop
        .query()
        .insert(insertField)
        .then(res => res.id)
    return getPointUser(id, pointId)
}

function getPointsUser(id) {
    return getPointUser(id)
}

function delPoint(userId, pointId) {
    return Shop
        .query()
        .delete()
        .where({ "id": pointId, "user_id": userId })
        .then(res => {
            if (res) {
                return res
            } else {
                throw "point id not found"
            }
        })
}

async function editPoint(userId, pointId, fields) {
    const moderStatusRefuse = await getIdByModerStatus("refuse")
    const updateData = await getPrepareForInsert(fields)
    const { isActive, description, ...checkData } = updateData
    checkData.id = pointId
    checkData.user_id = userId
    checkData.timeStamp = fields.timeStamp
    await Shop.query().skipUndefined().first().where(checkData).then(async (res) => {
        if (!res) {
            updateData.moder_status_id = await getIdByModerStatus("moderated")
        } else if (res.description != description && res.moder_status_id == moderStatusRefuse) {
            updateData.moder_status_id = await getIdByModerStatus("moderated")
        }
    })

    isSuccess = await Shop
        .query()
        .where({ "id": pointId, "user_id": userId })
        .patch(updateData).then(Boolean)
    if (isSuccess) {
        return getPointUser(userId, pointId)
    } else {
        throw "editing failed"
    }
}

exports.addPoint = addPoint
exports.getPointsUser = getPointsUser
exports.delPoint = delPoint
exports.editPoint = editPoint