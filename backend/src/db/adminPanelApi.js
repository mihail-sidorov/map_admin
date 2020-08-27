const Permission = require("./models/permission")
const Shop = require("./models/shop")
const User = require("./models/user")

exports.checkLoginPassword = (...args) => User.checkLoginPassword(...args)
exports.getUserById = (...args) => User.getUserById(...args)
exports.addUser = (...args) => User.addUser(...args)
exports.addPoint = (...args) => Shop.addPoint(...args)

exports.setPassword = User.setPassword