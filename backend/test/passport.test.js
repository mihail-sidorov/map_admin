'use strict'
const { checkAuth, passportModule } = require("../src/middlewares/passport")

test("Функция проверки авторизации checkAuth", () => {
    const callback = jest.fn()

    const req = {
        user: {
            permission: [
                { permission: "testPermission" }
            ]
        }
    }

    checkAuth("all")({}, undefined, callback)
    expect(callback.mock.calls[0][0]).toBe("Unauthorized")

    checkAuth("notTestPermission")(req, undefined, callback)
    expect(callback.mock.calls[1][0]).toBe("No permission")

    checkAuth("all")(req, undefined, callback)
    expect(callback.mock.calls[2][0]).toBeUndefined()

    checkAuth("testPermission")(req, undefined, callback)
    expect(callback.mock.calls[3][0]).toBeUndefined()

    checkAuth(["testPermission"])(req, undefined, callback)
    expect(callback.mock.calls[4][0]).toBeUndefined()

    checkAuth(["testPermission","test"])(req, undefined, callback)
    expect(callback.mock.calls[5][0]).toBeUndefined()
})