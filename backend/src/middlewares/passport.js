'use strict'
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { checkLoginPassword, getUserById } = require("../model/adminPanelApi/others")

exports.passportModule = function (app) {

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        getUserById(id).then(user => done(null, user))
    })

    passport.use(new LocalStrategy(
        { usernameField: 'login' },
        function (email, password, done) {
            checkLoginPassword(email, password).then((result) => {
                result ? done(null, result) : done("Unauthorized", false)
            })
        })
    )

    app.use(passport.initialize())
    app.use(passport.session())
}

exports.checkAuth = function (permission) {
    return (req, res, next) => {
        if (req.user) {
            //console.log(permission)
            if ((typeof (permission) == "string" && permission === req.user.permission[0].permission) ||
                (typeof (permission) == "object" && permission.includes(req.user.permission[0].permission)) ||
                permission === "all") {
                next()
            } else {
                next("No permission")
            }
        } else {
            next("Unauthorized")
        }
    }
}