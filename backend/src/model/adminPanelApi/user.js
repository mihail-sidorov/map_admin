'use strict'
const Shop = require("../orm/shop")

const { getDuplicate, markDuplicate, checkTimeStamp, getPointUser, getIdByModerStatus, getPrepareForInsert } = require("./utilityFn")

async function addPoint(point, id) {
    if (!(+point.lat && +point.lng)) throw "lat and lng must not be empty"

    const insertField = await getPrepareForInsert(point)
    const { points, dupIds } = await getDuplicate(insertField)
    if (points && !point.force) {
        const response = {
            "outputAsIs": true,
            "duplicate": {
                "points": points,
                "point": insertField
            }
        }
        throw response
    }

    insertField.user_id = id
    insertField.moder_status_id = await getIdByModerStatus("moderated")
    const pointId = await Shop
        .query()
        .insert(insertField)
        .then(res => res.id)

    await markDuplicate(dupIds, pointId)
    return getPointUser(id, pointId)
}

async function getPointsUser(userId) {
    if (Number.isInteger(userId)) {
        return getPointUser(userId)
    } else {
        throw "userId must not be empty"
    }
}

async function delPoint(userId, pointId) {
    userId = +userId
    pointId = +pointId
    if (!userId) throw "userId must not be empty"
    if (!pointId) throw "pointId must not be empty"
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

/**
 * Функция редактирования точек пользоателем. Стауc меняется на moderated в случаях:
 * Меняются любые поля кроме isActive, description;
 * Меняется discription при статусе refuse
 * @param {number} userId id пользователя
 * @param {number} pointId id точки
 * @param {object} point обьект с полями для редактирования см.  editPointUserRequest.v1.json
 * @return {object} данные добавленной точки в случае успеха см. {@link ../openApi/models/getPointsUser.v1.json} 
 * в случае дубликата (точка ближе чем ~200 метров к другой точке с базы) см. {@link ../openApi/models/duplicate.v1.json} 
 */

async function editPoint(userId, pointId, point) {
    
    await checkTimeStamp(pointId, point.timeStamp)

    const moderStatusRefuse = await getIdByModerStatus("refuse")
    const moderStatusModerated = await getIdByModerStatus("moderated")

    const updateData = await getPrepareForInsert(point)

    const { isActive, description, ...checkData } = updateData
    checkData.id = pointId
    checkData.user_id = userId

    const { points, dupIds } = await getDuplicate(point, pointId)

    if (points && !point.force) {
        const response = {
            "outputAsIs": true,
            "duplicate": {
                "points": points,
                "point": updateData
            }
        }
        throw response
    }

    await Shop.query().skipUndefined().first().where(checkData).then((res) => {
        //если хоть одно поле меняется кроме isActiv или description тогда ставим статуы moderated
        //если меняется комментарии при статусе refuse тогда статус тоже ставим moderated
        if (!res || (res.description != description && res.moder_status_id == moderStatusRefuse)) {
            updateData.moder_status_id = moderStatusModerated
         //если ничего не меняли при статусе не равном refuse и moderated то отчищаем комментарии
        } else if (res.moder_status_id != moderStatusModerated) {
            res.description = null
        }
    })

    const isSuccess = await Shop
        .query()
        .where({ "id": pointId, "user_id": userId })
        .patch(updateData).then(Boolean)
    if (isSuccess) {
        markDuplicate(dupIds, pointId)
        return getPointUser(userId, pointId)
    } else {
        throw "editing failed"
    }
}

exports.addPoint = addPoint
exports.getPointsUser = getPointsUser
exports.delPoint = delPoint
exports.editPoint = editPoint