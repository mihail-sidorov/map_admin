'use strict'
const { addUser, editUser, getUsers, getPermission } = require("../../src/model/adminPanelApi/admin")

test("Получение списка пользователей", async () => {

    const user = {
        id: expect.any(Number),
        email: expect.any(String),
        permission: expect.stringMatching(/admin|moder|user/)
    }
    const users = await getUsers()
    expect(users).toContainEqual(user)

})

test("Получение данных из таблицы permissions", async () => {
    const permission = {
        id: expect.any(Number),
        permission: expect.any(String)
    }
    const permissions = await getPermission()
    expect(permissions).toContainEqual(permission)
})