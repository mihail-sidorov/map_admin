const moderEditPointJson = require("../openApi/models/req/editPoint.json")
const addUserJson = require("../openApi/models/req/addUser.json")

const Permission = require("./model/orm/permission")
const User = require("./model/orm/user")
const Region = require("./model/orm/region")

let yup = require('yup')
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: false, coerceTypes: true })
require('ajv-keywords')(ajv, ['transform'])


function validConstructor(ajvSchema, yupSchemaRaw) {
    const validate = ajv.compile(ajvSchema)
    const yupSchema = yup.object().shape(yupSchemaRaw).unknown(true)
    return async (req, res, next) => {
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

module.exports.validModerEditPoint = validConstructor(moderEditPointJson, {
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