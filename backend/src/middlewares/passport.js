const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { checkLoginPassword, getUserById } = require("../model/adminPanelApi/others")

exports.passportModule = function (app) {

    passport.serializeUser(function (user, done) {
        //console.log('Серелизация: ', user, user.id)
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        //console.log("Десериализация ", id)
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

exports.checkAuthAdmin = function (req, res, next) {
    if (req.user) {
        if (req.user.permission[0].permission === "admin") {
            next()
        } else {
            next("No permission")
        }
    } else {
        next("Unauthorized")
    }
}

exports.checkAuthModer = function (req, res, next) {
    if (req.user) {
        if (req.user.permission[0].permission === "moder") {
            next()
        } else {
            next("No permission")
        }
    } else {
        next("Unauthorized")
    }
}

exports.checkAuthUser = function (req, res, next) {
    if (req.user && req.user.permission[0].permission === "user") {
        next()
    } else if (req.user) {
        next("No permission")
    } else {
        next("Unauthorized")
    }
}

exports.isAuth = function (req, res, next) {
    //console.log(req.user)
    if (req.user) {
        next()
    } else {
        next("Unauthorized")
    }
}