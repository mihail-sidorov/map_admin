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

const user = {
    id: expect.any(Number),
    email: expect.any(String),
    permission: expect.stringMatching(/admin|moder|user/)
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
    let emailTrim, email, addUserRes
    emailTrim = getEmail()
    const permissions = await getPermission()
    email = "  " + emailTrim + "   "
    addUserRes = await addUser(email, "testtest")


})

test("Добавление пользователя", async () => {
    let emailTrim, email, addUserRes
    emailTrim = getEmail()
    email = "  " + emailTrim + "   "
    addUserRes = await addUser(email, "testtest")
    expect(addUserRes).toEqual([user])
    expect(addUserRes[0].permission).toBe("user")
    expect(addUserRes[0].email).toBe(emailTrim)

    emailTrim = getEmail()
    email = "  " + emailTrim + "   "
    expect(addUser(email, "testtest", 122321323)).rejects.toEqual('permission with this id not found')

    emailTrim = getEmail()
    email = "  " + emailTrim + "   "
    addUserRes = await addUser(email, "testtest")
    expect(addUser(email, "testtest", "notHasPermission")).rejects.toEqual('this user already exists')

    for (let key of ["user", "moder", "admin"]) {
        emailTrim = getEmail()
        email = "  " + emailTrim + "   "
        addUserRes = await addUser(email, "testtest", key)
        expect(addUserRes).toEqual([user])
        expect(addUserRes[0].permission).toBe(key)
        expect(addUserRes[0].email).toBe(emailTrim)
    }
})


afterAll(delTestUser)