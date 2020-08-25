const passport = require("passport")
const { jsonResPattern } = require("./jsonResPattern")
const {  checkAuthAdmin, checkAuthModer, checkAuthUser, isAuth } = require("./middlewares/passport")
const { response } = require("express")

module.exports = function (app) {
    app.post("/api/getLogin", passport.authenticate('local'), function (req, res, next) {
        res.json(jsonResPattern("OK"))
    })

    app.get("/api/getAuthData", (req, res) => {
        const response={}
        if (req.isAuthenticated()) {
            response.login=req.user.email
            response.isAuth=true
            response.permission=req.user.permission
        } else {
            response.login=null
            response.isAuth=false
            response.permission=null
        }
        res.json(response)
    })

    app.post("/api/logOut", isAuth, (req, res) => {
        req.session.destroy(() => {
            res.cookie("connect.sid", "", { expires: new Date(0) })
            res.json(jsonResPattern("OK"))
        })
    })

    app.get("/api/admin/addUser", checkAuthAdmin, (req, res) => {
        
        res.send(req.user)
    })

    app.get( "/api/admin/setPassword", checkAuthAdmin, (req, res) => {
        //console.log(req.headers);
        //console.log(req.body);
        //console.log(req.query);
        res.send("sdsds");
    })

    app.use(function (req, res) {
        res.status(404).json(jsonResPattern("404 not found", true));
    })

    app.use(function (err, req, res, next) {
        console.log(err)
        if (err.code) {
            res.status(+err.code).json(jsonResPattern(err.res, true))
        } else {
            res.status(500).json(jsonResPattern(err, true));
        }
    })
}