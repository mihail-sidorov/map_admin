module.exports = {
    server: {
        host: "localhost",
        port: "3000"
    },

    db: {
        client: "mysql2",
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "admin",
            database: "test"
        }
    },

    cors: {

    },

    session: {
        maxAge: 15, //minute
        secret: "$2a$12$sWSdI13BJ5ipPca/f8KTF.k4eFKsUtobfWdTBoQdj9g9I8JfLmZty"
    }
}