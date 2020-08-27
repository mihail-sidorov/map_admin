const passport = require("passport")
const { jsonResPattern } = require("./jsonResPattern")
const { checkAuthAdmin, checkAuthModer, checkAuthUser, isAuth } = require("./middlewares/passport")
const { addUser, addPoint } = require("./db/adminPanelApi")

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
    //title, lng, lat, apartment, hours, phone, site, user_description
    app.get("/api/getPoints", isAuth, (req, res) => {

    })

    app.post("/api/user/addPoint", checkAuthUser, (req, res, next) => {
        console.log(req.user)
        addPoint(req.body, req.user.id) // id, title, lng, lat, apartment, hours, phone, site
            .then(id => res.json(jsonResPattern({ id })))
            .catch(err => next(err.toString()))
    })



    app.post("/api/admin/addUser", checkAuthAdmin, (req, res, next) => {
        addUser(req.body.login, req.body.password, req.body.permission)
            .then(() => res.json(jsonResPattern("OK")))
            .catch(err => next(err.toString()))
    })

    app.get("/api/admin/setPassword", checkAuthAdmin, (req, res) => {
        res.send("sdsds");
    })

    app.use(function (req, res) {
        res.status(404).json(jsonResPattern("404 not found", true));
    })

    app.use(function (err, req, res, next) {
        res.status(200).json(jsonResPattern(err, true))
    })
}