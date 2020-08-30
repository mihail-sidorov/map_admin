
const Shop = require("../orm/shop")

const { getIdByIsModerated, getIdByModerStatus, getPrepareForInsert } = require("./utilityFn")

async function addPoint(point, id) {
    const insertField = await getPrepareForInsert(point)
    insertField.moder_status_id = await getIdByModerStatus("add")

    return Shop
        .query()
        .insert(insertField)
        .then(res => res.id)
        .then(res => ({ id: res }))
}

async function getPointsUser(id) {
    const isModeration = await getIdByIsModerated(1)

    return Shop
        .query()
        .withGraphJoined("moder_status")
        .select("id", "title", "lng", "lat", "apartment", "hours", "phone", "site", "isActive", "description")
        .whereIn("moder_status_id", isModeration)
        .andWhere("user_id", id)
        .then(res => {
            res.forEach(elem => {
                elem.moder_status = elem.moder_status[0].moder_status
            })
            return res
        })
}

function delPoint(userId, pointId) {
    Shop
        .query()
        .delete()
        .where({ "id": pointId, "user_id": userId })
}

async function editPoint(userId, pointId, fields) {

    let updateData = await getPrepareForInsert(fields)

    if (updateData.lng) {
        updateData.moder_status_id = await getIdByModerStatus("edit")
    } else {
        fields.description = undefined
    }

    Shop.query()
        .where({ "id": pointId, "user_id": userId })
        .patch(updateData)

    return "OK"
}

exports.addPoint = addPoint
exports.getPointsUser = getPointsUser
exports.delPoint = delPoint
exports.editPoint = editPoint