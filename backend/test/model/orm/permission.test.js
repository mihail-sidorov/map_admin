const { getPermission } = require("../../../src/model/adminPanelApi/admin")
const Permission = require("../../../src/model/orm/permission")

test("Проверка функции hasPermission", async () => {

    const permissions = await getPermission()

    for (let elem of permissions) {
        expect(await Permission.hasPermission(elem.id)).toBe(true)
    }

    expect(await Permission.hasPermission(-123)).toBe(false)

})

test("Проверка функции getIdByPermission", async () => {
    const permissions = await getPermission()

    for (let elem of permissions) {
        expect(await Permission.getIdByPermission(elem.permission)).toBe(elem.id)
    }


    await expect(Permission.getIdByPermission(null)).rejects.toEqual("this permission not found")
    await expect(Permission.getIdByPermission(-333)).rejects.toEqual("this permission not found")
    await expect(Permission.getIdByPermission()).rejects.toEqual("this permission not found")
})