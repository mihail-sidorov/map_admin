'use strict'
const { addUser, editUser, getUsers, getPermission } = require("../src/model/adminPanelApi/admin")
const User = require("../src/model/orm/user")
const { nanoid } = require("nanoid")
const { matchers } = require("jest-json-schema")
const getUsersModel = require("../openApi/models/getUsers.v1.json")
const getPermissionsModel = require("../openApi/models/getPermissions.v1.json")
const getPointsModerModel = require("../openApi/models/getPointsModer.v1.json")
const getPointsUserModel = require("../openApi/models/getPointsUser.v1.json")
const { checkLoginPassword, getUserById } = require("../src/model/adminPanelApi/others")
const { getPointsModer } = require("../src/model/adminPanelApi/moder")
const { addPoint, getPointsUser } = require("../src/model/adminPanelApi/user")
const Shop = require("../src/model/orm/shop")
const { getIdByPermission } = require("../src/model/adminPanelApi/utilityFn")

expect.extend(matchers)

function delTestUser() {
    return User.query().delete().where('email', 'like', "%nanoid.nanoid")
}

function delTestPoint() {
    return Shop.query().delete().where('title', 'like', "%nanoidtestnanoid555")
}

function getEmail() {
    const email = nanoid() + "@nanoid.nanoid"
    return email
}

function getTitle() {
    return nanoid()+"nanoidtestnanoid555"
}

//admin interface
test("Получение списка пользователей", async () => {
    const users = await getUsers()
    expect(users).toMatchSchema(getUsersModel)

})

test("Получение данных из таблицы permissions", async () => {
    const permissions = await getPermission()
    expect(permissions).toMatchSchema(getPermissionsModel)
})

test("Добавление пользователя", async () => {
    let addUserRes
    const emailTrim = getEmail()
    const permissions = await getPermission()
    const email = "  " + emailTrim + "   "

    addUserRes = addUser(email, "testtest")
    await expect(addUserRes).rejects.toEqual('permission_id must be integer')

    addUserRes = addUser(email, "testtest", 2222233232)
    await expect(addUserRes).rejects.toEqual('permission with this id not found')

    addUserRes = await addUser(email, "testtest", permissions[0].id)
    await expect(addUserRes).toMatchSchema(getUsersModel)
    const getUser = await User.query().findById(addUserRes[0].id).first()
    expect(getUser.id).toBe(addUserRes[0].id)

    addUserRes = addUser(email, "testtest", permissions[0].id)
    await expect(addUserRes).rejects.toEqual('this user already exists')
})

test("Редактирование пользователя", async () => {
    let userAfterEdit, userBeforeEdit
    const emailTrim = getEmail()
    const permissions = await getPermission()
    const addEmail = "  " + emailTrim + "   "

    const addUserRes = await addUser(addEmail, "testtest", permissions[0].id)

    userBeforeEdit = await User.query().findById(addUserRes[0].id).first()
    expect(await editUser(addUserRes[0].id, undefined, "password")).toMatchSchema(getUsersModel)
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()
    const { password, ...userAfterEditPassword } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditPassword)
    expect(userBeforeEdit.password).not.toBe(password)

    userBeforeEdit = userAfterEdit
    expect(await editUser(addUserRes[0].id, getEmail(), undefined)).toMatchSchema(getUsersModel)
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()
    const { email, ...userAfterEditEmail } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditEmail)
    expect(userBeforeEdit.email).not.toBe(email)
})

//authorization interface
test("Тест авторизации", async () => {
    const emailTrim = getEmail()
    const permissions = await getPermission()
    const email = "  " + emailTrim + "   "
    const permissions_id = permissions[0].id

    const addUserRes = await addUser(email, "testtest", permissions_id)
    const userId = addUserRes[0].id
    expect(await checkLoginPassword(email, "testtest")).toMatchObject({ id: userId })
    expect(await checkLoginPassword(email, "testtest1")).toBe(false)
    expect(await checkLoginPassword(email + "1", "testtest")).toBe(false)
    await expect(checkLoginPassword(undefined, "testtest")).rejects.toEqual("email and password must not be empty")
    await expect(checkLoginPassword(email)).rejects.toEqual("email and password must not be empty")
    await expect(checkLoginPassword()).rejects.toEqual("email and password must not be empty")
})

test("Получение данных пользователя для записи в req.user по id", async () => {
    const emailTrim = getEmail()
    const permissions = await getPermission()
    const email = "  " + emailTrim + "   "
    const permission_id = permissions[0].id

    const addUserRes = await addUser(email, "testtest", permission_id)
    const userId = addUserRes[0].id
    const getUserByIdData = await getUserById(userId)
    expect(getUserByIdData)
        .toMatchObject({
            id: userId,
            email: emailTrim,
            permission_id,
            permission: [{
                id: permission_id
            }]
        })
})

//user interface

test("Добавить точку", async () => {
    const permission = await getIdByPermission("user")
    const addUserRes = await addUser(getEmail(), "testtest", permission)
    const userId = addUserRes[0].id
    let testTitle = getTitle()
    let addPointData = await addPoint({ lng: 54.407203, lat: 24.016567, title: testTitle },userId)
    expect(addPointData).toMatchObject([{moder_status: 'moderated'}])
    expect(addPointData).toMatchSchema(getPointsUserModel)
    console.log(addPointData)
})

test("Получение точек модератором", async () => {
    const resGetPointsModer = await getPointsModer()
    expect(resGetPointsModer).toMatchSchema(getPointsModerModel)
})


afterAll(delTestUser)
afterAll(delTestPoint)