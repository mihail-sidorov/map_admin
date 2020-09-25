'use strict'
const Shop = require("../orm/shop")
const { markDuplicate, getPoint } = require("./utilityFn")
const Moder_status = require("../orm/moder_status")
const { knex } = require("../orm/region")

async function addPoint(user, point, force) {
    point.user_id = user.id
    point.moder_status_id = await Moder_status.getIdByModerStatus("moderated")

    const pointId = await Shop
        .query()
        .insert(point)
        .then(res => res.id)

    await markDuplicate(point, force, pointId)
    return getPoint(user, pointId)
}

async function getPoints(user) {
    return getPoint(user)
}

async function delPoint(user, pointId) {
    const isMaster = await Shop.isMasterPoint(pointId)
    const { moder_status } = await Shop.getModerStatusByPointId(pointId)

    const createDelChild = async (trx) => {
        const point = await Shop.query(trx).findById(pointId).select("*")
        point.parent_id = point.id
        point.moder_status_id = Moder_status.getIdByModerStatus("delete")
        delete (point.id)
        const insertPoint = await Shop.query(trx).insert(point)
        if (insertPoint) {
            return getPoint(user, insertPoint.id)
        } else {
            throw "fail"
        }
    }

    const immediateDelete = async () => {
        if (await Shop.query().deleteById(pointId)) {
            return "OK"
        } else {
            return "fail"
        }
    }

    const clearAndCreateDelChild = async () => {
        await knex.transaction(async trx => {
            if (await Shop.query(trx).delete().where("parent_id", pointId)) {
                await createDelChild(trx)
            } else {
                throw "fail"
            }   
        })
    }


    switch (moder_status) {
        case "accept":
            if (isMaster) await createDelChild()
            //невозможный вариант обрабатываем на всякий случай
            if (!isMaster) await immediateDelete()
            break
        case "moderated":
            if (isMaster) await immediateDelete()
            if (!isMaster) await clearAndCreateDelChild()
            break
        case "delete":
            throw "point already has delete status"
            break
        case "refuse":
            if (isMaster) await immediateDelete()
            if (!isMaster) await clearAndCreateDelChild()
            break
    }

    return Shop
        .query()
        .delete()
        .where({ "id": pointId, "user_id": userId })
        .then(res => {
            if (res) {
                return "OK"
            } else {
                throw "point id not found"
            }
        })
}


async function editPoint(user, pointId, point, force) {
    const select = [
        "lng",
        "lat",
        "title",
        "apartment",
        "hours",
        "phone",
        "site",
        "description",
        "force",
        "isActive"]
    let checkResult, shopCopy, insertData
    const { moder_status } = await Shop.getModerStatusByPointId(pointId)
    const { description, ...checkData } = point
    if (!Object.keys(point).length) return getPoint(user, pointId)

    //проверка данных на изменение
    //если все поля пустые, то ничего не изменилось

    shopCopy = await Shop.query().findById(pointId).select(...select, "parent_id")
    checkResult = shopCopy.$query().where(checkData)
    if (checkResult && !checkResult.description) checkResult.description = undefined
    const isDescChange = (checkResult.description == description)
    const isDataChange = !checkResult
    const isMaster = !shopCopy.parent_id
    delete (shopCopy.parent_id)
    if (!isDataChange && !isDescChange) return getPoint(user, pointId)

    const editCurrentFn = async () => {
        const newPoint = await Shop.query().findById(pointId).patch(point)
        if (!newPoint) throw "fail"
        return getPoint(user, pointId)
    }

    const createChildFn = async () => {
        const { id, ...shopCopyWithoutId } = shopCopy
        const newPoint = await Shop.query().insert(Object.assign(shopCopyWithoutId, point))
        if (!newPoint) throw "fail"
        return getPoint(user, newPoint.id)
    }

    switch (moder_status) {
        case "accept":
            if (!isDataChange) return getPoint(user, pointId)
            if (isDataChange) point = Moder_status.getIdByModerStatus("moderate")
            if (isMaster) await createChildFn()
            break
        case "refuse":
            if (isDataChange || isDescChange) point = Moder_status.getIdByModerStatus("moderate")
            if (isMaster || !isMaster) await editCurrentFn()
            break
        case "delete":
            if (!isDescChange) return getPoint(user, pointId)
            if (isMaster || !isMaster) await editCurrentFn()
            break
        case "moderated":
            if (isMaster || !isMaster) await editCurrentFn()
    }
}

exports.addPoint = addPoint
exports.getPoints = getPoints
exports.delPoint = delPoint
exports.editPoint = editPoint