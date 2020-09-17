const Permission = require("../src/model/orm/permission")
const { getRegions } = require("../src/model/adminPanelApi/admin")

function getEmail(prefix) { // получение тестового емейла
    const email = nanoid() + "@nanoid."+prefix
    return email
}

async function addTestUser(prefix, onlyValueGen = false, permission = "user", region_id) { //добавление тестового пользователя
    const permission_id = await Permission.getIdByPermission(permission)
    let regions,region_id
    if (!region_id) {
        regions = await getRegions()
        region_id = regions[0].id
    }
    const emailTrim = getEmail(prefix) 
    const email = "  " + emailTrim + "   " 

    let userId, addUserRes
    if (!onlyValueGen) {
        addUserRes = await addUser(email, "testtest", permission_id, region_id) 
        userId = addUserRes[0].id
    }
    return {
        emailTrim,
        email,
        permission_id,
        addUserRes,
        userId,
        region_id
    }
}

module.exports.addTestUser = addTestUser
