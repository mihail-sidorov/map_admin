'use strict'

const fs = require("fs")
const access = fs.createWriteStream('log')
process.stdout.write = process.stderr.write = access.write.bind(access)

const express = require("express")
const app = express()
const port = require("../serverConfig").server.port

require("./middlewares/useMiddlewares")(app)
require("./routes")(app)


app.listen(port)
