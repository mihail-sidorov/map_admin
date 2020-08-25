const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { checkLoginPassword, getUserById } = require("../db/adminPanelApi")

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
        { usernameField: 'email' },
        function (email, password, done) {
            checkLoginPassword(email, password).then((result) => {
                result ? done(null, result) : done(null, false)
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
            next({res: "No permission",code: 403})
        }
    } else {
        next({res: "Unauthorized",code: 401})
    }
}

exports.checkAuthModer = function (req, res, next) {
    if (req.user) {
        if (req.user.permission[0].permission === "moder") {
            next()
        } else {
            next({res: "No permission",code: 403})
        }
    } else {
        next({res: "Unauthorized",code: 401})
    }
}

exports.checkAuthUser = function (req, res, next) {
    if (req.user && req.user.permission[0].permission === "user") {
        next()
    } else if (req.user) {
        next({res: "No permission",code: 403})
    } else {
        next({res: "Unauthorized",code: 401})
    }
}

exports.isAuth = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        next({res: "Unauthorized",code: 401})
    }
}