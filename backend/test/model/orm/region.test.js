const Region = require("../../../src/model/orm/region")
const getRegionsModel= require("../../../openApi/models/res/getRegions.json")
const {matchers} = require("jest-json-schema")

expect.extend(matchers)

test("Тест функции getRegionById", async () => {
    let regions, region
    //Получаем список всех регионов
    regions = await Region.getRegionById()
    expect(regions).toMatchSchema(getRegionsModel)
    //получаем данные региона по id
    region = await Region.getRegionById(regions[0].id)
    expect(region).toContainEqual(regions[0])
    expect(region).toMatchSchema(getRegionsModel)

    region = await Region.getRegionById(regions[1].id)
    expect(region).toContainEqual(regions[1])
    expect(region).toMatchSchema(getRegionsModel)
    //исключения
    await expect(Region.getRegionById("test")).rejects.toBe("incorrect regionId")
    await expect(Region.getRegionById(-23)).rejects.toBe("failed to find a region with this regionId")
    await expect(Region.getRegionById(null)).rejects.toBe("incorrect regionId")
})