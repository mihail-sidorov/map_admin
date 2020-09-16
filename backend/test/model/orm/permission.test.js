const { getPermission } = require("../../../src/model/adminPanelApi/admin")
const Permission = require("../../../src/model/orm/permission")

test("Проверка функции hasPermission", async () => {
    //получаем все права
    const permissions = await getPermission()
    //Проверяем id каждого на валидность
    for (let elem of permissions) {
        expect(await Permission.hasPermission(elem.id)).toBe(true)
    }
    //нет такого id
    expect(await Permission.hasPermission(-123)).toBe(false)
    //исключения
    //неверный формат id
    expect(Permission.hasPermission("y")).rejects.toEqual("permission_id must be integer")
    expect(Permission.hasPermission(null)).rejects.toEqual("permission_id must be integer")
    expect(Permission.hasPermission()).rejects.toEqual("permission_id must be integer")
})

test("Проверка функции getIdByPermission", async () => {
    const permissions = await getPermission()
    //Проверяем id каждого на валидность
    for (let elem of permissions) {
        expect(await Permission.getIdByPermission(elem.permission)).toBe(elem.id)
    }
    //неверный permission
    await expect(Permission.getIdByPermission("y")).rejects.toEqual("this permission not found")
    await expect(Permission.getIdByPermission(null)).rejects.toEqual("this permission not found")
    await expect(Permission.getIdByPermission(-333)).rejects.toEqual("this permission not found")
    await expect(Permission.getIdByPermission()).rejects.toEqual("this permission not found")
})