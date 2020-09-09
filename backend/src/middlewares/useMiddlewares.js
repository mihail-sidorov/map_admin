'use strict'
const express = require("express")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const { passportModule } = require("./passport")
const cors = require('cors')
const sessionConf = require("../../serverConfig").session
const corsConf = require("../../serverConfig").cors
const helmet = require("helmet")

module.exports = function (app) {

    app.use(helmet())
    app.use(cors(corsConf))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(
        session({
            secret: sessionConf.secret,
            store: new FileStore,
            cookie: {
                secure: sessionConf.secure,
                path: '/',
                httpOnly: true,
                maxAge: (60000 * sessionConf.maxAge)
            },
            rolling: true,
            resave: false,
            saveUninitialized: false
        })
    )

    passportModule(app) //middlware для аутентефикации вынесенно в модуль
}