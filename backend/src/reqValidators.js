const moderEditPointJson = require("../openApi/models/req/editPoint.json")
const addUserJson = require("../openApi/models/req/addUser.json")
const editUserJson = require("../openApi/models/req/editUser.json")
const loginJson = require("../openApi/models/req/login.json")
const addRegionJson = require("../openApi/models/req/addRegion.json")
const editRegionJson = require("../openApi/models/req/editRegion.json")
const loginAsJson = require("../openApi/models/req/loginAs.json")
const setPointRefuseJson = require("../openApi/models/req/setPointRefuse.json")

const Permission = require("./model/orm/permission")
const User = require("./model/orm/user")
const Region = require("./model/orm/region")

let yup = require('yup')
const Ajv = require('ajv')
const { hasUserId } = require("./model/adminPanelApi/utilityFn")
const ajv = new Ajv({ allErrors: false, coerceTypes: true, useDefaults: "empty" })
require('ajv-keywords')(ajv, ['transform'])


function validConstructor(ajvSchema, yupSchemaRaw) {
    const validate = ajv.compile(ajvSchema)
    const yupSchema = yup.object().shape(yupSchemaRaw).unknown(true)
    return async (req, res, next) => {
        console.log(yupSchema.cast(req.body))
        console.log(req.body)
        const valid = validate(req.body)
        if (valid) {
            await yupSchema.validate(req.body).catch((err => next(err.path + ": " + err.message)))
            next()
        } else {
            const error = validate.errors[0].dataPath.slice(1) + ": " + validate.errors[0].message
            next(error)
        }
    }
}

module.exports.validAddUser = validConstructor(addUserJson, {
    email: yup.string().test(
        'email',
        'this user already exists',
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

module.exports.validEditUser = validConstructor(editUserJson)
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
module.exports.validSetPointRefuse = validConstructor(setPointRefuseJson, {
    "description": yup.string().default(null).nullable().cast()
})