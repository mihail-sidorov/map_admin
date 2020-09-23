const Permission = require("../src/model/orm/permission")
const { getRegions, addUser } = require("../src/model/adminPanelApi/admin")
const { nanoid } = require("nanoid")
const User = require("../src/model/orm/user")
const Region = require("../src/model/orm/region")
const Shop = require("../src/model/orm/shop")
const { getUserById } = require("../src/model/adminPanelApi/others")

function getTitle(prefix) { //получение тестового имени
    return nanoid() + "nanoidtestnanoid555"+prefix
}

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
    let userId, addUserRes, user
    if (!onlyValueGen) {
        addUserRes = await addUser(email, "testtest", permission_id, region_id) 
        userId = addUserRes[0].id
        user = await getUserById(userId)
    }
    return {
        user,
        email,
        permission_id,
        addUserRes,
        userId,
        region_id
    }
}

function delTestUser(prefix) {
    return () => User.query().delete().where('email', 'like', "%nanoid."+prefix)
}

function delTestRegion(prefix) {
    return () => Region.query().delete().where('region', 'like', "nanoid"+prefix+"%")
}

function delTestPoint(prefix) {
    return () => Shop.query().delete().where('title', 'like', "%nanoidtestnanoid555"+prefix)
}

module.exports.getTitle = getTitle
module.exports.getEmail = getEmail
module.exports.addTestUser = addTestUser
module.exports.delTestUser = delTestUser
module.exports.delTestRegion = delTestRegion
module.exports.delTestPoint = delTestPoint
