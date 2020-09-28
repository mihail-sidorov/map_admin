'use strict'

const Shop = require("../orm/shop")
const Region = require("../orm/region")
const { startFnByModerStatus } = require("./utilityFn")

/**
 * Получение точек для модерации по id региона
 * @param {number} regionId id региона модератора
 * @return {} Возвращаем список точке в виде обьектов со свойствами точки в
 * массиве AAA
 */
async function getPointsModer(regionId) {
    const select = [
        "id",
        "title",
        "apartment",
        "hours",
        "phone",
        "site",
        "description",
        "full_city_name",
        "house",
        "street",
        "isActive"]
    const points = []

    const regionUsers = await Region.query().findById(regionId)
        .withGraphJoined("user.shop.moder_status", { "joinOperation": "innerJoin" })
        .modifyGraph('user.shop', bulder => {
            bulder.select(...select)
        })
        .modifyGraph('user.shop.moder_status', bulder => {
            bulder.where("isModerated", 1)
        })
        .first()

    if (regionUsers.length) {
        throw "not found users in this region"
    }

    for (let regionUser of regionUsers.user) {
        if (regionUser.shop[0] && regionUser.shop[0]) {
            points.push(...regionUser.shop)
        }
    }

    points.forEach(elem => {
        elem.moder_status = elem.moder_status[0].moder_status
    })

    return (points)
}

async function setPointRefuse(pointId, description) {
    if (!description) description = null

    await startFnByModerStatus(pointId, {
        "moderated": async () => await Shop.setStatus(pointId, "refuse"),
        "delete": async () => await Shop.returnAcceptCopyToMaster(pointId)
    })

    return "OK"
}

async function setPointAccept(pointId) {
    await startFnByModerStatus(pointId, {
        "moderated": {
            "child": async () => await Shop.setMaster(pointId),
            "after": async () => await Shop.setStatus(pointId, "accept")
        },
        "delete": async () => await Shop.delPointGroup(pointId)
    })

    return "OK"
}

async function editPointModer(pointId, point) {
    await startFnByModerStatus(pointId, {
        "moderated": {
            child: async () => await Shop.setMaster(pointId),
            after: async () => {
                await Shop.patchData(pointId, point)
                await Shop.setStatus(pointId, "accept")
            }
        }
    })

    return "OK"
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse
exports.setPointAccept = setPointAccept
exports.editPointModer = editPointModer