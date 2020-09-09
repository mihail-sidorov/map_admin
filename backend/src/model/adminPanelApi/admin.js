'use strict'
const User = require("../orm/user")

const { hasEmail, getIdByPermission } = require("./utilityFn")
const Permission = require("../orm/permission")


function editUser(userId, email, password) {
    email = (typeof(email) == "string") ? email.trim() : undefined
    if (password === "") {
        password = undefined
    }

    return User
        .query()
        .findById(userId)
        .first()
        .patch({ email, password })
        .then(res => {
            if (res) {
                return getUsers(userId)
            } else {
                throw "fail"
            }
        })
}

async function addUser(email, password, permission_id) { 
    permission_id = Number(permission_id)

    if (!Number.isInteger(permission_id)) {
        throw "permission_id must be integer"
    }

    email = (typeof(email) == "string") ? email.trim() : undefined
    
    if (!await Permission.query().findById(permission_id).first().then(Boolean)) {
        throw "permission with this id not found"
    }

    if (await hasEmail(email)) {
        throw "this user already exists"
    }

    const userId = await User.query().insert({ email, password, permission_id }).then(res => res.id)
    return await getUsers(userId)
}

function getUsers(userId) {
    return User.query()
        .withGraphFetched("permission")
        .select("id", "email")
        .skipUndefined()
        .where("id", userId)
        .then(res => {
            res.forEach(elem => {
                elem.permission = elem.permission[0].permission
            })
            return res
        })
}

function getPermission() {
    return Permission.query()
}

// function delUser(id) {
//     User.query().delete().where("email",email)
// }

exports.editUser = editUser
exports.addUser = addUser
exports.getUsers = getUsers
exports.getPermission = getPermission