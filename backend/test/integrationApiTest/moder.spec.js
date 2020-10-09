const { done } = require("redoc/typings/services/SearchWorker.worker")
const { addUser } = require("../../src/model/adminPanelApi/admin")
const Permission = require("../../src/model/orm/permission")
// const fp = require('lodash/fp')
// const chai = require('chai')
// const { nanoid } = require('nanoid')
// chai.use(require('chai-json-schema-ajv'))
// const expect = chai.expect

const Region = require("../../src/model/orm/region")
const Shop = require("../../src/model/orm/shop")
const User = require("../../src/model/orm/user")

// const axios = require('axios').default
// const axiosCookieJarSupport = require('axios-cookiejar-support').default
// const tough = require('tough-cookie')
// axiosCookieJarSupport(axios)

// const getPointModerJson = require("../../openApi/models/res/getPointsModer.json")
// const dublicateJson = require("../../openApi/models/res/duplicate.json")
// const { addUser } = require('../../src/model/adminPanelApi/admin')
// const Moder_status = require('../../src/model/orm/moder_status')
// const Region = require('../../src/model/orm/region')
// const Shop = require('../../src/model/orm/shop')
// const User = require('../../src/model/orm/user')
// const Permission = require("../../src/model/orm/permission")

// axios.defaults.baseURL = "http://127.0.0.1:3000"
// axios.defaults.withCredentials = true
// const cookieJar = new tough.CookieJar()
// axios.defaults.jar = cookieJar

// describe.only("Интерфейс модератора", () => {
//     let user, moder, insertPoints, userOther, moderOther, insertPointsOther
//     before(async function () {

//         user = (await addUser("moder@nanoid.nanoiduser", "testtest", await Permission.getIdByPermission("user"), (await Region.query().first()).id))[0]
//         moder = (await addUser("moder@nanoid.nanoidmoder", "testtest", await Permission.getIdByPermission("moder"), (await Region.query().first()).id))[0]
//         userOther = (await addUser("moder@nanoid.nanoiduserOther", "testtest", await Permission.getIdByPermission("user"), (await Region.query())[1].id))[0]
//         moderOther = (await addUser("moder@nanoid.nanoidmoderOther", "testtest", await Permission.getIdByPermission("moder"), (await Region.query())[1].id))[0]

//         insertPoints = fp.map((elem, key) => {
//             return {
//                 title: key,
//                 lng: key,
//                 lat: key,
//                 apartment: key,
//                 hours: key,
//                 phone: key,
//                 site: key,
//                 description: key,
//                 isActive: key,
//                 full_city_name: key
//             }
//         })(new Array(7))

//         const acceptStatusId = await Moder_status.getIdByModerStatus("accept")
//         const moderatedStatusId = await Moder_status.getIdByModerStatus("moderated")
//         const deleteStatusId = await Moder_status.getIdByModerStatus("delete")
//         const refuseStatusId = await Moder_status.getIdByModerStatus("refuse")
//         const takeStatusId = await Moder_status.getIdByModerStatus("take")
//         const returnStatusId = await Moder_status.getIdByModerStatus("return")

//         insertPoints[0].moder_status_id = acceptStatusId
//         insertPoints[0].user_id = user.id

//         insertPoints[1].moder_status_id = moderatedStatusId
//         insertPoints[1].user_id = user.id

//         insertPoints[2].moder_status_id = deleteStatusId
//         insertPoints[2].user_id = user.id

//         insertPoints[3].moder_status_id = refuseStatusId
//         insertPoints[3].user_id = user.id

//         insertPoints[4].moder_status_id = acceptStatusId
//         insertPoints[4].user_id = user.id

//         insertPoints[5].moder_status_id = acceptStatusId
//         insertPoints[5].user_id = moder.id

//         insertPoints[6].moder_status_id = acceptStatusId
//         insertPoints[6].user_id = moder.id

//         insertPointsOther = fp.cloneDeep(insertPoints)
//         insertPointsOther[0].user_id = userOther.id
//         insertPointsOther[1].user_id = userOther.id
//         insertPointsOther[2].user_id = userOther.id
//         insertPointsOther[3].user_id = userOther.id
//         insertPointsOther[4].user_id = userOther.id
//         insertPointsOther[5].user_id = moderOther.id
//         insertPointsOther[6].user_id = moderOther.id


//         for (let key = 0; key < insertPoints.length; key++) {
//             await Shop.query().insert(insertPoints[key])
//             await Shop.query().insert(insertPointsOther[key])
//             insertPoints[key].moder_status_id = moderatedStatusId
//             insertPointsOther[key].moder_status_id = moderatedStatusId
//         }

//         insertPoints[0].moder_status_id = returnStatusId
//         insertPoints[1].moder_status_id = moderatedStatusId
//         insertPoints[2].moder_status_id = deleteStatusId
//         insertPoints[3].moder_status_id = refuseStatusId
//         insertPoints[4].moder_status_id = takeStatusId
//         insertPoints[5].moder_status_id = moderatedStatusId
//         insertPoints[6].moder_status_id = deleteStatusId

//         for (let key = 0; key < insertPoints.length; key++) {
//             insertPointsOther[key].moder_status_id = insertPoints[key].moder_status_id
//             const point = await Shop.query().insert(insertPoints[key])
//             const pointOther = await Shop.query().insert(insertPointsOther[key])

//             insertPoints[key].moder_status_id = acceptStatusId
//             insertPointsOther[key].moder_status_id = acceptStatusId

//             insertPoints[key].parent_id = point.id
//             insertPointsOther[key].parent_id = pointOther.id

//             await Shop.query().insert(insertPoints[key])
//             await Shop.query().insert(insertPointsOther[key])
//         }
//     })

//     describe("getPointsModer", function () {
//         let getPoints

//         let sumStatus = fp.curry((status, sum, elem) => {
//             return elem.moder_status == status ? sum + 1 : sum
//         })

//         let reduce1 = fp.curryRight(fp.reduce)(0)

//         fp.flow(
//             fp.reduce,
//         )
//         reduce1(sumStatus())()

//         const sumPoint = fp.reduce((sum, elem) => {
//             return elem.moder_status == "accept" ? sum + 1 : sum
//         }, 0)

//         before(async function () {
//             await axios.post("/api/login", { login: "moder@nanoid.nanoidmoder", password: "testtest" })
//             getPoints = await axios.get("/api/moder/getPoints")
//         })

//         it("Json matching", async function () {
//             expect(getPoints.data.response).to.be.jsonSchema(getPointModerJson)
//         })

//         it("Amount point", async function () {
//             expect(getPoints.data.response.length).to.be.equal(8)
//         })

//         it("Amount accept point", async function () {
//             expect(sumPoint(getPoints.data.response)).to.be.equal(1)
//         })

//         it("Amount refuse point", async function () {
//             const sum = _.reduce(getPoints.data.response, (sum, elem) => {
//                 return elem.moder_status == "accept" ? sum + 1 : sum
//             }, 0)
//             expect(sum).to.be.equal(1)
//         })
//     })

//     after(async function () {
//         await Shop.query().delete().whereIn("user_id", [user.id, moder.id, moderOther.id, userOther.id])
//         await User.query().deleteById(user.id)
//         await User.query().deleteById(moder.id)
//         await User.query().deleteById(userOther.id)
//         await User.query().deleteById(moderOther.id)
//     })
// })

fp = require("lodash/fp")

let rawData = ["iNoTJW1M","a.afanasieva@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","Na0y04T","a.aleksandr@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","7pkMLFI","a.elvira@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","BcapJReQ","a.ershov@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","46XhHwv0","a.nadejda@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","DNI4yGC5","a.olga@karmy.su","moder","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","VVacDVSO","b.larisa@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","NKTtX8cN","b.nikolaj@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","w6c5YEzM","c.elizaveta@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","BIOeOZjG","c.evgenii@karmy.su","moder","Республика Крым, Волгоградская обл, Астраханская обл","sN3V98WG","ch.anatoliy@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","aKhUMEV5","d-ekaterina@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","tF655TQ","d.larisa@karmy.su","user","г. Москва и Московская обл","hDtCyO3E","e.ekaterina@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","5tCMIZQz","f-dmitriy@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","8jBDAu9F","f.alina@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","8aKTAqcb","f.kristina@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","cnT77BF","g.aleksey@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","RZMGTx2D","g.anastasiya@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","LpQ2hsQp","g.andrey@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","geTOp6Lr","g.igor@karmy.su ","moder","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","GaPmWuej","g.irina@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","lQJsca2","g.konstantin@karmy.su","moder","г. Москва и Московская обл","bIgEvE6V","g.leila@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","P6gLR4Uq","g.marina@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","Q0EVTNzt","g.polina@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","sCoN0XkM","g.sergey@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","Qni7F8lP","gu.yuliya@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","LE1454wP","gu.yuliya@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","ckKc6JpM","h.sofiya@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","U6ZpMdET","i.igor@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","JzbgaaIs","k-konstantin@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","MJMM5x6O","k.anastasiya@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","Piru4iNj","k.denis@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","kz5QDvo1","k.ekaterina@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","OwTF7uec","k.mariya@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","wrvUdxrA","k.vasiliy@karmy.su","user","г. Москва и Московская обл","bFW2bGmp","k.zarif@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","9Wg7rSh4","kn.vasiliy@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","fR0kqksl","ko.natalia@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","YviguEtv","ku.anna@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","OuFw64n","l.andrey@karmy.su","user","г. Москва и Московская обл","MOOxMdBZ","l.evgeniy@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","0qZoyUSL","l.kseniya@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","0b6S8gdw","l.marina@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","0aweo8fu","l.nikita@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","VdUHjaD","l.oksana@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","cOdVNr8a","l.vyacheslav@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","PSYDgL9f","l.yana@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","9pGBZZcl","m.aleksey@karmy.su","user","г. Москва и Московская обл","rK7C1Gs8","m.ekaterina@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","kEVFfYKR","m.gulnara@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","FnRFNpsU","m.igor@karmy.su","moder","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","qhpL8Ev","m.iliya@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","J1WGa0RE","m.veshnyakov@karmy.su","moder","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","7xIuNZG3","m.yuliya@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","QFNaJ9h","mo.aleksandr@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","5Aq40V2N","n.andreeva@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","6Bn6FvXi","n.kapustin@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","taiXC0i","n.natalia@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","TlGuJdMT","n.yuliya@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","pMbEvOmJ","p.anzhela@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","G6PwosJ","p.artem@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","8kkXe79a","p.elena@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","fAY4sDQ5","p.evgeniya@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","e5J4jBn","p.irina@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","AoyLslTX","p.olesya@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","T4mf18fo","p.polina@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","tOpEYZQl","p.vitaliy@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","hYOmeTwe","p.yaroslav@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","Xh2jaf7g","pi.anastasiya@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","FbrBlJGJ","r.eduard@karmy.su","moder","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","25DGGXi","s.anna@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","VXX5v322","s.anton@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","2u130K1M","s.artem@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","x44ESZJK","s.dmitriy@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","tbajPjbe","s.elena@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","Zv1x2b6X","s.galina@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","col3LuSu","s.ignatov@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","oNupZFYx","s.natalia@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","g9BSHTG0","s.svetlana@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","YSTDUFyE","s.vyacheslav@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","wJmBNwTj","sh.ekaterina@karmy.su","user","Нижегородская обл, Чувашия,Марий ЭЛ, Кировская обл, Пермский край, Удмуртия","equgE4","sh.evgeniya@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","bNFVc3Vl","sh.galina@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","8AWjixw","sh.kseniya@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","BvWU9O1","sha.ekaterina@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","BrYOqJBw","sig.roman@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","9zud68YD","sk.roman@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","5zv3knyT","t-zaur@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","EnIdfAc3","t.alena@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","XcZmZAJN","t.amir@karmy.su","user","Саратовская обл, Пензенская обл, Мордовия, Самарская обл, Тольятти, Татарстан, Башкирия, Оренбургская обл, Ульяновская обл","De3pMzzc","t.dmitriy@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","pDZFyD6O","t.elena@karmy.su","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","gEzK5NjR","t.marina@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","JDRFhm5e","t.mikhail@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","sndXv9bj","to.elena@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","Z7Ffgr9F","tp-stavropol@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","u16VfgdG","u.nikolay@karmy.su","user","Республика Крым, Волгоградская обл, Астраханская обл","3OMVEFZ0","v.anna@karmy.su","user","Ярославская и Костромская  обл, Вологодская обл, Ивановская обл, Владимирская обл, Тверская обл, Смоленская обл","eyUZCWdO","v.mihail@karmy.su","user","г. Москва и Московская обл","I6zPNo1q","v.nadezda@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","b59QtSTV","v.roman@karmy.su","user","г. Москва и Московская обл","tcUo9Jc","we_st@mail.ru","user","Республика Крым, Волгоградская обл, Астраханская обл","G59qPNaY","ya.elena@karmy.su","user","Архангельская обл, Новгородская обл (Великий Новгород), Псковская обл, Мурманская обл, Республика Карелия, Республика Коми, Ленинградская обл","WWh35s0D","z.aleksandr@karmy.su","user","г. Москва и Московская обл","6u83LeR1","z.elvira@karmy.su ","user","Воронежская обл, Тамбовская обл, Липецк, Тамбовская обл, Липецкая обл, Белгородская обл, Курская обл, Курская обл, Белгородская обл., Орловская обл, Брянская обл, Калужская обл, Тульская обл, Рязанская обл","JYyi0T1s","z.kseniya@karmy.su","moder","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","IGI4fksp","z.oksana@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл","6BSvDmon","zh.viacheslav@karmy.su","user","Свердловская обл, Челябинская обл, ХМАО и ЯНАО, Тюменская обл и Курганская обл"]

describe.only("sdsd", () => {
    it("sdsdsd", async (done) => {
        const userList = fp.chunk(4)(rawData)
        let regions=[]
        let regionId
        console.log(userList.length)
        for (let key=0; key<userList.length; key++) {
            if (!regions.includes(userList[key][3])) {
                regionId = await Region.query().insert({region: userList[key][3]})
                regions.push(userList[key][3])
            }
            await addUser((userList[key][1]).trim(),"pass"+(userList[key][0]).trim(),await Permission.getIdByPermission(userList[key][2]),(await Region.query().first().where("region",userList[key][3])).id).catch(() => console.log(userList[key]))
        }
        // for (let key=0; key<userList.length; key++) {
        //     console.log("pass"+(userList[key][0]).trim())
        // }
        // console.log((await User.query().where("email", "like", "%karmy.su")).length)
        done()
    })
})