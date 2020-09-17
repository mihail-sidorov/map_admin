const Permission = require("../src/model/orm/permission")
const { getRegions } = require("../src/model/adminPanelApi/admin")
const { nanoid } = require("nanoid")

function getEmail(prefix) { // получение тестового емейла
    const email = nanoid(21) + "@nanoid."+prefix
    return email
}

async function addTestUser(prefix, onlyValueGen = false, permission = "user", region_id) { //добавление тестового пользователя
    const permission_id = await Permission.getIdByPermission(permission)
    let regions
    if (!region_id) {
        regions = await getRegions()
        region_id = regions[0].id
    }

    const email = getEmail(prefix) 
    let userId, addUserRes
    if (!onlyValueGen) {
        addUserRes = await addUser(email, "testtest", permission_id, region_id) 
        userId = addUserRes[0].id
    }
    return {
        email,
        permission_id,
        addUserRes,
        userId,
        region_id
    }
}

function delTestUser(prefix) {
    return User.query().delete().where('email', 'like', "%nanoid."+prefix)
}

module.exports.addTestUser = addTestUser
module.exports.delTestUser = delTestUser
