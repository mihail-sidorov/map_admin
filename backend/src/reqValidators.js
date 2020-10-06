"use strict"

const addUserJson = require("../openApi/models/req/addUser.json")
const editUserJson = require("../openApi/models/req/editUser.json")
const loginJson = require("../openApi/models/req/login.json")
const addRegionJson = require("../openApi/models/req/addRegion.json")
const editRegionJson = require("../openApi/models/req/editRegion.json")
const loginAsJson = require("../openApi/models/req/loginAs.json")
const setPointRefuseJson = require("../openApi/models/req/setPointRefuse.json")
const setPointAcceptJson = require("../openApi/models/req/setPointAccept.json")
const editPointModerJson = require("../openApi/models/req/editPointModer.json")
const delPointJson = require("../openApi/models/req/delPoint.json")
const addPointJson = require("../openApi/models/req/addPoint.json")
const editPointUserJson = require("../openApi/models/req/editPointUser.json")
const takePointJson = require("../openApi/models/req/takePoint.json")

const Permission = require("./model/orm/permission")
const User = require("./model/orm/user")
const Region = require("./model/orm/region")

const yup = require('yup')
const Ajv = require('ajv')
const { checkTimeStamp, getGeoData, throwDuplicate } = require("./model/adminPanelApi/utilityFn")
const Shop = require("./model/orm/shop")
const { getPointsModerator } = require("./model/adminPanelApi/user")
const ajv = new Ajv({ allErrors: false, coerceTypes: true, useDefaults: "empty" })
require('ajv-keywords')(ajv, ['transform'])


function validConstructor(ajvSchema, yupSchemaRaw, ...callbacks) {
    const validate = ajv.compile(ajvSchema)
    const yupSchema = yup.object().shape(yupSchemaRaw).unknown(true)
    return async (req, res, next) => {
        const valid = validate(req.body)
        if (valid) {
            req.body = yupSchema.cast(req.body)
            await yupSchema.validate(req.body).catch((err => next(err.path + ": " + err.message)))
            try {
                for (let callback of callbacks) {
                    if (typeof callback == "function") {
                        const result = await callback(req)
                        if (result) next(result)
                    }
                }
            } catch (callbackErr) {
                next(callbackErr)
            }

            next()
        } else {
            const error = validate.errors[0].dataPath.slice(1) + ": " + validate.errors[0].message
            next(error)
        }
    }
}

async function hasPermissionToEdit(req) {
    let pointId = req.params.id ? req.params.id : req.body.id
    await yup.number().integer().validate(pointId).catch(err => { throw ("id: " + err.message) })
    const res = await Shop
        .query()
        .joinRelated("user.region")
        .select("user_id", "region_id", "shops.id")
        .where("shops.id", +pointId)
        .first()
    if (!res ||
        !(req.user.permission[0].permission == "moder" && res.region_id == req.user.region_id) &&
        !(req.user.permission[0].permission == "user" && res.user_id == req.user.id)) {
        throw "point id not found"
    }
}

module.exports.validAddUser = validConstructor(addUserJson, {
    email: yup.string().test(
        'email',
        'this email is already in use',
        async value => !(await User.hasEmail(value))
    ),
    permission_id: yup.number()
        .test(
            'permission_id',
            "this permission_id not found",
            async value => Permission.hasPermission(value)
        )
}, async (req) => {
    const permissionAdminId = await Permission.getIdByPermission("admin")
    if (req.body.permission_id === permissionAdminId) {
        req.body.region_id = null
    } else if (!req.body.region_id) {
        throw "region_id: null is not allowed for non-admin"
    } else {
        await yup.number().test(
            'region_id',
            "this region_id not found",
            async value => Region.hasRegion(value)
        ).validate(req.body.region_id).catch(err => { throw ("region.id: " + err.message) })
    }
})

module.exports.validEditUser = validConstructor(editUserJson, {
    "password": yup.mixed().transform((value) => {
        return (value == "") ? undefined : value
    })
}, async (req) => {
    const edituser = await User.query().findById(req.body.id)
    if (!edituser) {
        throw "this user id not found"
    }
    if ((req.body.email === edituser.email) || req.body.email === "") {
        req.body.email = undefined
    } else {
        await yup.mixed()
            .test("email",
                "this email is already in use",
                async (value) => {
                    return !(await User.hasEmail(value))
                })
            .validate(req.body.email).catch(err => { throw ("email: " + err.message) })
    }
})
module.exports.validLogin = validConstructor(loginJson)

module.exports.validAddRegion = validConstructor(addRegionJson)

module.exports.validEditRegion = validConstructor(editRegionJson)

module.exports.validLoginAs = validConstructor(loginAsJson, {
    "id": yup.number().test(
        "id",
        "this userId not found",
        async value => User.hasUserId(value)
    )
})
module.exports.validSetPointRefuse = validConstructor(setPointRefuseJson, undefined, hasPermissionToEdit)

module.exports.validSetPointAccept = validConstructor(setPointAcceptJson, undefined, hasPermissionToEdit)

module.exports.validEditPointModer = validConstructor(editPointModerJson, undefined, hasPermissionToEdit)

module.exports.validDelPoint = validConstructor(delPointJson, undefined, hasPermissionToEdit)

module.exports.validAddPoint = validConstructor(addPointJson, undefined, async (req) => {
    await getGeoData(req.body)
    await throwDuplicate(req.body)
})

module.exports.validTakePoint = validConstructor(takePointJson, undefined, async (req) => {
    const points = await getPointsModerator(req.user)
    for (let key=0; key<points.length; key++) {
        if (points[key].id == req.body.id) {
            return
        }
    }
    throw "this id not found"
    
})

module.exports.validEditPointUser = validConstructor(editPointUserJson, undefined, hasPermissionToEdit, async (req) => {
    const pointId = +req.params.id
    const value = await checkTimeStamp(pointId, req.body.timeStamp)
    if (!value) {
        return "timeStamp: timeStamp does not match"
    } else {
        delete (req.body.timeStamp)
    }
    if (!req.body.lat || !req.body.lng) {
        delete (req.body.lat)
        delete (req.body.lat)
    } else {
        await getGeoData(req.body)
        await throwDuplicate(req.body, pointId)
    }

    if (!req.body.description) delete (req.body.description)
})
