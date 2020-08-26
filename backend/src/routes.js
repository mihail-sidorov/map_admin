const passport = require("passport")
const { jsonResPattern } = require("./jsonResPattern")
const { checkAuthAdmin, checkAuthModer, checkAuthUser, isAuth } = require("./middlewares/passport")
const { addUser } = require("./db/adminPanelApi")

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
            response.permission = req.user.permission
        } else {
            response.login = null
            response.isAuth = false
            response.permission = null
        }
        res.json(response)
    })

    app.post("/api/admin/addUser", checkAuthAdmin, (req, res, next) => {
        console.log(req.body.login)
        addUser(req.body.login, req.body.password, req.body.permission, next).then(() => res.json(jsonResPattern("OK")), (err) => { next(err.data); console.dir(err.data) })
    })

    app.get("/api/admin/setPassword", checkAuthAdmin, (req, res) => {
        res.send("sdsds");
    })

    app.use(function (req, res) {
        res.status(404).json(jsonResPattern("404 not found", true));
    })

    // app.use(function (err, req, res, next) {
    //     res.json(err)
    //     // if (err.body) {
    //     //     res.status(200).json(jsonResPattern(err, true))
    //     // } else {
    //     //     res.status(200).json(jsonResPattern(err, true))
    //     // }
    // })
}