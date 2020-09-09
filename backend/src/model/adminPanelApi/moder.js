const Shop = require("../orm/shop")
const { checkTimeStamp, getIdByModerStatus, getIdByIsModerated, getPrepareForInsert } = require("./utilityFn")

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
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("refuse")

    if (!description) {
        throw "the field description in must not be empty"
    }
    return Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere("id", pointId)
        .patch({ "description": description, "moder_status_id": moderStatus })
        .then(res => {
            console.log(res)
            if (res) {
                return pointId
            } else {
                throw "fail"
            }
        })
}

async function setPointAccept(pointId) {
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
//full_city_name, title, apartment, hours, phone, site, description
'use strict'
async function editPointModer(id, point) {
    const isModerated = await getIdByIsModerated(1)
    const moderStatus = await getIdByModerStatus("accept")
    const insertData = await getPrepareForInsert(point, "moder")
    insertData.moder_status_id = moderStatus
    insertData.description = null
    return await Shop
        .query()
        .whereIn("moder_status_id", isModerated)
        .andWhere({ "id": id })
        .patch(insertData)
        .then(res => {
            if (res) {
                return id
            } else {
                throw "editing failed"
            }
        })
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse
exports.setPointAccept = setPointAccept
exports.editPointModer = editPointModer