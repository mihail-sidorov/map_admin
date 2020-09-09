'use strict'
const { addUser, editUser, getUsers, getPermission } = require("../../src/model/adminPanelApi/admin")
const User = require("../../src/model/orm/user")
const { nanoid } = require("nanoid")
const { matchers } = require("jest-json-schema")
const getUsersModel = require("../../openApi/models/getUsers.v1.json")
const getPermissionsModel = require("../../openApi/models/getPermissions.v1.json")

expect.extend(matchers)

function delTestUser() {
    return User.query().delete().where('email', 'like', "%nanoid.nanoid")
}

function getEmail() {
    const email = nanoid() + "@nanoid.nanoid"
    return email
}


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
    let userAfterEdit,userBeforeEdit
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

afterAll(delTestUser)