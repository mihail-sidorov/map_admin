'use strict'
const { addUser, editUser, getUsers } = require("../../src/model/adminPanelApi/admin")

test("Получение списка пользователей", async () => {

    const user={
        id:expect.any(Number),
        email:expect.any(String),
        permission: expect.stringMatching(/admin|moder|user/)
    }
    const users = await getUsers()
    expect(users).toContainEqual(user)

})
