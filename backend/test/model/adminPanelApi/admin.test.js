const getRegionsModel = require("../../../openApi/models/getRegions.v1.json")
const { matchers } = require("jest-json-schema")
const { getRegions, addRegion, editRegion, getUsers, addUser } = require("../../../src/model/adminPanelApi/admin")
const { nanoid } = require("nanoid")
const getUserModel = require("../../../openApi/models/getUsers.v1.json")
const Permission = require("../../../src/model/orm/permission")

expect.extend(matchers)

// function delTestRegions() {

// }

test("Тест функции getRegions", async () => {
    //добавляем регион
    const region = "nanoidAdmin" + nanoid()
    await addRegion(region)
    //Получаем список всех регионов
    const regions = await getRegions()
    expect(regions).toMatchSchema(getRegionsModel)
})

test("Тест функции addRegion, добавление региона", async () => {
    let region = "nanoidAdmin" + nanoid()
    let getRegion, regions
    //добовляем регион
    getRegion = await addRegion(region)
    //получаем регионы
    regions = await getRegions()
    //проверяем вывод getRegions
    expect(regions).toMatchSchema(getRegionsModel)
    //проверяем нахождение добавленего региона в во всех регионах
    expect(regions).toContainEqual(getRegion[0])
    expect(regions).toContainEqual(expect.objectContaining({ region }))
    //исключения
    await expect(addRegion(3)).rejects.toBe("incorrect region")
    await expect(addRegion()).rejects.toBe("incorrect region")
})

test("Редактирование региона editRegion", async () => {
    let region = "nanoidAdmin" + nanoid()
    let nameEdit = "nanoidAdmin" + nanoid()
    let getRegion, regions
    //добовляем регион
    getRegion = await addRegion(region)
    //редактируем регион
    regionEdit = await editRegion(getRegion[0].id, nameEdit)
    //получаем все регионы
    regions = await getRegions()
    //проверяем соответствие добавленых данных
    expect(regions).toContainEqual(expect.objectContaining({ region: nameEdit}))
    expect(regions).toContainEqual(regionEdit[0])
    expect(regionEdit).toMatchSchema(getRegionsModel)
    //исключения
    await expect(editRegion(undefined, nameEdit)).rejects.toEqual("incorrect regionId")
    await expect(editRegion(undefined)).rejects.toBe("incorrect regionId")
    await expect(editRegion(getRegion[0].id)).rejects.toEqual("incorrect region")
    await expect(editRegion(-23, nameEdit)).rejects.toEqual("fail")
})

test("Тест функции getUsers", async () => {
    //сравниваем с JSON схемой
    const users = await getUsers()
    expect(users).toMatchSchema(getUserModel)
})

test("Добавление пользователей", async () => {
    let email
    email=nanoid()+"@nanoid.nanoid"
    Permission.getIdByPermission("user")
    addUser(email,"testtest",)
})
