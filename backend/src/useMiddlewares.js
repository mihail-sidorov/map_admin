const express = require("express")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const cookieParser = require('cookie-parser')
const { passportModule } = require("./middlewares/passport")
const cors = require('cors')
const sessionConf = require("../serverConfig").session

module.exports = function (app) {

    app.use(cors({credentials: true, origin: 'http://mapadmin.karmydev.ru/'}))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    app.use(
        session({
            secret: sessionConf.secret,
            store: new FileStore,
            cookie: {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * sessionConf.maxAge
            },
            rolling: true,
            resave: false,
            saveUninitialized: false
        })
    )

    passportModule(app) //middlware для аутентефикации вынесенно в модуль
}