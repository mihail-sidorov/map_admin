const User = require("../orm/user")

const { hasEmail, getIdByPermission } = require("./utilityFn")

//не проверенна
function setPassword(email, password) { //сменить пароль, если пользоватьель не существует, то возвращает false, в противном случае true
    return User
        .query()
        .first()
        .where("email", email)
        .patch({ password })
        .then(Boolean)
}

async function addUser(email, password, permission = "user") { //Добавить пользователя, если пользоватьель существует, то возвращает false
    if (await hasEmail(email)) throw "this user already exists"
    const permission_id = await getIdByPermission(permission)
    await User.query().insert({ email, password, permission_id })
    return "OK"
}

exports.setPassword = setPassword
exports.addUser = addUser