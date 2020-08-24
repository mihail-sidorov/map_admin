const Permission = require("./models/permission")
const User = require("./models/user")

exports.checkLoginPassword = (...args) => User.checkLoginPassword(...args)
exports.getUserById = (...args) => User.getUserById(...args)
exports.addUser = (...args) => User.addUser(...args)
exports.setPassword = User.setPassword