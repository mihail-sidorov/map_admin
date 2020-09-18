const getRegionsModel = require("../../../openApi/models/getRegions.v1.json")
const { matchers } = require("jest-json-schema")
const { getRegions, addRegion, editRegion, getUsers, addUser, editUser } = require("../../../src/model/adminPanelApi/admin")
const { nanoid } = require("nanoid")
const getUserModel = require("../../../openApi/models/getUsers.v1.json")
const Permission = require("../../../src/model/orm/permission")
const { addTestUser, delTestUser, delTestRegion, getEmail } = require("../../testhelper")
const User = require("../../../src/model/orm/user")

expect.extend(matchers)


test("Тест функции getRegions", async () => {

    const region = "nanoidAdmin" + nanoid()
    await addRegion(region)

    const regions = await getRegions()
    expect(regions).toMatchSchema(getRegionsModel)
})

test("Тест функции addRegion, добавление региона", async () => {
    let region = "nanoidAdmin" + nanoid()
    let getRegion, regions

    getRegion = await addRegion(region)

    regions = await getRegions()

    expect(regions).toMatchSchema(getRegionsModel)

    expect(regions).toContainEqual(getRegion[0])
    expect(regions).toContainEqual(expect.objectContaining({ region }))

    await expect(addRegion(3)).rejects.toBe("incorrect region")
    await expect(addRegion()).rejects.toBe("incorrect region")
})

test("Редактирование региона editRegion", async () => {
    let region = "nanoidadmin" + nanoid()
    let nameEdit = "nanoidadmin" + nanoid()
    let getRegion, regions

    getRegion = await addRegion(region)

    regionEdit = await editRegion(getRegion[0].id, nameEdit)

    regions = await getRegions()
 
    expect(regions).toContainEqual(expect.objectContaining({ region: nameEdit }))
    expect(regions).toContainEqual(regionEdit[0])
    expect(regionEdit).toMatchSchema(getRegionsModel)

    await expect(editRegion(undefined, nameEdit)).rejects.toEqual("incorrect regionId")
    await expect(editRegion(undefined)).rejects.toBe("incorrect regionId")
    await expect(editRegion(getRegion[0].id)).rejects.toEqual("incorrect region")
    await expect(editRegion(-23, nameEdit)).rejects.toEqual("fail")
})

test("Тест функции getUsers", async () => {

    const users = await getUsers()
    expect(users).toMatchSchema(getUserModel)
})

test("Добавление пользователя", async () => {

    let {
        email,
        permission_id,
        region_id
    } = await addTestUser("admin", true)

    const addUserRes = await addUser(email, "testtest", permission_id, region_id)
    expect(addUserRes).toMatchSchema(getUserModel)
    const getUser = await User.query().findById(addUserRes[0].id).first()
    expect(getUser.id).toBe(addUserRes[0].id)

})

test("Редактирование пользователя", async () => {
    let userAfterEdit, userBeforeEdit
    const {
        addUserRes
    } = await addTestUser("admin")

    userBeforeEdit = await User.query().findById(addUserRes[0].id).first()
    expect(await editUser(addUserRes[0].id, undefined, "password")).toMatchSchema(getUserModel)
    userAfterEdit = await User.query().findById(addUserRes[0].id).first() 
    const {
        password,
        ...userAfterEditPassword
    } = userAfterEdit

    expect(userBeforeEdit).toMatchObject(userAfterEditPassword)
    expect(userBeforeEdit.password).not.toBe(password)

    userBeforeEdit = userAfterEdit
    expect(await editUser(addUserRes[0].id, getEmail("admin"), undefined)).toMatchSchema(getUserModel)
    userAfterEdit = await User.query().findById(addUserRes[0].id).first()
    const {
        email,
        ...userAfterEditEmail
    } = userAfterEdit

    expect(userBeforeEdit).toMatchObject(userAfterEditEmail)
    expect(userBeforeEdit.email).not.toBe(email)

    expect(editUser(-2323, getEmail(), undefined)).rejects.toBe("fail")
})

afterAll(delTestUser("admin"))
afterAll(delTestRegion("admin"))