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
        let email = "nanoid@nanoid." + nanoid()
        user = (await addUser("nanoid@nanoid.nanoiduser", "testtest", await Permission.getIdByPermission("user"), (await Region.query().first()).id))[0]
        moder = (await addUser("nanoid@nanoid.nanoidadmin", "testtest", await Permission.getIdByPermission("moder"), (await Region.query().first()).id))[0]
        console.log(user,moder)
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

        await Shop.query().insert(insertPoints)

        insertPoints[0].moder_status_id = moderatedStatusId
        insertPoints[4].moder_status_id = moderatedStatusId

        const copy = await Shop.query().insert(insertPoints)

        _.map(copy, (elem, key) => {
            insertPoints[moder_status_id] = acceptStatusId
            insertPoints[key].parent_id = elem.id
        })

        await Shop.query().insert(insertPoints)

        await axios.post("/api/login", { login: email, password: "testtest" })
    })

    describe("getPoints", function () {

        before(async () => {
            getPoints = await axios.get("/api/user/getPoints")
        })

        it("Json matching", async function () {
            expect(getPoints.data.response).to.be.jsonSchema(getPointJson)
        })

        it("Json matching", async function () {
            expect(getPoints.data.response).to.be.jsonSchema(getPointJson)
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