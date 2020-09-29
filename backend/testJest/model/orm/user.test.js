const User = require("../../../src/model/orm/user")
const { nanoid } = require("nanoid")
const { matchers } = require("jest-json-schema")
const getUserModel = require("../../../openApi/models/res/getUsers.json")

expect.extend(matchers)


test("Тест функции hasEmail", async () => {
    //получаем первых 10 пользователей
    const users = await User.query().limit(10)
    //проверяем емейл каждого функцией
    for (let user of users) {
        expect(await User.hasEmail(user.email)).toBe(true)
    }
    //неверные емейлы
    for (let key = 0; key<10; key++ ) {
        expect(await User.hasEmail(nanoid())).toBe(false)
    }
    //проверка точного соответствия
    expect(await User.hasEmail("a")).toBe(false)
})

test("Тест функции getUserById", async () => {
    //сравниваем с JSON схемой
    const users = await User.getUserById()
    expect(users).toMatchSchema(getUserModel)
    //сравниваем первых 10 пользователей на правильное получение данных
    testUsers = await User.query().select("id","email").limit(10)
    for (let user of testUsers) {
        expect(users).toContainEqual(expect.objectContaining(user))
    }
    //исключения
    await expect(User.getUserById("dd")).rejects.toEqual("incorrect userId")
    await expect(User.getUserById(null)).rejects.toEqual("incorrect userId")
})