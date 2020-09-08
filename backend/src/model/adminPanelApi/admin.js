const User = require("../orm/user")

const { hasEmail, getIdByPermission} = require("./utilityFn")


function editUser(userId, email, password) { //сменить пароль, если пользоватьель не существует, то возвращает false, в противном случае true
    email=String(email).trim()
    if (password === "") {
        password = undefined
    } 

    return User
        .query()
        .findById(userId)
        .first()
        .patch({ email, password })
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

function getUsers() {
    return User.query()
        .withGraphFetched("permission")
        .select("id","email")
        .then(res => {
            res.forEach( elem => {
                elem.permission=elem.permission[0].permission
            })
            return res
        })
}

// function delUser(email) {
//     User.query().delete().where("email",email)
// }

exports.editUser = editUser
exports.addUser = addUser
exports.getUsers = getUsers