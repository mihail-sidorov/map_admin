'use strict'
const express = require("express")
const session = require("express-session")
const KnexSessionStore = require('connect-session-knex')(session)
const { passportModule } = require("./passport")
const cors = require('cors')
const sessionConf = require("../../serverConfig").session
const corsConf = require("../../serverConfig").cors
const helmet = require("helmet")
const dbConfig = require("../../serverConfig").db
const Knex = require('knex')

const knex = Knex(dbConfig)
const store = new KnexSessionStore({
    knex,
    tablename: 'sessions'
})

module.exports = function (app) {

    app.use(helmet())
    app.use(cors(corsConf))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(
        session({
            secret: sessionConf.secret,
            store,
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

    passportModule(app)
}