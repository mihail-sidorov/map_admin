const { matchers } = require("jest-json-schema")
const { addTestUser, delTestUser, delTestRegion, getEmail, getTitle, delTestPoint } = require("../../testhelper")
const Shop = require("../../../src/model/orm/shop")
const { getPoints, addPoint, delPoint } = require("../../../src/model/adminPanelApi/user")

const getPointsUserJson = require("../../../openApi/models/res/getPointsUser.json")
const duplicateJson = require("../../../openApi/models/res/duplicate.json")
const { getGeoData } = require("../../../src/model/adminPanelApi/utilityFn")

expect.extend(matchers)

test("Добавление и получение точки в том числе тест дубликатов addPoint, getPoints", async () => {
    const {
        user
    } = await addTestUser("user")
    
    async function testPoint(pointData, force) {
        // генерируем случайное имя, по которому потом тестовые точки будут удалятся
        pointData.title = getTitle("user")
        await getGeoData(pointData)
        //добавление точки только с полученными даными
        let addPointData = await addPoint(user, pointData,force)

        //получение добавленной точки из базы
        let pointFromDb = await Shop.query().where({
            lng: pointData.lng,
            lat: pointData.lat
        })
        //Получение точек через getPointsUser и сравниваем с запросом с базы
        let getPointsUserFnData = await getPoints(user)
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
        expect(addPointData).toMatchSchema(getPointsUserJson)
        if (!force) {
            //проверка что добавилась одна точка
            expect(pointFromDb.length).toBe(1)

            delete (addPointData[0].moder_status) //этого поля нет в базе оно в связанной таблице
            // проверка что точка в базе соответствует возврашенной точке addPoint
            expect(pointFromDb).toMatchObject(addPointData)
        }

        //сравниваем точку в базе с данными добавленными нами
        expect(pointFromDb).toContainEqual(expect.objectContaining(pointData))
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
        isActive: false
    })

    //добавляем дубликат
    await testPoint({ //принудительное добавление дубликата
        lng: 54.407203,
        lat: 24.016567
    },
        true
    )
    //проверяем выставилась ли поле duplicateGroup
    expect(await Shop.query().where({
        lng: 54.407203,
        lat: 24.016567
    }).select("duplicateGroup"))
        .not.toContainEqual({
            duplicateGroup: null
        })

    addPointData = addPoint(user,{
        lng: 54.407203,
        lat: 24.016567,
        title: getTitle("user")
    }) //минимальные данные
    await expect(addPointData).rejects.toMatchSchema(duplicateJson)

    addPointData = addPoint(user,{
        lng: 54.408203,
        lat: 24.017567,
        title: getTitle("user")
    }) //удаление ~150 метров
    await expect(addPointData).rejects.toMatchSchema(duplicateJson)

    addPointData = addPoint(user,{ 
        title: getTitle("user"),
        lng: 50.866683,
        lat: 20.634994,
        apartment: "apartment",
        hours: "hours",
        phone: "phone",
        site: "site",
        description: "description",
        isActive: false,
    })

    await expect(addPointData).rejects.toMatchSchema(duplicateJson)
})

test("Удаление точек delPoint", async () => {
    //добавляем пользователя
    const { user, userId } = await addTestUser("user")
    //добавляем точки
    await addPoint(user,{ title: getTitle("user"), lat: 24.130330, lng: 56.953938 })
    await addPoint(user,{ title: getTitle("user"), lat: 24.109677, lng: 56.954095 })
    //получаем список добавленных точек
    const points = await getPoints(user)
    console.log(points)
    //удаляем все точки
    for (let elem of points) {
        await delPoint(elem.id)
    }
    //проверяем что не получаем точек
    expect(await getPoints(user)).toEqual([])
})

// test("Редактирование точек пользователем", async () => {

//     const { user } = await addTestUser("user")

//     async function testEdit(insertData, moder_status_id_before, moder_status_after) {
//         let point, editPointData, points
//         //добавляем точку
//         point = await addPoint({ title: getTitle(), lat: 23.718856, lng: 56.649276 }, userId)
//         //меняем статус точи
//         await Shop.query().findById(point[0].id).patch({ moder_status_id: moder_status_id_before })
//         //получаем список добавленных точек
//         points = await getPointsUser(userId)
//         //ставим timeStamp
//         insertData = Object.assign(insertData, { timeStamp: points[0].timeStamp })
//         //редактирование
//         editPointData = await editPoint(userId, point[0].id, insertData)
//         //соответствие схемы
//         expect(editPointData).toMatchSchema(getPointsUserModel)
//         //соответствие возвращаемого значение значениям добавленной точки
//         delete (insertData.unwanted)
//         delete (insertData.timeStamp)
//         expect(editPointData[0]).toMatchObject(insertData)
//         //получаем все точки
//         points = await getPointsUser(userId)
//         //проверяем новые данные точек
//         expect(points).toContainEqual(editPointData[0])
//         //проверяем статус точки
//         expect(editPointData[0]).toHaveProperty('moder_status', moder_status_after)
//         //удаляем точки
//         return await delPoint(userId, editPointData[0].id)
//     }

//     const moderStatus = await Moder_status.query()
//     for (let elem of moderStatus) { //тест на точках все статусов
//         await testEdit({ phone: "111" }, elem.id, "moderated")
//         await testEdit({
//             title: getTitle(),
//             apartment: "111",
//             hours: "111",
//             phone: "111",
//             site: "111",
//             lng: 56.887585,
//             lat: 24.179342,
//             isActive: 0,
//             description: "111",
//             unwanted: "111"
//         }, elem.id, "moderated")
//         await testEdit({}, elem.id, elem.moder_status)
//     }

//     // const moderStatus = await Moder_status.query()
//     // for (let elem of moderStatus) { //тест на точках все статусов
//     //     //добавляем точки
//     //     point1 = await addPoint({ title: getTitle(), lat: 23.718856, lng: 56.649276 }, userId)
//     //     point2 = await addPoint({ title: getTitle(), lat: 23.707439, lng: 56.643248 }, userId)
//     //     //меняем статус точек
//     //     await Shop.query().findById(point1[0].id).patch({ moder_status_id: elem.id })
//     //     await Shop.query().findById(point2[0].id).patch({ moder_status_id: elem.id })
//     //     //получаем список добавленных точек
//     //     points = await getPointsUser(userId)
//     //     //статус точек moderated
//     //     //минимальное редактирование
//     //     insertData1 = { phone: "111", timeStamp: points[0].timeStamp }
//     //     editPointData1 = await editPoint(userId, point1[0].id, insertData1)
//     //     //максимальное редактирование
//     //     point2[0].title = getTitle()
//     //     insertData2 = {
//     //         title: point2[0].title,
//     //         apartment: "111",
//     //         hours: "111",
//     //         phone: "111",
//     //         site: "111",
//     //         lng: 56.887585,
//     //         lat: 24.179342,
//     //         isActive: 0,
//     //         description: "111",
//     //         unwanted: "111",
//     //         timeStamp: points[1].timeStamp
//     //     }
//     //     editPointData2 = await editPoint(userId, point2[0].id, insertData2)
//     //     //соответствие схемы
//     //     expect(editPointData1).toMatchSchema(getPointsUserModel)
//     //     expect(editPointData2).toMatchSchema(getPointsUserModel)
//     //     //соответствие возвращаемого значение значениям добавленной точки
//     //     delete (insertData1.timeStamp)
//     //     expect(editPointData1[0]).toMatchObject(insertData1)
//     //     delete (insertData2.unwanted)
//     //     delete (insertData2.timeStamp)
//     //     expect(editPointData2[0]).toMatchObject(insertData2)
//     //     //получаем все точки
//     //     points = await getPointsUser(userId)
//     //     //проверяем новые данные точек
//     //     expect(points).toContainEqual(editPointData1[0])
//     //     expect(points).toContainEqual(editPointData2[0])
//     //     //проверяем статус точки
//     //     expect(editPointData1[0]).toHaveProperty('moder_status', "moderated")
//     //     expect(editPointData2[0]).toHaveProperty('moder_status', "moderated")
//     //     //удаляем точки
//     //     await delPoint(userId, editPointData1[0].id)
//     //     await delPoint(userId, editPointData2[0].id)
// // })

// //     point1 = await addPoint({ title: getTitle(), lat: 23.718856, lng: 56.649276 }, userId)
// //     point2 = await addPoint({ title: getTitle(), lat: 23.707439, lng: 56.643248 }, userId)
// //     //получаем список добавленных точек
// //     points = await getPointsUser(userId)
// //     //ничего не редактируем
// //     editPointData1 = await editPoint(userId, point1[0].id, {})
// //     //максимальное редактирование
// //     point2[0].title = getTitle()
// //     insertData2 = {
// //         title: point2[0].title,
// //         apartment: "111",
// //         hours: "111",
// //         phone: "111",
// //         site: "111",
// //         lng: 56.887585,
// //         lat: 24.179342,
// //         isActive: 0,
// //         description: "111",
// //         unwanted: "111",
// //         timeStamp: points[1].timeStamp
// //     }
// //     editPointData2 = await editPoint(userId, point2[0].id, insertData2)
// //     //соответствие схемы
// //     expect(editPointData1).toMatchSchema(getPointsUserModel)
// //     expect(editPointData2).toMatchSchema(getPointsUserModel)
// //     //соответствие возвращаемого значение значениям добавленной точки
// //     delete (insertData1.timeStamp)
// //     expect(editPointData1[0]).toMatchObject(insertData1)
// //     delete (insertData2.unwanted)
// //     delete (insertData2.timeStamp)
// //     expect(editPointData2[0]).toMatchObject(insertData2)
// //     //получаем все точки
// //     points = await getPointsUser(userId)
// //     //проверяем новые данные точек
// //     expect(points).toContainEqual(editPointData1[0])
// //     expect(points).toContainEqual(editPointData2[0])
// //     //проверяем статус точки
// //     expect(editPointData1[0]).toHaveProperty('moder_status', "moderated")
// //     expect(editPointData2[0]).toHaveProperty('moder_status', "moderated")
// //     //удаляем точки
// //     await delPoint(userId, editPointData1[0].id)
// //     await delPoint(userId, editPointData2[0].id)

// })


afterAll(delTestPoint("user"))
afterAll(delTestUser("user"))
afterAll(delTestRegion("user"))