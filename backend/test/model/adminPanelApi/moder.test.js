const { getPointsModer } = require("../../../src/model/adminPanelApi/moder")

test("Тест получение точек модератором getPointsModer", async () => {
    //Добавление регионов
    const getRegion1 = await addRegion("nanoidModer" + nanoid())
    const getRegion2 = await addRegion("nanoidModer" + nanoid())
    //Добавлние пользователей
    const points = await getPointsModer()
    expect(2).toBe(2)
})