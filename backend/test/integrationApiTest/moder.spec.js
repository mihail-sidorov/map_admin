const fp = require('lodash/fp')
const chai = require('chai')
chai.use(require('chai-json-schema-ajv'))
const expect = chai.expect


const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
axiosCookieJarSupport(axios)

const getPointModerJson = require("../../openApi/models/res/getPointsModer.json")
const { addUser, addRegion } = require('../../src/model/adminPanelApi/admin')
const Region = require('../../src/model/orm/region')
const Shop = require('../../src/model/orm/shop')
const User = require('../../src/model/orm/user')
const Permission = require("../../src/model/orm/permission")
const { createPoint } = require("./testhelper")
const Moder_status = require('../../src/model/orm/moder_status')
const { nanoid } = require('nanoid')

axios.defaults.baseURL = "http://127.0.0.1:3000"
axios.defaults.withCredentials = true
const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar

describe("Интерфейс модератора", () => {
    let user, moder, userOther, moderOther
    before(async function () {
        region = await addRegion("nanoidmoder")
        regionOther = await addRegion("nanoidOthermoder")
        user = (await addUser("moder@nanoid.nanoiduser", "testtest", await Permission.getIdByPermission("user"), region[0].id))[0]
        moder = (await addUser("moder@nanoid.nanoidmoder", "testtest", await Permission.getIdByPermission("moder"), region[0].id))[0]
        userOther = (await addUser("moder@nanoid.nanoiduserOther", "testtest", await Permission.getIdByPermission("user"), regionOther[0].id))[0]
        moderOther = (await addUser("moder@nanoid.nanoidmoderOther", "testtest", await Permission.getIdByPermission("moder"), regionOther[0].id))[0]

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

        await axios.post("/api/login", { login: "moder@nanoid.nanoidmoder", password: "testtest" })
    })

    describe("getPointsModer", function () {
        let getPoints
        const costomReduce = fp.partial(fp.reduce, [fp, 0])
        const amountStatus = fp.overArgs(costomReduce, [
            moder_status => (sum, elem) => {
                return elem.moder_status == moder_status ? sum + 1 : sum
            }
        ])

        before(async function () {
            getPoints = await axios.get("/api/moder/getPoints")
        })

        it("Json matching", async function () {
            expect(getPoints.data.response).to.be.jsonSchema(getPointModerJson)
        })

        it("Amount point", async function () {
            expect(getPoints.data.response.length).to.be.equal(8)
        })

        it("Amount accept point", async function () {
            expect(amountStatus("accept")(getPoints.data.response)).to.be.equal(0)
        })

        it("Amount refuse point", async function () {
            expect(amountStatus("refuse")(getPoints.data.response)).to.be.equal(0)
        })

        it("Amount moderated point", async function () {
            expect(amountStatus("moderated")(getPoints.data.response)).to.be.equal(4)
        })

        it("Amount delete point", async function () {
            expect(amountStatus("delete")(getPoints.data.response)).to.be.equal(2)
        })

        it("Amount take point", async function () {
            expect(amountStatus("take")(getPoints.data.response)).to.be.equal(1)
        })

        it("Amount return point", async function () {
            expect(amountStatus("return")(getPoints.data.response)).to.be.equal(1)
        })
    })

    describe("setPointRefuse", function () {

        it("Тест комментариев", async function () {
            let point = await createPoint(user.id, "moderated", false)
            let response = await axios.post("/api/moder/setPointRefuse", { id: point.id, description: "test" })
            delete (point.moder_status_id)
            point.description = "test"
            expect(response.data.response).to.equal(point.id)
            expect(await Shop.query().findById(point.id)).to.include(fp.omit("timeStamp")(point))
        })

        describe("Тестируем исключения", function () {
            it("accept point", async function () {
                let point = await createPoint(user.id, "accept", false)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "accept", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)
            })

            it("refuse point", async function () {
                point = await createPoint(user.id, "refuse", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(user.id, "refuse", true)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "refuse", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "refuse", true)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)
            })
        })

        describe("Точки без копий", function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "moderated", false)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("refuse")
                expect(response.data.response).to.equal(point.id)

                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(fp.omit("timeStamp")(point))
            })
        })

        describe("Точки с копиями", function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "moderated", true)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("refuse")

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(2)
                expect((await Shop.query().where({
                    title: point.title,
                    moder_status_id: await Moder_status.getIdByModerStatus("accept"),
                    parent_id: point.id
                })).length).to.equal(1)

                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })

            it("delete point", async function () {
                let point = await createPoint(user.id, "delete", true)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
                point.parent_id = null
                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })

            it("take point", async function () {
                let point = await createPoint(user.id, { status: "take", id: moder.id }, true)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
                point.user_id = moder.id

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })

            it("return point", async function () {
                let point = await createPoint(user.id, "return", true)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })
        })
    })

    describe("setPointAccept", function () {
        describe("Тестируем исключения", function () {
            it("accept point", async function () {
                let point = await createPoint(user.id, "accept", false)
                let response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "accept", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)
            })

            it("refuse point", async function () {
                point = await createPoint(user.id, "refuse", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(user.id, "refuse", true)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "refuse", false)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)

                point = await createPoint(userOther.id, "refuse", true)
                response = await axios.post("/api/moder/setPointRefuse", { id: point.id })
                expect(response.data.response).to.be.equal("point id not found")
                expect(response.data.isError).to.be.equal(true)
            })
        })

        it("moderated точка без копии", async function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "moderated", false)
                let response = await axios.post("/api/moder/setPointAccept", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.include(point)
            })
        })

        it("moderated точка с копией", async function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "moderated", true)
                let response = await axios.post("/api/moder/setPointAccept", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })
        })

        it("delete точка с копией", async function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "delete", true)
                let response = await axios.post("/api/moder/setPointAccept", { id: point.id })

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(0)
            })
        })

        it("return точка с копией", async function () {
            it("moderated point", async function () {
                let point = await createPoint(user.id, "return", true)
                let response = await axios.post("/api/moder/setPointAccept", { id: point.id })
                point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
                point.user_id = moder.id

                expect(response.data.response).to.equal(point.id)
                expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
                expect(await Shop.query().findById(point.id)).to.deep.include(point)
            })
        })

        it("take точка с копией", async function () {
            let point = await createPoint(user.id, { id: moder.id, status: "take" }, true)
            let response = await axios.post("/api/moder/setPointAccept", { id: point.id })
            point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
            point.user_id = user.id

            expect(response.data.response).to.equal(point.id)
            expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
            expect(await Shop.query().findById(point.id)).to.deep.include(point)
        })
    })

    describe("editPointModer", function () {
        it("moderated точка без копии", async function () {
            let point = await createPoint(user.id, "moderated", false)

            point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
            point.street = "1"
            point.house = "1"
            point.full_city_name = "1"
            point.title = nanoid()
            point.apartment = "1"
            point.hours = "1"
            point.phone = "1"
            point.site = "1"
            point.isActive = 1

            let response = await axios.post("/api/moder/editPoint/" + point.id, point)
            expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
            expect(response.data.response).to.equal(point.id)

            expect(await Shop.query().findById(point.id)).to.deep.include(fp.omit("timeStamp")(point))
        })



        it("moderated точка с копией", async function () {
            let point = await createPoint(user.id, "moderated", true)
            point.moder_status_id = await Moder_status.getIdByModerStatus("accept")
            point.street = "1"
            point.house = "1"
            point.full_city_name = "1"
            point.title = nanoid()
            point.apartment = "1"
            point.hours = "1"
            point.phone = "1"
            point.site = "1"
            point.isActive = 1

            let response = await axios.post("/api/moder/editPoint/" + point.id, point)
            expect((await Shop.query().where({ title: point.title })).length).to.equal(1)
            expect(response.data.response).to.equal(point.id)

            expect(await Shop.query().findById(point.id)).to.deep.include(
                fp.omit("timeStamp")
                    (fp.pick(fp.keys(response.data.response.point))(point))
            )
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
