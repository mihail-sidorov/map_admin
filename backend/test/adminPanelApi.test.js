'use strict'
const { addUser, editUser, getUsers, getPermission } = require("../src/model/adminPanelApi/admin")
const User = require("../src/model/orm/user")
const { nanoid } = require("nanoid")
const { matchers } = require("jest-json-schema")
const getUsersModel = require("../openApi/models/getUsers.v1.json")
const getPermissionsModel = require("../openApi/models/getPermissions.v1.json")
const getPointsModerModel = require("../openApi/models/getPointsModer.v1.json")
const getPointsUserModel = require("../openApi/models/getPointsUser.v1.json")
const duplicateModel = require("../openApi/models/duplicate.v1.json")
const { checkLoginPassword, getUserById } = require("../src/model/adminPanelApi/others")
const { getPointsModer } = require("../src/model/adminPanelApi/moder")
const { addPoint, getPointsUser } = require("../src/model/adminPanelApi/user")
const Shop = require("../src/model/orm/shop")
const { getIdByPermission, getPrepareForInsert } = require("../src/model/adminPanelApi/utilityFn")

expect.extend(matchers)

function delTestUser() { //удаление всех тестовых пользователей
    return User.query().delete().where('email', 'like', "%nanoid.nanoid")
}

function delTestPoint() { //удаление всех тестовых юзеров
    return Shop.query().delete().where('title', 'like', "%nanoidtestnanoid555")
}

function getEmail() { // получение тестового емейла
    const email = nanoid() + "@nanoid.nanoid"
    return email
}

function getTitle() { //получение тестового имени
    return nanoid() + "nanoidtestnanoid555"
}

async function addTestUser(onlyValueGen = false, permission = "user") { //добавление тестового пользователя
    const permission_id = await getIdByPermission(permission)
    const emailTrim = getEmail() // генерируем рандомный емейл
    const email = "  " + emailTrim + "   " //добавляем пробелы емейлу с обоих концов
    let userId, addUserRes
    if (!onlyValueGen) {
        addUserRes = await addUser(email, "testtest", permission_id) // добавляем пользователя с полученными правами
        userId = addUserRes[0].id
    }
    return { emailTrim, email, permission_id, addUserRes, userId }
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
    let { email, permission_id } = await addTestUser(true)

    addUserRes = addUser(email, "testtest")
    await expect(addUserRes).rejects.toEqual('permission_id must be integer')

    addUserRes = addUser(email, "testtest", 2222233232)
    await expect(addUserRes).rejects.toEqual('permission with this id not found')

    addUserRes = await addUser(email, "testtest", permission_id)
    await expect(addUserRes).toMatchSchema(getUsersModel)
    const getUser = await User.query().findById(addUserRes[0].id).first()
    expect(getUser.id).toBe(addUserRes[0].id)

    addUserRes = addUser(email, "testtest", permission_id)
    await expect(addUserRes).rejects.toEqual('this user already exists')
})

test("Редактирование пользователя", async () => {
    let userAfterEdit, userBeforeEdit
    const { addUserRes } = await addTestUser()

    userBeforeEdit = await User.query().findById(addUserRes[0].id).first() //получаем с базы данные пользователя до редактирования
    expect(await editUser(addUserRes[0].id, undefined, "password")).toMatchSchema(getUsersModel) //меням пароль и сравниваем ответ с json схемой
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()//получаем с базы данные пользователя после редактирования
    const { password, ...userAfterEditPassword } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditPassword) //проверяем соответствие всех полей кроме пароля
    expect(userBeforeEdit.password).not.toBe(password) //проверяем что пароль изменен

    userBeforeEdit = userAfterEdit
    expect(await editUser(addUserRes[0].id, getEmail(), undefined)).toMatchSchema(getUsersModel)//меняем логин
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()
    const { email, ...userAfterEditEmail } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditEmail)
    expect(userBeforeEdit.email).not.toBe(email)
})

//authorization interface

test("Тест авторизации", async () => {
    const { email, userId } = await addTestUser()

    expect(await checkLoginPassword(email, "testtest")).toMatchObject({ id: userId }) //верный логин пароль
    expect(await checkLoginPassword(email, "testtest1")).toBe(false)//неверный пароль
    expect(await checkLoginPassword(email + "1", "testtest")).toBe(false)//неверный логин
    await expect(checkLoginPassword(undefined, "testtest")).rejects.toEqual("email and password must not be empty") // пустой логин
    await expect(checkLoginPassword(email)).rejects.toEqual("email and password must not be empty") //пустой пароль
    await expect(checkLoginPassword()).rejects.toEqual("email and password must not be empty")//пустой логин и пароль
})

test("Получение данных пользователя для записи в req.user по id", async () => {
    const { emailTrim, permission_id, userId } = await addTestUser()
    const getUserByIdData = await getUserById(userId)//Тест функции получения данных пользователя по id
    expect(getUserByIdData)//
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

test("Добавление точки в том числе тест дубликатов", async () => {
    const { userId } = await addTestUser(false, "user")

    async function testPoint(pointData) {
        pointData.title = getTitle() // генерируем случайное имя, по которому потом тестовые точки будут удалятся
        let addPointData = await addPoint(pointData, userId) //добавление точки только с полученными даными
        let pointFromDb = await Shop.query().where({ lng: pointData.lng, lat: pointData.lat }) //получение добавленной точки из базы
        pointFromDb[0].isActive = Boolean(pointFromDb[0].isActive) //преобразуем в булеан из за того что mysql хранит булевый тип в инт
        addPointData[0].isActive = Boolean(addPointData[0].isActive) //преобразуем в булеан из за того что mysql хранит булевый тип в инт
        expect(addPointData).toMatchObject([{ moder_status: "moderated" }]) // проверка на поля добовляемые системой
        expect(addPointData).toMatchSchema(getPointsUserModel) //соответствие вывода Json схеме
        if (!pointData.force) {
            expect(pointFromDb.length).toBe(1) //проверка что добавилась одна точка
            //Проверяем функцию делающую копию объекта для вставки вырезающую лишние поля
            delete (addPointData[0].moder_status) //этого поля нет в базе оно в связанной таблице
            expect(pointFromDb).toMatchObject(addPointData) // проверка что точка в базе соответствует возврашенной точке addPoint
        }

        const pointDataAfterPrepare = await getPrepareForInsert(pointData)
        for (let key in pointDataAfterPrepare) {
            if (pointDataAfterPrepare[key] === undefined) {
                pointDataAfterPrepare[key] = null
            }
        }

        expect(pointFromDb).toContainEqual(expect.objectContaining(pointDataAfterPrepare)) //сравниваем точку в базе с данными добавленными нами
        const pointId = pointFromDb[0].id
        return pointId
    }

    await testPoint({ lng: 54.407203, lat: 24.016567 }) //добавление точки только с минимальными даными

    const pointId = await testPoint({
        lng: 55.920652,
        lat: 23.303075,
        apartment: "apartment",
        hours: "hours",
        phone: "phone",
        site: "site",
        description: "description",
        isActive: true
    })

    await testPoint({
        lng: 50.866683,
        lat: 20.634994,
        apartment: "apartment",
        hours: "hours",
        phone: "phone",
        site: "site",
        description: "description",
        isActive: false,
        //лишние поля
        id: pointId,
        moder_status: "accept",
        user_id: userId
    })

    let addPointData = addPoint({ lng: 54.407203, title: getTitle() }, userId) //добавление токи без необходимых данных
    await expect(addPointData).rejects.toEqual("lat and lng must not be empty")

    addPointData = addPoint({ lng: "54.407203test", lat: "23.303075a", title: getTitle() }, userId) //строковые поля вместо числовых в координатах
    await expect(addPointData).rejects.toEqual("lat and lng must not be empty")

    addPointData = addPoint({ lng: 10, lat: 10, title: getTitle() }, userId) //строковые поля вместо числовых в координатах
    await expect(addPointData).rejects.toEqual("failed to get geodata")

    //добавляем дубликат
    await testPoint({ lng: 54.407203, lat: 24.016567, force: true }) //принудительное добавление дубликата

    addPointData = addPoint({ lng: 54.407203, lat: 24.016567, title: getTitle() }, userId) //минимальные данные
    await expect(addPointData).rejects.toMatchSchema(duplicateModel)

    addPointData = addPoint({ lng: 54.408203, lat: 24.017567, title: getTitle() }, userId) //удаление ~150 метров
    await expect(addPointData).rejects.toMatchSchema(duplicateModel)

    addPointData = addPoint({ //максимальные данные с лишними полями
        title: getTitle(),
        lng: 50.866683,
        lat: 20.634994,
        apartment: "apartment",
        hours: "hours",
        phone: "phone",
        site: "site",
        description: "description",
        isActive: false,
        //лишние поля
        id: pointId,
        moder_status: "accept",
        user_id: userId
    }, userId)

    await expect(addPointData).rejects.toMatchSchema(duplicateModel)
})

test("Редактирование точек", () => {

})
test("Получение точек модератором", async () => {
    const resGetPointsModer = await getPointsModer()
    expect(resGetPointsModer).toMatchSchema(getPointsModerModel)
})

afterAll(delTestPoint)
afterAll(delTestUser)