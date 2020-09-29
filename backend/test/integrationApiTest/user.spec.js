var chakram = require('chakram')

describe("userApi", async function  () {
    
    await chakram.post("http://localhost:3000/api/login", {
        login:"user@user.user",
        password:"useruser"
    })

    it("getPoints", async function () {
       
        const a =  await chakram.get("http://localhost:3000/api/user/getPoints")
        console.log(a.body)
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