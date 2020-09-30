const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

axiosCookieJarSupport(axios)

axios.defaults.baseURL = "http://127.0.0.1:3000"
axios.defaults.withCredentials = true
const cookieJar = new tough.CookieJar()
axios.defaults.jar = cookieJar



it("getPoints", async function () {
    await axios.post("/api/login", { login: "user@user.user", password: "useruser" })
    const getPoints = await axios.get("/api/user/getPoints")
    console.log(getPoints.data.response)
    return
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