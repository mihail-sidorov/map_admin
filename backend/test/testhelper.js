function addTestRegion() {
    let region = "nanoid" + nanoid()
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
}
