'use strict'

const Shop = require("../orm/shop")
const { getIdByModerStatus, getIdByIsModerated, getPrepareForInsert } = require("./utilityFn")

async function getPointsModer() {
    const isModerated = await getIdByIsModerated(1)

    return Shop
        .query()
        .withGraphFetched("moder_status")
        .select("id", "title", "apartment", "hours", "phone", "site", "description", "full_city_name", "house", "street")
        .whereIn("moder_status_id", isModerated)
        .then(res => {
            res.forEach(elem => {
                elem.moder_status = elem.moder_status[0].moder_status
            })
            return res
        })
}

async function setPointRefuse(pointId, description) {
    pointId=+pointId
    if (!pointId) throw "pointId must not be empty"
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("refuse")

    if (!description) {
        description = null
    }
    return Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere("id", pointId)
        .patch({ "description": description, "moder_status_id": moderStatus })
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

async function setPointAccept(pointId) {
    pointId=+pointId
    if (!pointId) throw "pointId must not be empty"
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("accept")
    return Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere("id", pointId)
        .patch({ "moder_status_id": moderStatus, description: null })
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

async function editPointModer(pointId, point) {
    pointId=+pointId
    if (!pointId) throw "pointId must not be empty"
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("accept")
    const insertData = await getPrepareForInsert(point, "moder")
    insertData.moder_status_id = moderStatus
    insertData.description = null
    return await Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere({ "id": pointId })
        .patch(insertData)
        .then(res => {
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse
exports.setPointAccept = setPointAccept
exports.editPointModer = editPointModer