const Shop = require("../../../src/model/orm/shop")
const { getPoints } = require("../../../src/model/adminPanelApi/user")
const Moder_status = require("../../../src/model/orm/moder_status")

test("getModerStatusByPointId", async () => {
    const points= await Shop.query().limit(10).joinRelated("moder_status").select("moder_status","shops.id","isModerated")
    for (let elem of points) {
        expect(expect.objectContaining(await Shop.getModerStatusByPointId(elem.id))).toEqual(elem)
    }
})

test ("isMasterPoint", async () => {
    let newPoint
    const moderated = await Moder_status.getIdByModerStatus("moderated")
    newPoint = await Shop.query().insert({lng: 22, lat:22, moder_status_id: moderated, user_id: -2})
    expect(await Shop.isMasterPoint(newPoint.id)).toBe(true)
    await Shop.query().deleteById(newPoint.id)
    newPoint = await Shop.query().insert({parent_id:-111, lng: 22, lat:22, moder_status_id: moderated, user_id: -2, parent_id: -33})
    expect(await Shop.isMasterPoint(newPoint.id)).toBe(false)
    await Shop.query().deleteById(newPoint.id)
})