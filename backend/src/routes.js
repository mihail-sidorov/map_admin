const passport = require("passport")
const { jsonResPattern, modelPromiseToRes } = require("./stdResponseFn")
const { checkAuthAdmin, checkAuthModer, checkAuthUser, isAuth } = require("./middlewares/passport")
const { delPoint, addPoint, getPointsUser, editPoint } = require("./model/adminPanelApi/user")
const { setPassword, addUser } = require("./model/adminPanelApi/admin")
const { getPointsModer, setPointRefuse } = require("./model/adminPanelApi/moder")

module.exports = function (app) {
    app.post("/api/login", passport.authenticate('local'), function (req, res, next) {
        res.json(jsonResPattern("OK"))
    })

    app.post("/api/logOut", isAuth, (req, res) => {
        req.session.destroy(() => {
            res.cookie("connect.sid", "", { expires: new Date(0) })
            res.json(jsonResPattern("OK"))
        })
    })

    app.get("/api/getAuthData", (req, res) => {
        const response = {}
        if (req.isAuthenticated()) {
            response.login = req.user.email
            response.isAuth = true
            response.permission = req.user.permission[0].permission
        } else {
            response.login = null
            response.isAuth = false
            response.permission = null
        }
        res.json(response)
    })

    //title, lng, lat, apartment, hours, phone, site, isActiv, is
    app.get("/api/user/getPoints", checkAuthUser, (req, res, next) => {
        modelPromiseToRes(
            getPointsUser(req.user.id),
            res, next)
    })

    //title, lng, lat, apartment, hours, phone, site, isActiv, is
    app.post("/api/user/delPoint", checkAuthUser, (req, res, next) => {
        modelPromiseToRes(
            delPoint(req.user.id, req.body.id),
            res, next)
    })

    app.post("/api/user/addPoint", checkAuthUser, (req, res, next) => {
        modelPromiseToRes(
            addPoint(req.body, req.user.id),
            res, next) // id, title, lng, lat, apartment, hours, phone, site, user_description
    })

    app.post("/api/user/editPoint/:id", checkAuthUser, (req, res, next) => {
        modelPromiseToRes(
            editPoint(req.user.id, req.params.id, req.body),
            res, next)
    })

    app.get("/api/moder/getPoints", checkAuthModer, (req, res, next) => {
        modelPromiseToRes(
            getPointsModer(req.user.id),
            res, next)
    })

    app.post("/api/admin/addUser", checkAuthAdmin, (req, res, next) => {
        modelPromiseToRes(
            addUser(req.body.login, req.body.password, req.body.permission),
            res, next)
    })

    // app.post("/api/admin/setPassword", checkAuthAdmin, (req, res, next) => {
    //     modelPromiseToRes(
    //         setPassword(req.body.login, req.body.password),
    //         res, next)
    // })

    app.use(function (req, res) {
        res.status(404).json(jsonResPattern("404 not found", true));
    })

    app.use(function (err, req, res, next) {
        res.status(200).json(jsonResPattern(err, true))
    })
}