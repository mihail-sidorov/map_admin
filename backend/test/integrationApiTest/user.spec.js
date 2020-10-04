const _ = require("lodash")
const chai = require('chai')
const { nanoid } = require('nanoid')
chai.use(require('chai-json-schema-ajv'))
const expect = chai.expect

const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')
axiosCookieJarSupport(axios)

const getPointJson = require("../../openApi/models/res/getPointsUser.json")
const dublicateJson = require("../../openApi/models/res/duplicate.json")
const { addUser } = require('../../src/model/adminPanelApi/admin')
const Moder_status = require('../../src/model/orm/moder_status')
const Region = require('../../src/model/orm/region')
const Shop = require('../../src/model/orm/shop')
const User = require('../../src/model/orm/user')
const Permission = require("../../src/model/orm/permission")

axios.defaults.baseURL = "http://127.0.0.1:3000"
axios.defaults.withCredentials = true
const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar


describe("user", function () {

    let getPoints, user, moder, insertPoints
    before(async function () {

        user = (await addUser("nanoid@nanoid.nanoiduser", "testtest", await Permission.getIdByPermission("user"), (await Region.query().first()).id))[0]
        moder = (await addUser("nanoid@nanoid.nanoidmoder", "testtest", await Permission.getIdByPermission("moder"), (await Region.query().first()).id))[0]
        insertPoints = _.map(new Array(5), (elem, key) => {
            return {
                title: key,
                lng: key,
                lat: key,
                apartment: key,
                hours: key,
                phone: key,
                site: key,
                description: key,
                isActive: key,
                full_city_name: key
            }
        })

        const acceptStatusId = await Moder_status.getIdByModerStatus("accept")
        const moderatedStatusId = await Moder_status.getIdByModerStatus("moderated")
        insertPoints[0].moder_status_id = acceptStatusId
        insertPoints[0].user_id = user.id

        insertPoints[1].moder_status_id = moderatedStatusId
        insertPoints[1].user_id = user.id

        insertPoints[2].moder_status_id = await Moder_status.getIdByModerStatus("delete")
        insertPoints[2].user_id = user.id

        insertPoints[3].moder_status_id = await Moder_status.getIdByModerStatus("refuse")
        insertPoints[3].user_id = user.id

        insertPoints[4].moder_status_id = acceptStatusId
        insertPoints[4].user_id = moder.id

        for (let key = 0; key < insertPoints.length; key++) {
            await Shop.query().insert(insertPoints[key])
        }

        insertPoints[0].moder_status_id = moderatedStatusId
        insertPoints[4].moder_status_id = moderatedStatusId

        for (let key = 0; key < insertPoints.length; key++) {
            const point = await Shop.query().insert(insertPoints[key])
            insertPoints[key].moder_status_id = acceptStatusId
            insertPoints[key].parent_id = point.id
            await Shop.query().insert(insertPoints[key])
        }
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
                const sum = _.reduce(getPoints.data.response, (sum, elem) => {
                    return elem.moder_status == "accept" ? sum + 1 : sum
                }, 0)
                expect(sum).to.be.equal(1)
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
                expect(getPoints.data.response.length).to.be.equal(10)
            })

            it("Amount accept point", async function () {
                const sum = _.reduce(getPoints.data.response, (sum, elem) => {
                    return elem.moder_status == "accept" ? sum + 1 : sum
                }, 0)
                expect(sum).to.be.equal(2)
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

            it("Тест дубликатов", async function() {
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
                expect(point.isError).to.be.equal(true)
            })

            it("Принудительное добавление дубликата, проверка группы дубликата", async function() {
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
                delete(data.force)
                const pointDB = (await Shop.query().where(data).first())
                expect(pointDB.duplicateGroup).to.not.be.null
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


    after(async function () {
        await Shop.query().delete().whereIn("user_id", [user.id, moder.id])
        await User.query().deleteById(user.id)
        await User.query().deleteById(moder.id)
    })

})

// describe("HTTP assertions", function () {
//     it("should make HTTP assertions easy", function () {
//       var response = chakram.get("http://localhost:3000/api/user/getPoints")
//       expect(response).to.have.status(200)
//       expect(response).to.have.header("content-type", "application/json")
//       expect(response).not.to.be.encoded.with.gzip
//       expect(response).to.comprise.of.json({
//         args: { test: "chakram" }
//       })
//       return chakram.wait()
//     })
//   })