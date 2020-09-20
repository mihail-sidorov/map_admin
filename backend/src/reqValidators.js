
//const moderEditPoint = require("../openApi/models/moder/req/editPoint.json")
const addUserJson = require("../openApi/models/req/addUser.json")

const Permission = require("./model/orm/permission")
const User = require("./model/orm/user")
const Region = require("./model/orm/region")
const { body, validationResult } = require("express-validator")

const Ajv = require('ajv')
const Joi = require('joi')



// module.exports.validErrHandler = (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         next(errors.array())
//     } else {
//         next()
//     }
// }

// module.exports.validReqAddUser = [
//     body('email').not().isEmpty().trim().isEmail().bail().custom(async (value) => {
//         const check = await User.hasEmail(value)
//         if (check) {
//             throw new Error('this user already exists')
//         }
//     }),
//     body('password').not().isEmpty().isLength({ min: 8, max: 72 }),
//     body('permission_id').isInt().not().isEmpty().toInt().bail().custom(async (value) => {
//         const check = await Permission.hasPermission(value)
//         if (!check) {
//             throw new Error('this permission_id not found')
//         }
//     }),
//     body('region_id').isInt().not().isEmpty().toInt().bail().custom(async (value) => {
//         const check = await Region.hasRegion(value)
//         if (!check) {
//             throw new Error('this region_id not found')
//         }
//     })
// ]

// module.exports.validReqEditUser = [
//     body('id').isInt().not().isEmpty().toInt(),
//     body('email').trim().isEmail().optional(),
//     body('password').customSanitizer(value => {
//         return (value == "") ? undefined : value
//     }).optional().isLength({ min: 8, max: 72 })
// ]

// module.exports.validReqSetPointRefuse = [
//     body('id').isInt().not().isEmpty().toInt()
// ]

function validConstructor(ajvSchema, joiSchemaRaw) {
    const ajv = new Ajv()
    const validate = ajv.compile(ajvSchema)
    const joiSchema = Joi.object(joiSchemaRaw).unknown(true)
    return (req, res, next) => {
        const valid = validate(req.body)
        if (valid) {
            console.log(req.body)
            const error = joiSchema.validate(req.body).error
            next(error)
        } else {
            next(validate.errors)
        }
    }
}

module.exports.validAddUser = validConstructor(addUserJson, {
    email: Joi.custom(async (value) => {
        const check = await User.hasEmail(value)
        if (check) {
            throw new Error('this user already exists')
        }
    })
})