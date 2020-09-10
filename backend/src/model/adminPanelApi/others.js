'use strict'
const User = require("../orm/user")

async function getUserById(id) {
    return User.query().withGraphFetched("permission").findById(id)
}

async function checkLoginPassword(email, password) { //Проверка на присутствие в базе пары логин/пароль
    email = (typeof(email) == "string") ? email.trim() : undefined
    if (!email || !password) throw "email and password must not be empty"
    return User
        .query()
        .withGraphFetched("permission")
        .first()
        .where("email", email)
        .then(async user => {
            return (user && await user.verifyPassword(password)) ? user : false
        })
}

exports.checkLoginPassword = checkLoginPassword
exports.getUserById = getUserById

