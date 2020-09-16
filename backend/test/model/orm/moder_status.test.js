const Moder_status = require("../../../src/model/orm/moder_status")

test ("Тест функции получение moder_status по id, getIdByIsModerated", async () => {
    const moder_status = await Moder_status.getIdByIsModerated("0")
    moder_status.forEach((elem)=>{
        expect(elem).toEqual(expect.any(Number))
    })
    await expect(Moder_status.getIdByIsModerated("d")).rejects.toEqual("incorrect isModerated")
    await expect(Moder_status.getIdByIsModerated()).rejects.toEqual("incorrect isModerated")
    await expect(Moder_status.getIdByIsModerated(-22)).rejects.toEqual("this isModerated not found")
})