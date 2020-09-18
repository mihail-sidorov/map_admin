const Shop = require("../../../src/model/orm/shop")
const { getPoints } = require("../../../src/model/adminPanelApi/user")

test("getModerStatusByPointId", async () => {
    const points= await Shop.query().limit(10).joinRelated("moder_status").select("moder_status","shops.id")
    for (let elem of points) {
        expect(await Shop.getModerStatusByPointId(elem.id)).toEqual(elem.moder_status)
    }
})