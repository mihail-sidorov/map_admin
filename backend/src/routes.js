'use strict'
const passport = require("passport")
const { jsonResPattern, modelPromiseToRes } = require("./stdResponseFn")
const { checkAuth } = require("./middlewares/passport")
const { delPoint, addPoint, getPointsUser, editPoint } = require("./model/adminPanelApi/user")
const { addUser, editUser, getUsers, getPermission } = require("./model/adminPanelApi/admin")
const { setPointAccept, getPointsModer, setPointRefuse, editPointModer } = require("./model/adminPanelApi/moder")
const { hasUserId } = require("./model/adminPanelApi/utilityFn")

module.exports = function (app) {

    //Интерфейс авторизации
    app.post("/api/login", passport.authenticate('local'), function (req, res, next) {
        req.session.adminId=undefined
        res.json(jsonResPattern("OK"))
    })

    app.post("/api/logOut", checkAuth("all"), (req, res) => {
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
            response.loginS = req.session.adminId ? true : false
        } else {
            response.login = null
            response.isAuth = false
            response.permission = null
            response.loginS = false
        }
        res.json(response)
    })

    //Интерфейс администратора
    app.post("/api/admin/addUser", checkAuth("admin"), (req, res, next) => {
        modelPromiseToRes(
            addUser(req.body.email, req.body.password, req.body.permission_id),
            res, next)
    })

    app.post("/api/admin/editUser", checkAuth("admin"), (req, res, next) => {
        modelPromiseToRes(
            editUser(req.body.id, req.body.email, req.body.password),
            res, next)
    })

    app.get("/api/admin/getUsers", checkAuth("admin"), (req, res, next) => {
        modelPromiseToRes(
            getUsers(),
            res, next)
    })

    app.get("/api/admin/getPermission", checkAuth("admin"), (req, res, next) => {
        modelPromiseToRes(
            getPermission(),
            res, next)
    })

    app.post("/api/admin/loginAs", checkAuth("admin"), async (req, res, next) => {
        req.session.adminId = req.user.id
        const userId = Number(req.body.id)
        if (!Number.isInteger(userId) || !await hasUserId(userId)) {
            next("this userId not found")
        } else {
            req.session.passport.user = userId
            req.user.id = userId
            res.json(jsonResPattern("OK"))
        }
    })

    app.post("/api/admin/returnToAdmin", checkAuth("all"), (req, res, next) => {
        if (req.session.adminId) {
            req.session.passport.user = req.session.adminId
            req.user.id = req.session.adminId
            req.session.adminId = undefined
            res.json(jsonResPattern("OK"))
        } else {
            next("fail")
        }
    })
    //Интерфейс модератора
    app.get("/api/moder/getPoints", checkAuth("moder"), (req, res, next) => {
        modelPromiseToRes(
            getPointsModer(req.user.id),
            res, next)
    })

    app.post("/api/moder/setPointRefuse", checkAuth("moder"), (req, res, next) => {
        modelPromiseToRes(
            setPointRefuse(req.body.id, req.body.description),
            res, next)
    })

    app.post("/api/moder/setPointAccept", checkAuth("moder"), (req, res, next) => {
        modelPromiseToRes(
            setPointAccept(req.body.id),
            res, next)
    })

    app.post("/api/moder/editPoint/:id", checkAuth("moder"), (req, res, next) => {
        modelPromiseToRes(
            editPointModer(req.params.id, req.body)
            , res, next)
    })

    app.get("/api/user/getPoints", checkAuth("user"), (req, res, next) => {
        modelPromiseToRes(
            getPointsUser(req.user.id),
            res, next)
    })

    app.post("/api/user/delPoint", checkAuth("user"), (req, res, next) => {
        modelPromiseToRes(
            delPoint(req.user.id, req.body.id),
            res, next)
    })

    app.post("/api/user/addPoint", checkAuth("user"), (req, res, next) => {
        modelPromiseToRes(
            addPoint(req.body, req.user.id)
            , res, next) // id, title, lng, lat, apartment, hours, phone, site, user_description
    })

    app.post("/api/user/editPoint/:id", checkAuth("user"), (req, res, next) => {
        modelPromiseToRes(
            editPoint(req.user.id, req.params.id, req.body)
            , res, next)
    })

    app.use(function (req, res) {
        res.status(404).json(jsonResPattern("404 not found", true));
    })

    app.use(function (err, req, res, next) {
        res.status(200).json(jsonResPattern(err, true))
    })
}