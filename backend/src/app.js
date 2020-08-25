'use strict'

const express = require("express")
const app = express()
const port = require("../serverConfig").server.port

require("./useMiddlewares")(app)
require("./routes")(app)


app.listen(port)
