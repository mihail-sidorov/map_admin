const Shop = require("../orm/shop")
const { getIdByIsModerated } = require("./utilityFn")

async function getPointsModer() {
    const isModerated = await getIdByIsModerated(0)

    return Shop
        .query()
        .withGraphJoined("moder_status")
        .select("id", "title", "apartment", "hours", "phone", "site", "isActive", "description", "full_city_name")
        .whereIn("moder_status_id", isModerated)
        .then(res => {
            res.forEach(elem => {
                elem.moder_status = elem.moder_status[0].moder_status
            })
            return res
        })
}

function pointRefuse(id, description) {
    
}

exports.getPointsModer = getPointsModer
exports.pointRefuse = pointRefuse