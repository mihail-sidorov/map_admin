const fp = require("lodash/fp");
const { nanoid } = require("nanoid");
const Moder_status = require("../../src/model/orm/moder_status");
const Shop = require("../../src/model/orm/shop");
const User = require("../../src/model/orm/user");

async function createPoint(userId, status, isHasСhild, data) {
    let point
    if (!data) {
        data = {
            title: nanoid(),
            lng: fp.random(1, 70),
            lat: fp.random(1, 70),
            apartment: nanoid(),
            hours: nanoid(),
            phone: nanoid(),
            site: nanoid(),
            isActive: fp.random(0, 1),
            full_city_name: nanoid()
        }
    } else {
        data = fp.cloneDeep(data)
    }

    data.user_id = userId

    if (isHasСhild && typeof status === "object") {
        data.moder_status_id = await Moder_status.getIdByModerStatus(status.status)

        point = await Shop.query().insert(data)

        data.parent_id = point.id
        data.user_id = status.id
        data.moder_status_id = await Moder_status.getIdByModerStatus("accept")
        await Shop.query().insert(data)
    } else {
        data.moder_status_id = await Moder_status.getIdByModerStatus(status)
        if (isHasСhild) {
            point = await Shop.query().insert(data)
            data.parent_id = point.id
            data.moder_status_id = await Moder_status.getIdByModerStatus("accept")
            await Shop.query().insert(data)
        } else {
            point = await Shop.query().insert(data)
        }
    }

    return point
}

exports.createPoint = createPoint