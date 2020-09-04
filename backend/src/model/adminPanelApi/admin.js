const User = require("../orm/user")

const { hasEmail, getIdByPermission } = require("./utilityFn")


function setPassword(email, password) { //сменить пароль, если пользоватьель не существует, то возвращает false, в противном случае true
    email=String(email).trim()
    return User
        .query()
        .first()
        .where("email", email)
        .patch({ password })
        .then(res => {
            if (res) {
                return "OK"
            } else {
                throw "fail"
            }
        })
}

async function addUser(email, password, permission = "user") { //Добавить пользователя, если пользоватьель существует, то возвращает false
    email=String(email).trim()
    if (await hasEmail(email)) throw "this user already exists"
    const permission_id = await getIdByPermission(permission)
    await User.query().insert({ email, password, permission_id })
    return "OK"
}

// function delUser(email) {
//     User.query().delete().where("email",email)
// }

exports.setPassword = setPassword
exports.addUser = addUser