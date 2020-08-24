const passport = require("passport")
const { jsonResPattern } = require("./jsonResPattern")
const { checkAuthAdmin, checkAuthModer, checkAuthUser, isAuth } = require("./middlewares/passport")

module.exports = function (app) {
    app.post("/login", passport.authenticate('local'), function (req, res, next) {
        res.json(jsonResPattern(false,"OK"))
    })

    app.get("/login", passport.authenticate('local'), function (req, res, next) {
        res.json(jsonResPattern(false,"OK"))
    })

    app.post("/logOut", isAuth, (req, res) => {
        req.session.destroy(() => {
            res.cookie("connect.sid", "", { expires: new Date(0) })
            res.json(jsonResPattern("OK"))
        })
    })

    app.get("/admin/addUser", checkAuthAdmin, (req, res) => {

        res.send(req.user)
    })

    app.get("/admin/setPassword", checkAuthAdmin, (req, res) => {
        //console.log(req.headers);
        //console.log(req.body);
        //console.log(req.query);
        res.send("sdsds");
    })

    app.use(function (req, res) {
        res.status(404).render(jsonResPattern("404 not found", true));
    })

    app.use(function (err, req, res, next) {
        res.status(500).send(jsonResPattern(err, true))
    })
}