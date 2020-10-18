const _ = require("lodash")
const chai = require('chai')
const fp = require('lodash/fp')
const { nanoid } = require('nanoid')
chai.use(require('chai-json-schema-ajv'))
const expect = chai.expect

const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
axiosCookieJarSupport(axios)

const getPointJson = require("../../openApi/models/res/getPointsUser.json")
const dublicateJson = require("../../openApi/models/res/duplicate.json")
const delPointJson = require("../../openApi/models/res/delPoint.json")
const { addUser, addRegion } = require('../../src/model/adminPanelApi/admin')
const Moder_status = require('../../src/model/orm/moder_status')
const Region = require('../../src/model/orm/region')
const Shop = require('../../src/model/orm/shop')
const User = require('../../src/model/orm/user')
const Permission = require("../../src/model/orm/permission")
const { createPoint } = require("./testhelper")
const { describe } = require("mocha")

axios.defaults.baseURL = "http://127.0.0.1:3000"
axios.defaults.withCredentials = true
const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar


describe("user", function () {
    let getPoints, user, moder, region, userOther, moderOther
    const costomReduce = fp.partial(fp.reduce, [fp, 0])
    const amountStatus = fp.overArgs(costomReduce, [
        moder_status => (sum, elem) => {
            return elem.moder_status == moder_status ? sum + 1 : sum
        }
    ])
    before(async function () {
        region = await addRegion("nanoid")
        regionOther = await addRegion("nanoidOther")
        user = (await addUser("nanoid@nanoid.nanoiduser", "testtest", await Permission.getIdByPermission("user"), region[0].id))[0]
        moder = (await addUser("nanoid@nanoid.nanoidmoder", "testtest", await Permission.getIdByPermission("moder"), region[0].id))[0]
        userOther = (await addUser("nanoid@nanoid.nanoiduserOther", "testtest", await Permission.getIdByPermission("user"), regionOther[0].id))[0]
        moderOther = (await addUser("nanoid@nanoid.nanoidmoderOther", "testtest", await Permission.getIdByPermission("moder"), regionOther[0].id))[0]

        for (let key of [user.id, moder.id, userOther.id, moderOther.id]) {
            await createPoint(key, "accept", false)
            await createPoint(key, "moderated", false)
            await createPoint(key, "refuse", false)

            await createPoint(key, "moderated", true)
            await createPoint(key, "refuse", true)
            await createPoint(key, "delete", true)
        }

        await createPoint(user.id, "return", true)
        await createPoint(userOther.id, "return", true)
        await createPoint(user.id, { status: "take", id: moder.id }, true)
        await createPoint(userOther.id, { status: "take", id: moderOther.id }, true)
    })

    describe("getPoints", function () {
        describe("user", function () {
            before(async () => {
                await axios.post("/api/login", { login: "nanoid@nanoid.nanoiduser", password: "testtest" })
                getPoints = await axios.get("/api/user/getPoints")
            })

            it("Json matching", async function () {
                expect(getPoints.data.response).to.be.jsonSchema(getPointJson)
            })

            it("Amount point", async function () {
                expect(getPoints.data.response.length).to.be.equal(8)
            })

            it("Amount accept point", async function () {
                expect(amountStatus("accept")(getPoints.data.response)).to.be.equal(1)
            })
        })

        describe("moder", function () {
            before(async () => {
                await axios.post("/api/login", { login: "nanoid@nanoid.nanoidmoder", password: "testtest" })
                getPoints = await axios.get("/api/user/getPoints")
            })

            it("Json matching", async function () {
                expect(getPoints.data.response).to.be.jsonSchema(getPointJson)
            })

            it("Amount point", async function () {
                expect(getPoints.data.response.length).to.be.equal(14)
            })

            it("Amount accept point", async function () {
                expect(amountStatus("accept")(getPoints.data.response)).to.be.equal(2)
            })
        })
    })

    describe("getPointsFree", function () {
        before(async () => {


            let point = await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("return"),
                user_id: user.id
            })

            await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: user.id,
                parent_id: point.id
            })

            point = await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("return"),
                user_id: userOther.id
            })

            await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: userOther.id,
                parent_id: point.id
            })

            await axios.post("/api/login", { login: "nanoid@nanoid.nanoiduser", password: "testtest" })
            getPointsFree = await axios.get("/api/user/getPointsFree")
        })

        it("Json matching", async function () {
            expect(getPointsFree.data.response).to.be.jsonSchema(getPointJson)
        })

        it("Amount point", async function () {
            expect(getPointsFree.data.response.length).to.be.equal(3)
        })

        it("Amount accept point", async function () {
            expect(amountStatus("accept")(getPointsFree.data.response)).to.be.equal(1)
        })

        it("Amount return point", async function () {
            expect(amountStatus("return")(getPointsFree.data.response)).to.be.equal(2)
        })

        after(async () => {
            await Shop.query().delete().where({
                lng: 88,
                lat: 88,
                full_city_name: 88
            })
        })
    })

    describe("takePoint and returnPoint", function () {
        let pointReturn, pointTake, pointAcceptUser, pointAcceptModer
        before(async () => {
            pointReturn = await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("return"),
                user_id: user.id
            })

            await Shop.query().insert({
                lng: 88,
                lat: 88,
                full_city_name: 88,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: user.id,
                parent_id: pointReturn.id
            })

            pointTake = await Shop.query().insert({
                lng: 99,
                lat: 99,
                full_city_name: 99,
                moder_status_id: await Moder_status.getIdByModerStatus("take"),
                user_id: user.id
            })

            await Shop.query().insert({
                lng: 99,
                lat: 99,
                full_city_name: 99,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: moder.id,
                parent_id: pointTake.id
            })

            pointAcceptUser = await Shop.query().insert({
                lng: 55,
                lat: 55,
                full_city_name: 55,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: user.id
            })

            pointAcceptModer = await Shop.query().insert({
                lng: 66,
                lat: 66,
                full_city_name: 66,
                moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                user_id: moder.id
            })


            await axios.post("/api/login", { login: "nanoid@nanoid.nanoiduser", password: "testtest" })
        })

        describe("takePoint", function () {

            it("применяем к точке со статусом return", async function () {
                response = await axios.post("/api/user/takePoint", { id: pointReturn.id })
                expect(response.data.response).to.be.jsonSchema(getPointJson)
                expect((await Shop.query().where({
                    lng: 88,
                    lat: 88,
                    full_city_name: 88,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    user_id: user.id,
                    parent_id: null
                })).length).to.be.equal(1)

                expect((await Shop.query().where({
                    lng: 88,
                    lat: 88,
                    full_city_name: 88,
                    moder_status_id: await Moder_status.getIdByModerStatus("return"),
                    user_id: user.id
                })).length).to.be.equal(0)
            })

            it("применяем к точке со статусом accept", async function () {
                response = await axios.post("/api/user/takePoint", { id: pointAcceptModer.id })
                expect((await Shop.query().where({
                    lng: 66,
                    lat: 66,
                    full_city_name: 66,
                    moder_status_id: await Moder_status.getIdByModerStatus("take"),
                    user_id: user.id,
                    parent_id: null
                })).length).to.be.equal(1)

                expect((await Shop.query().where({
                    lng: 66,
                    lat: 66,
                    full_city_name: 66,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    user_id: moder.id,
                    parent_id: pointAcceptModer.id
                })).length).to.be.equal(1)
            })

            it("применяем к точке со статусом take", async function () {
                response = await axios.post("/api/user/takePoint", { id: pointAcceptModer.id })
                expect(response.data).to.be.deep.equal({ isError: true, response: 'this id not found' })
            })
        })

        describe("returnPoint", function () {
            it("применяем к точке со статусом take", async function () {
                response = await axios.post("/api/user/returnPoint", { id: pointTake.id })
                expect(response.data.response).to.be.jsonSchema(getPointJson)
                expect((await Shop.query().where({
                    lng: 99,
                    lat: 99,
                    full_city_name: 99,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    user_id: moder.id,
                    parent_id: null
                })).length).to.be.equal(1)

                expect((await Shop.query().where({
                    lng: 99,
                    lat: 99,
                    full_city_name: 99,
                    moder_status_id: await Moder_status.getIdByModerStatus("take"),
                    user_id: user.id
                })).length).to.be.equal(0)
            })

            it("применяем к точке со статусом accept", async function () {
                response = await axios.post("/api/user/returnPoint", { id: pointAcceptUser.id })
                expect(response.data.response).to.be.jsonSchema(getPointJson)

                expect((await Shop.query().where({
                    lng: 55,
                    lat: 55,
                    full_city_name: 55,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    user_id: user.id,
                    parent_id: pointAcceptUser.id
                })).length).to.be.equal(1)

                expect((await Shop.query().where({
                    id: pointAcceptUser.id,
                    lng: 55,
                    lat: 55,
                    full_city_name: 55,
                    moder_status_id: await Moder_status.getIdByModerStatus("return"),
                    user_id: user.id,
                    parent_id: null
                })).length).to.be.equal(1)

                expect((await Shop.query().where({
                    lng: 55,
                    lat: 55,
                    full_city_name: 55,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    user_id: user.id,
                    parent_id: null
                })).length).to.be.equal(0)
            })

            it("применяем к точке со статусом take", async function () {
                response = await axios.post("/api/user/returnPoint", { id: pointAcceptUser.id })
                expect(response.data).to.be.deep.equal({ isError: true, response: 'fail' })
            })
        })
    })

    describe("addPoint", function () {

        describe("user", async function () {
            before(async () => {
                await axios.post("/api/login", { login: "nanoid@nanoid.nanoiduser", password: "testtest" })
            })

            it("Соответствие добавленных данных, данным в базе", async function () {
                const data = {
                    lng: 54.407203,
                    lat: 24.016567,
                    title: "title",
                    apartment: "apartment",
                    hours: "hours",
                    phone: "phone",
                    site: "site",
                    description: "description",
                    isActive: false
                }
                const point = (await axios.post("/api/user/addPoint", data)).data.response
                const getPoints = (await axios.get("/api/user/getPoints")).data.response
                const pointDB = (await Shop.query().where(data).first())
                expect(pointDB.user_id).to.be.equal(user.id)
                expect(point).to.be.jsonSchema(getPointJson)
                expect(getPoints).to.deep.include(point[0])
            })

            it("Тест дубликатов", async function () {
                const data = {
                    //удаление ~150 метров
                    lng: 54.408203,
                    lat: 24.017567,
                    title: "title",
                    apartment: "apartment",
                    hours: "hours",
                    phone: "phone",
                    site: "site",
                    description: "description",
                    isActive: false
                }

                const point = (await axios.post("/api/user/addPoint", data)).data
                expect(point.response).to.be.jsonSchema(dublicateJson)
                expect(point.response.duplicate.points).to.be.lengthOf(1)
                expect(point.isError).to.be.equal(true)
            })

            it("Принудительное добавление дубликата, проверка группы дубликата", async function () {
                const data = {
                    //удаление ~150 метров
                    lng: 54.408203,
                    lat: 24.017567,
                    title: "title",
                    apartment: "apartment",
                    hours: "hours",
                    phone: "phone",
                    site: "site",
                    description: "description",
                    isActive: false,
                    force: true
                }

                const point = (await axios.post("/api/user/addPoint", data)).data.response
                expect(point).to.be.jsonSchema(getPointJson)
                delete (data.force)
                const pointDB = (await Shop.query().where(data).first())
                expect(pointDB.duplicateGroup).to.not.be.null
            })

            it("Тест группы дубликатов", async function () {
                const data = {
                    lng: 54.410003,
                    lat: 24.019367,
                    title: "title",
                    apartment: "apartment",
                    hours: "hours",
                    phone: "phone",
                    site: "site",
                    description: "description",
                    isActive: false
                }

                const point = (await axios.post("/api/user/addPoint", data)).data
                expect(point.response).to.be.jsonSchema(dublicateJson)
                expect(point.isError).to.be.equal(true)
                expect(point.response.duplicate.points).to.deep.to.lengthOf(2)
            })

        })

        describe("moder", async function () {
            before(async () => {
                await axios.post("/api/login", { login: "nanoid@nanoid.nanoidmoder", password: "testtest" })
            })

            it("Соответствие добавленных данных, данным в базе", async function () {
                const data = {
                    lng: 50.866683,
                    lat: 20.634994,
                    title: "title",
                    apartment: "apartment",
                    hours: "hours",
                    phone: "phone",
                    site: "site",
                    description: "description",
                    isActive: false
                }
                const point = (await axios.post("/api/user/addPoint", data)).data.response
                const getPoints = (await axios.get("/api/user/getPoints")).data.response
                const pointDB = (await Shop.query().where(data).first())
                expect(pointDB.user_id).to.be.equal(moder.id)
                expect(point).to.be.jsonSchema(getPointJson)
                expect(getPoints).to.deep.include(point[0])
            })

        })


    })

    describe("editPoint", function () {

        before(async function () {
            await axios.post("/api/login", { login: "nanoid@nanoid.nanoidmoder", password: "testtest" })
        })

        describe("Тестирование редактирование точек с разными статусами", function () {
            describe("Точка не имеет подтвержденую копию/новая точка", function () {

                it("accept", async function () {
                    const point = await createPoint(user.id, "accept", false)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    delete (editData.force)
                    delete (editData.timeStamp)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(1)
                    expect(await Shop.query().where("title", editData.title)).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })

                it("moderated", async function () {
                    const point = await createPoint(user.id, "moderated", false)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    delete (editData.force)
                    delete (editData.timeStamp)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(0)
                    expect(await Shop.query().where("title", editData.title)).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })

                it("refuse", async function () {
                    const point = await createPoint(user.id, "refuse", false)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    delete (editData.force)
                    delete (editData.timeStamp)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(0)
                    expect(await Shop.query().where("title", editData.title)).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })
            })

            describe("Точка имеет подтвержденную копию", function () {
                it("moderated", async function () {
                    const point = await createPoint(user.id, "moderated", true)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    delete (editData.force)
                    delete (editData.timeStamp)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(1)
                    expect(await Shop.query().where({ "title": point.title, parent_id: null })).lengthOf(0)
                    expect(await Shop.query().where("title", editData.title)).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })

                it("refuse", async function () {
                    const point = await createPoint(user.id, "refuse", true)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    delete (editData.force)
                    delete (editData.timeStamp)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(1)
                    expect(await Shop.query().where({ "title": point.title, parent_id: null })).lengthOf(0)
                    expect(await Shop.query().where("title", editData.title)).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })

                it("delete", async function () {
                    const point = await createPoint(user.id, "delete", true)
                    const editData = {
                        lng: 53.530696,
                        lat: 28.177563,
                        title: nanoid(),
                        apartment: nanoid(),
                        hours: nanoid(),
                        phone: nanoid(),
                        site: nanoid(),
                        description: nanoid(),
                        force: false,
                        isActive: 0,
                        timeStamp: point.timeStamp
                    }
                    const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                    expect(response.data.response[0]).to.include({ description: editData.description })
                    delete (editData.force)
                    delete (editData.timeStamp)
                    delete (editData.description)
                    editData.moder_status = "moderated"
                    expect(response.data.response[0]).to.not.include(editData)
                    expect(response.data.response).to.jsonSchema(getPointJson)
                    expect(await Shop.query().where({ "title": point.title, parent_id: point.id })).lengthOf(1)
                    await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
                })
            })

        })

        describe("Тест исключений", function () {
            it("редактирование точки return", async function () {
                const point = await createPoint(user.id, "return", true)
                const editData = {
                    lng: 53.530696,
                    lat: 28.177563,
                    title: nanoid(),
                    apartment: nanoid(),
                    hours: nanoid(),
                    phone: nanoid(),
                    site: nanoid(),
                    description: nanoid(),
                    force: false,
                    isActive: 0,
                    timeStamp: point.timeStamp
                }
                const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                expect(response.data.response).to.equal("fail")
                await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
            })

            it("редактирование точки take", async function () {
                const point = await createPoint(user.id, { status: "take", id: moder.id }, true)
                const editData = {
                    lng: 53.530696,
                    lat: 28.177563,
                    title: nanoid(),
                    apartment: nanoid(),
                    hours: nanoid(),
                    phone: nanoid(),
                    site: nanoid(),
                    description: nanoid(),
                    force: false,
                    isActive: 0,
                    timeStamp: point.timeStamp
                }
                const response = await axios.post("/api/user/editPoint/" + point.id, editData)
                expect(response.data.response).to.equal("fail")
                await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
            })
        })

        describe("тест дубликатов", function () {
            it("проверка дубликата точки самой с сабой(не должно быть дубликата)", async function () {
                const point = await createPoint(user.id, "moderated", true, { lng: 56.650943, lat: 23.724066 })
                const response = await axios.post("/api/user/editPoint/" + point.id, { lng: 56.650943, lat: 23.724066, timeStamp: point.timeStamp })
                expect(response.data.response).to.jsonSchema(getPointJson)
                await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
            })

            it("Создание дубликата", async function () {
                const point = await createPoint(user.id, "moderated", true, { lng: 56.650943, lat: 23.724066 })
                const pointDup = await createPoint(user.id, "moderated", true)
                const response = await axios.post("/api/user/editPoint/" + pointDup.id, { lng: 56.650943, lat: 23.724066, timeStamp: pointDup.timeStamp })
                expect(response.data.response.duplicate.points).to.lengthOf(1)
                expect(response.data.response).to.jsonSchema(dublicateJson)
                await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
            })

            it("Создание дубликата принудительно", async function () {
                const point = await createPoint(user.id, "moderated", true, { lng: 56.650943, lat: 23.724066 })
                const pointDup = await createPoint(user.id, "moderated", true)
                const response = await axios.post("/api/user/editPoint/" + pointDup.id, { lng: 56.650943, lat: 23.724066, timeStamp: pointDup.timeStamp, force: true })
                expect(response.data.response).to.jsonSchema(getPointJson)
                expect(fp.map(fp.pick(['lng', 'lat']))(response.data.response)).to.deep.include({ lng: 56.650943, lat: 23.724066 })
                const pointDB = (await Shop.query().findById(response.data.response[0].id))
                expect(pointDB.duplicateGroup).to.not.be.null
                await Shop.query().delete().where({ id: point.id }).orWhere({ parent_id: point.id })
            })

        })
    })

    describe("delPoint", function () {

        before(async function () {
            await axios.post("/api/login", { login: "nanoid@nanoid.nanoidmoder", password: "testtest" })
        })

        describe("Точки без копии", function () {
            describe("accept", function () {
                let point, response

                before(async function () {
                    point = await createPoint(user.id, "accept", false)
                    response = await axios.post("/api/user/delPoint", { id: point.id })
                })

                it("Json matching", function () {
                    expect(response.data.response).to.jsonSchema(delPointJson)
                })

                it("Проверка поведения", async function () {
                    point.moder_status_id = await Moder_status.getIdByModerStatus("delete")
                    expect(await Shop.query().findById(point.id))
                        .to.deep.include(
                            fp.omit("timeStamp")
                                (fp.pick(fp.keys(response.data.response.point))(point))
                        )
                    delete (point.user_id)
                    delete (point.moder_status_id)
                    expect(response.data.response.point)
                        .to.deep.include(
                            fp.omit("timeStamp")
                                (fp.pick(fp.keys(response.data.response.point))(point))
                        )
                })

            })


            it("moderated", async function () {
                const point = await createPoint(user.id, "moderated", false)
                const response = await axios.post("/api/user/delPoint", { id: point.id })

                expect(response.data.isError).to.equal(false)
                expect(response.data.response.delete).to.equal(true)
                expect(response.data.response.point).to.undefined
                expect(await Shop.query().where("title", point.title)).to.be.empty
            })

            it("refuse", async function () {
                const point = await createPoint(user.id, "refuse", false)
                const response = await axios.post("/api/user/delPoint", { id: point.id })

                expect(response.data.isError).to.equal(false)
                expect(response.data.response.delete).to.equal(true)
                expect(response.data.response.point).to.undefined
                expect(await Shop.query().where("title", point.title)).to.be.empty
            })
        })

        describe("Точки с копией", function () {
            describe("moderated", function () {
                let point, response

                before(async function () {
                    point = await createPoint(user.id, "moderated", true)
                    response = await axios.post("/api/user/delPoint", { id: point.id })
                })

                it("Json matching", function () {
                    expect(response.data.response).to.jsonSchema(delPointJson)
                })

                it("Проверка поведения", async function () {
                    point.moder_status_id = await Moder_status.getIdByModerStatus("delete")
                    expect(response.data.isError).to.equal(false)
                    expect(response.data.response.delete).to.equal(false)
                    expect(await Shop.query().findById(point.id)).to.deep.include(point)
                    delete (point.user_id)
                    delete (point.moder_status_id)
                    expect(response.data.response.point)
                        .to.deep.include(
                            fp.omit("timeStamp")
                                (fp.pick(fp.keys(response.data.response.point))(point))
                        )
                })

            })

            describe("refuse", function () {
                let point, response

                before(async function () {
                    point = await createPoint(user.id, "refuse", true)
                    response = await axios.post("/api/user/delPoint", { id: point.id })
                })

                it("Json matching", function () {
                    expect(response.data.response).to.jsonSchema(delPointJson)
                })

                it("Проверка поведения", async function () {
                    point.moder_status_id = await Moder_status.getIdByModerStatus("delete")
                    expect(response.data.isError).to.equal(false)
                    expect(response.data.response.delete).to.equal(false)
                    expect(await Shop.query().findById(point.id)).to.deep.include(point)
                    delete (point.user_id)
                    delete (point.moder_status_id)
                    expect(response.data.response.point)
                        .to.deep.include(
                            fp.omit("timeStamp")
                                (fp.pick(fp.keys(response.data.response.point))(point))
                        )
                })
            })
        })

    })

    after(async function () {
        await Shop.query().delete().whereIn("user_id", [user.id, moder.id, moderOther.id, userOther.id])
        await User.query().deleteById(user.id)
        await User.query().deleteById(moder.id)
        await User.query().deleteById(userOther.id)
        await User.query().deleteById(moderOther.id)
        await Region.query().deleteById(region[0].id)
        await Region.query().deleteById(regionOther[0].id)
    })

})
