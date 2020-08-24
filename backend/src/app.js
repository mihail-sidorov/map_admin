'use strict'

const express = require("express")
const app = express()
const port = require("../serverConfig").server.port
const host = require("../serverConfig").server.host

require("./useMiddlewares")(app)
require("./routes")(app)


app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})
