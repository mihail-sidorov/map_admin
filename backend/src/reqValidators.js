"use strict"

const addUserJson = require("../openApi/models/req/addUser.json")
const editUserJson = require("../openApi/models/req/editUser.json")
const loginJson = require("../openApi/models/req/login.json")
const addRegionJson = require("../openApi/models/req/addRegion.json")
const editRegionJson = require("../openApi/models/req/editRegion.json")
const loginAsJson = require("../openApi/models/req/loginAs.json")
const setPointRefuseJson = require("../openApi/models/req/setPointRefuse.json")
const editPointModerJson = require("../openApi/models/req/editPointModer.json")
const delPointJson = require("../openApi/models/req/delPoint.json")
const addPointJson = require("../openApi/models/req/addPoint.json")
const editPointUserJson = require("../openApi/models/req/editPointUser.json")

const Permission = require("./model/orm/permission")
const User = require("./model/orm/user")
const Region = require("./model/orm/region")

const yup = require('yup')
const Ajv = require('ajv')
const { checkTimeStamp, getGeoData, throwDuplicate, hasPermissionToEdit } = require("./model/adminPanelApi/utilityFn")
const Moder_status = require("./model/orm/moder_status")
const Shop = require("./model/orm/shop")
const ajv = new Ajv({ allErrors: false, coerceTypes: true, useDefaults: "empty" })
require('ajv-keywords')(ajv, ['transform'])


function validConstructor(ajvSchema, yupSchemaRaw, callback) {
    const validate = ajv.compile(ajvSchema)
    const yupSchema = yup.object().shape(yupSchemaRaw).unknown(true)
    return async (req, res, next) => {
        const valid = validate(req.body)
        if (valid) {
            req.body = yupSchema.cast(req.body)
            await yupSchema.validate(req.body).catch((err => next(err.path + ": " + err.message)))
            if (typeof callback == "function") {
                next(await callback(req).catch((value) => next(value)))
            } else {
                next()
            }
        } else {
            const error = validate.errors[0].dataPath.slice(1) + ": " + validate.errors[0].message
            next(error)
        }
    }
}

module.exports.validAddUser = validConstructor(addUserJson, {
    email: yup.string().test(
        'email',
        'this email is already in use',
        async value => !(await User.hasEmail(value))
    ),
    permission_id: yup.number().test(
        'permission_id',
        "this permission_id not found",
        async value => Permission.hasPermission(value)
    ),
    region_id: yup.number().test(
        'region_id',
        "this region_id not found",
        async value => Region.hasRegion(value)
    )

})

module.exports.validEditUser = validConstructor(editUserJson, {
    "password": yup.mixed().transform((value) => {
        return (value == "") ? undefined : value
    }),
    "email": yup.mixed().transform((value) => {
        return (value == "") ? undefined : value
    }).test("email",
        "this email is already in use",
        async (value) => {
            return !(await User.hasEmail(value))
        })
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
module.exports.validSetPointRefuse = validConstructor(setPointRefuseJson)
module.exports.validEditPointModer = validConstructor(editPointModerJson)
module.exports.validDelPoint = validConstructor(delPointJson,undefined,() => {
    if (!hasPermissionToEdit(req.user, +req.params.id)) return "point id not found"
})
module.exports.validAddPoint = validConstructor(addPointJson, undefined, async (req) => {
    await getGeoData(req.body)
    await throwDuplicate(req.body)
})
module.exports.validEditPointUser = validConstructor(editPointUserJson, undefined, async (req) => {
    const pointId = +req.params.id
    if (!hasPermissionToEdit(req.user, pointId)) return "point id not found"
    const value = await checkTimeStamp(pointId, req.body.timeStamp)
    if (!value) {
        return "timeStamp: timeStamp does not match"
    } else {
        delete(req.body.timeStamp)
    }
    if (!req.body.lat || !req.body.lng) {
        delete(req.body.lat)
        delete(req.body.lat)
        await getGeoData(req.body)
        await throwDuplicate(req.body)
    }

    if (!req.body.description) delete(req.body.description) 
})
