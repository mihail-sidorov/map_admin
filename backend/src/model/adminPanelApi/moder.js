'use strict'

const Shop = require("../orm/shop")
const Region = require("../orm/region")
const { startFnByModerStatus } = require("./utilityFn")

async function getPointsModer(regionId) {
    const select = [
        "shops.id",
        "title",
        "apartment",
        "hours",
        "phone",
        "site",
        "description",
        "full_city_name",
        "house",
        "street",
        "isActive",
        "moder_status",
        "isGeneralPartner"]

    return Shop.query()
        .joinRelated("[user,moder_status]")
        .where({ region_id: regionId, isModerated: 1 })
        .select(...select)
}

async function setPointRefuse(pointId, description) {
    if (!description) description = null

    await startFnByModerStatus(pointId, {
        moderated: async () => {
            await Shop.patchData(pointId, {description})
            await Shop.setStatus(pointId, "refuse")
        },
        delete: async () => await Shop.returnAcceptCopyToMaster(pointId),
        take: async () => await Shop.returnAcceptCopyToMaster(pointId),
        return: async () => await Shop.returnAcceptCopyToMaster(pointId),
        other: () => { throw "fail" }
    })

    return pointId
}

async function setPointAccept(pointId, user) {
    await startFnByModerStatus(pointId, {
        moderated: {
            notHasAcceptCopy: async () => await Shop.setStatus(pointId, "accept"),
            hasAcceptCopy: async (child) => {
                await Shop.delPoint(child.id)
                await Shop.setStatus(pointId, "accept")
            }
        },
        delete: {
            hasAcceptCopy: async (child) => await Shop.delPoint(child.id),
            after: async () => await Shop.delPoint(pointId)
        },
        return: {
            hasAcceptCopy: async (child) => {
                await Shop.patchData(pointId, { user_id: user.id })
                await Shop.setStatus(pointId, "accept")
                await Shop.delPoint(child.id)
            }
        },
        take: {
            hasAcceptCopy: async (child) => {
                await Shop.setStatus(pointId, "accept")
                await Shop.delPoint(child.id)
            }
        },
        other: () => {
            throw "fail"
        }
    })

    return pointId
}

async function editPointModer(pointId, point) {
    await startFnByModerStatus(pointId, {
        moderated: {
            after: async () => {
                await Shop.patchData(pointId, point)
                await Shop.setStatus(pointId, "accept")
            },
            hasAcceptCopy: async (child) => await Shop.delPoint(child.id),
        },
        other: () => { throw "fail" }
    })

    return pointId
}

exports.getPointsModer = getPointsModer
exports.setPointRefuse = setPointRefuse
exports.setPointAccept = setPointAccept
exports.editPointModer = editPointModer