'use strict'
const {
    addUser,
    editUser,
    getUsers,
    getPermission
} = require("../src/model/adminPanelApi/admin")

const User = require("../src/model/orm/user")
const Shop = require("../src/model/orm/shop")

const { nanoid } = require("nanoid")

const { matchers } = require("jest-json-schema")
const getUsersModel = require("../openApi/models/getUsers.v1.json")
const getPermissionsModel = require("../openApi/models/getPermissions.v1.json")
const getPointsModerModel = require("../openApi/models/getPointsModer.v1.json")
const getPointsUserModel = require("../openApi/models/getPointsUser.v1.json")
const duplicateModel = require("../openApi/models/duplicate.v1.json")
const { checkLoginPassword, getUserById } = require("../src/model/adminPanelApi/others")
const {
    getPointsModer,
    setPointRefuse,
    setPointAccept,
    editPointModer } = require("../src/model/adminPanelApi/moder")

const { addPoint, getPointsUser, delPoint } = require("../src/model/adminPanelApi/user")

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
    return {
        emailTrim,
        email,
        permission_id,
        addUserRes,
        userId
    }
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
    let {
        email,
        permission_id
    } = await addTestUser(true)

    addUserRes = addUser(email, "testtest")
    await expect(addUserRes).rejects.toEqual('permission_id must be integer')

    addUserRes = addUser(email, "testtest", 2222233232)
    await expect(addUserRes).rejects.toEqual('permission with this id not found')

    addUserRes = await addUser(email, "testtest", permission_id)
    await expect(addUserRes).toMatchSchema(getUsersModel)
    const getUser = await User.query().findById(addUserRes[0].id).first()
    expect(getUser.id).toBe(addUserRes[0].id)

    addUserRes = addUser(email+"  ", "testtest", permission_id)
    await expect(addUserRes).rejects.toEqual('this user already exists')

    addUserRes = addUser(45445, "testtest", permission_id)
    await expect(addUserRes).rejects.toEqual('email must not be empty')
})

test("Редактирование пользователя", async () => {
    let userAfterEdit, userBeforeEdit
    const {
        addUserRes
    } = await addTestUser()

    userBeforeEdit = await User.query().findById(addUserRes[0].id).first() //получаем с базы данные пользователя до редактирования
    expect(await editUser(addUserRes[0].id, undefined, "password")).toMatchSchema(getUsersModel) //меням пароль и сравниваем ответ с json схемой
    userAfterEdit = await User.query().findById(addUserRes[0].id).first() //получаем с базы данные пользователя после редактирования
    const {
        password,
        ...userAfterEditPassword
    } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditPassword) //проверяем соответствие всех полей кроме пароля
    expect(userBeforeEdit.password).not.toBe(password) //проверяем что пароль изменен

    userBeforeEdit = userAfterEdit
    expect(await editUser(addUserRes[0].id, getEmail(), undefined)).toMatchSchema(getUsersModel) //меняем логин
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()
    const {
        email,
        ...userAfterEditEmail
    } = userAfterEdit
    expect(userBeforeEdit).toMatchObject(userAfterEditEmail)
    expect(userBeforeEdit.email).not.toBe(email)
    //если пытаемся редактировать несуществующего пользователя
    expect(editUser(-2323, getEmail(), undefined)).rejects.toBe("fail")
    expect(editUser("sdsds", getEmail(), undefined)).rejects.toBe("userId must be not empty")
    //не меняем пароль, отправляем пустую строку, так как ничего не поменялось ответ fail
    expect(editUser(addUserRes[0].id, undefined, "")).rejects.toBe("fail")
})

//authorization interface

test("Тест авторизации", async () => {
    const {
        email,
        userId
    } = await addTestUser()

    expect(await checkLoginPassword(email, "testtest")).toMatchObject({
        id: userId
    }) //верный логин пароль
    expect(await checkLoginPassword(email, "testtest1")).toBe(false) //неверный пароль
    expect(await checkLoginPassword(email + "1", "testtest")).toBe(false) //неверный логин
    await expect(checkLoginPassword(undefined, "testtest")).rejects.toEqual("email and password must not be empty") // пустой логин
    await expect(checkLoginPassword(email)).rejects.toEqual("email and password must not be empty") //пустой пароль
    await expect(checkLoginPassword()).rejects.toEqual("email and password must not be empty") //пустой логин и пароль
})

test("Получение данных пользователя для записи в req.user по id", async () => {
    const {
        emailTrim,
        permission_id,
        userId
    } = await addTestUser()
    const getUserByIdData = await getUserById(userId) //Тест функции получения данных пользователя по id
    expect(getUserByIdData) //
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

test("Добавление и получение точки в том числе тест дубликатов", async () => {
    const {
        userId
    } = await addTestUser(false, "user")

    async function testPoint(pointData) {
        // генерируем случайное имя, по которому потом тестовые точки будут удалятся
        pointData.title = getTitle()
        //добавление точки только с полученными даными
        let addPointData = await addPoint(pointData, userId)
        //получение добавленной точки из базы
        let pointFromDb = await Shop.query().where({
            lng: pointData.lng,
            lat: pointData.lat
        })
        //Получение точек через getPointsUser и сравниваем с запросом с базы
        let getPointsUserFnData = await getPointsUser(userId)
        getPointsUserFnData = getPointsUserFnData.map((elem) => {
            delete (elem.moder_status)
            return expect.objectContaining(elem)
        })

        expect(getPointsUserFnData).toEqual(expect.arrayContaining(pointFromDb))
        //преобразуем в булево из за того что mysql хранит булевой тип в инт
        pointFromDb[0].isActive = Boolean(pointFromDb[0].isActive)
        addPointData[0].isActive = Boolean(addPointData[0].isActive)
        // проверка на поля добавляемые системой
        expect(addPointData).toMatchObject([{
            moder_status: "moderated"
        }])
        //соответствие вывода Json схеме
        expect(addPointData).toMatchSchema(getPointsUserModel)
        if (!pointData.force) {
            //проверка что добавилась одна точка
            expect(pointFromDb.length).toBe(1)
            //Проверяем функцию делающую копию объекта для вставки вырезающую лишние поля
            delete (addPointData[0].moder_status) //этого поля нет в базе оно в связанной таблице
            // проверка что точка в базе соответствует возврашенной точке addPoint
            expect(pointFromDb).toMatchObject(addPointData)
        }

        const pointDataAfterPrepare = await getPrepareForInsert(pointData)
        for (let key in pointDataAfterPrepare) {
            if (pointDataAfterPrepare[key] === undefined) {
                pointDataAfterPrepare[key] = null
            }
        }
        //сравниваем точку в базе с данными добавленными нами
        expect(pointFromDb).toContainEqual(expect.objectContaining(pointDataAfterPrepare))
        const pointId = pointFromDb[0].id
        return pointId
    }
    //добавление точки только с минимальными даными
    await testPoint({
        lng: 54.407203,
        lat: 24.016567
    })
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

    let addPointData = addPoint({
        lng: 54.407203,
        title: getTitle()
    }, userId) //добавление токи без необходимых данных
    await expect(addPointData).rejects.toEqual("lat and lng must not be empty")

    addPointData = addPoint({
        lng: "54.407203test",
        lat: "23.303075a",
        title: getTitle()
    }, userId) //строковые поля вместо числовых в координатах
    await expect(addPointData).rejects.toEqual("lat and lng must not be empty")

    addPointData = addPoint({
        lng: 10,
        lat: 10,
        title: getTitle()
    }, userId) //строковые поля вместо числовых в координатах
    await expect(addPointData).rejects.toEqual("failed to get geodata")

    //добавляем дубликат
    await testPoint({ //принудительное добавление дубликата
        lng: 54.407203,
        lat: 24.016567,
        force: true
    })
    //проверяем выставилась ли поле duplicateGroup
    expect(await Shop.query().where({
        lng: 54.407203,
        lat: 24.016567
    }).select("duplicateGroup"))
        .not.toContainEqual({
            duplicateGroup: null
        })

    addPointData = addPoint({
        lng: 54.407203,
        lat: 24.016567,
        title: getTitle()
    }, userId) //минимальные данные
    await expect(addPointData).rejects.toMatchSchema(duplicateModel)

    addPointData = addPoint({
        lng: 54.408203,
        lat: 24.017567,
        title: getTitle()
    }, userId) //удаление ~150 метров
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



    //получение точек исключения
    await expect(getPointsUser()).rejects.toBe("userId must not be empty")
    await expect(getPointsUser("1")).rejects.toBe("userId must not be empty")
    await expect(getPointsUser(undefined)).rejects.toBe("userId must not be empty")
    await expect(getPointsUser(null)).rejects.toBe("userId must not be empty")
})

test("Удаление точек", async () => {
    //добавляем пользователя
    const { userId } = await addTestUser()
    //добавляем точки
    await addPoint({ title: getTitle(), lat: 24.130330, lng: 56.953938 }, userId)
    await addPoint({ title: getTitle(), lat: 24.109677, lng: 56.954095 }, userId)
    //получаем список добавленных точек
    const points = await getPointsUser(userId)
    //исключения
    await expect(delPoint(-21232, points[0].id)).rejects.toBe("point id not found")
    await expect(delPoint(undefined, points[0].id)).rejects.toBe("userId must not be empty")
    await expect(delPoint(userId, undefined)).rejects.toBe("pointId must not be empty")
    await expect(delPoint(userId, -324234)).rejects.toBe("point id not found")
    //удаляем все точки
    for (let elem of points) {
        await delPoint(userId, elem.id)
    }
    //проверяем что не получаем точек
    expect(await getPointsUser(userId)).toEqual([])
})

// test("Редактирование точек пользователем", () => {
//     //добавляем пользователя
//     const { userId } = await addTestUser()
//     //добавляем точки
//     await addPoint({ title: getTitle(), lat: 24.130330, lng: 56.953938 }, userId)
//     await addPoint({ title: getTitle(), lat: 24.109677, lng: 56.954095 }, userId)
//     //получаем список добавленных точек
//     const points = await getPointsUser(userId)
// })

test("Получение, редактирование, отклонение и подтверждение точек модератором", async () => {
    //добавляем пользователя
    let { userId } = await addTestUser()
    //добавляем точки

    let point1 = await addPoint({ title: getTitle(), lat: 25.826511, lng: 53.586868, description: "123" }, userId)
    let point2 = await addPoint({ title: getTitle(), lat: 25.816728, lng: 53.585997, description: "123" }, userId)
    //получаем список добавленных точек
    let resGetPointsModer = await getPointsModer()
    //проверяем, есть ли в списке добавленные точки
    expect(resGetPointsModer)
        .toContainEqual(expect.objectContaining({ moder_status: "moderated", title: point1[0].title, description: "123" }))
    expect(resGetPointsModer)
        .toContainEqual(expect.objectContaining({ moder_status: "moderated", title: point2[0].title, description: "123" }))
    expect(resGetPointsModer).toMatchSchema(getPointsModerModel)

    //отклоняем точки
    expect(await setPointRefuse(point1[0].id)).toBe(point1[0].id)
    expect(await setPointRefuse(point2[0].id, "comment")).toBe(point2[0].id)
    //отклонение уже отклоненной точки
    await expect(setPointRefuse(point2[0].id, "comment")).rejects.toBe("fail")
    //отклонение несуществующей точки
    await expect(setPointRefuse(-232, "comment")).rejects.toBe("fail")
    //некорректное поле id
    await expect(setPointRefuse("fdfdf", "comment")).rejects.toBe("pointId must not be empty")
    await expect(setPointRefuse(undefined, "comment")).rejects.toBe("pointId must not be empty")

    //статус должен сменится на refuse, и изменится комментарии
    let resGetPointsUser = await getPointsUser(userId)
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "refuse", title: point1[0].title, description: null }))
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "refuse", title: point2[0].title, description: "comment" }))
    //должны пропасть из списка модераторов
    resGetPointsModer = await getPointsModer()

    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point1[0].title }))
    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point2[0].title }))

    //удаляем точки
    await delPoint(userId, point1[0].id)
    await delPoint(userId, point2[0].id)
    //добавляем заново
    point1 = await addPoint({ title: getTitle(), lat: 25.826511, lng: 53.586868, description: "123" }, userId)
    point2 = await addPoint({ title: getTitle(), lat: 25.816728, lng: 53.585997, description: "123" }, userId)

    //подтверждаем точки
    expect(await setPointAccept(point1[0].id)).toBe(point1[0].id)
    expect(await setPointAccept(point2[0].id)).toBe(point2[0].id)
    //Подтверждаем несуществующую точку
    await expect(setPointAccept(-232)).rejects.toBe("fail")
    //некорректное поле id
    await expect(setPointAccept("fdfdf")).rejects.toBe("pointId must not be empty")
    await expect(setPointAccept(undefined)).rejects.toBe("pointId must not be empty")
    //статус должен сменится на accept, и изменится комментарии
    resGetPointsUser = await getPointsUser(userId)
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "accept", title: point1[0].title, description: null }))
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "accept", title: point2[0].title, description: null }))

    //должны пропасть из списка модераторов
    resGetPointsModer = await getPointsModer()

    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point1[0].title }))
    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point2[0].title }))

    //удаляем точки
    await delPoint(userId, point1[0].id)
    await delPoint(userId, point2[0].id)
    //добавляем заново
    point1 = await addPoint({ title: getTitle(), lat: 25.826511, lng: 53.586868, description: "123" }, userId)
    point2 = await addPoint({ title: getTitle(), lat: 25.816728, lng: 53.585997, description: "123" }, userId)
    let point3 = await addPoint({ title: getTitle(), lat: 24.070592, lng: 56.891907, description: "123" }, userId)
    //редактируем точки
    //без ничего не редактируем
    expect(await editPointModer(point1[0].id)).toBe(point1[0].id)
    //редактируем одно поле
    expect(await editPointModer(point2[0].id, { house: "dfdfd" })).toBe(point2[0].id)
    //редактируем все поля
    point3[0].title = getTitle()
    expect(await editPointModer(point3[0].id, {
        title: point3[0].title,
        street: "qsdsd",
        house: "dfdfd",
        full_city_name: "dddd, asdsad",
        apartment: "fdassa",
        hours: "sdasda",
        phone: "sdsdssss",
        site: "sdsdsssdsd"
    })).toBe(point3[0].id)
    //Подтверждаем несуществующую точку
    await expect(editPointModer(-232)).rejects.toBe("fail")
    //некорректное поле id
    await expect(editPointModer("fdfdf")).rejects.toBe("pointId must not be empty")
    await expect(editPointModer(undefined)).rejects.toBe("pointId must not be empty")
    //статус должен сменится на accept, и изменится комментарии
    resGetPointsUser = await getPointsUser(userId)
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "accept", title: point1[0].title, description: null }))
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({ moder_status: "accept", title: point2[0].title, description: null, house: "dfdfd" }))
    expect(resGetPointsUser)
        .toContainEqual(expect.objectContaining({
            moder_status: "accept",
            title: point3[0].title,
            description: null,
            street: "qsdsd",
            house: "dfdfd",
            full_city_name: "dddd, asdsad",
            apartment: "fdassa",
            hours: "sdasda",
            phone: "sdsdssss",
            site: "sdsdsssdsd"
        }))

    //должны пропасть из списка модераторов
    resGetPointsModer = await getPointsModer()

    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point1[0].title }))
    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point2[0].title }))
    expect(resGetPointsModer).not.toContainEqual(expect.objectContaining({ title: point3[0].title }))


})


afterAll(delTestPoint)
afterAll(delTestUser)