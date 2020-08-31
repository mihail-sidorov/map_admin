const Shop = require("../orm/shop")
const { getIdByIsModerated } = require("./utilityFn")

async function getPointsModer() {
    const isModerated = await getIdByIsModerated(1)

    return Shop
        .query()
        .withGraphFetched("moder_status")
        .select("id", "title", "apartment", "hours", "phone", "site", "isActive", "description", "full_city_name")
        .whereIn("moder_status_id", isModerated)
        .then(res => {
            res.forEach(elem => {
                elem.moder_status = elem.moder_status[0].moder_status
            })
            return res
        })
}

function setPointRefuse(pointId, description) {
    Shop
        .query()
        .where("id", pointId)
        .patch({ "description": description, "moder_status_id": getIdByModerStatus("refuse") })
        .then(res => {
            if (res) {
                return "OK"
            } else {
                
            }
        })
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse