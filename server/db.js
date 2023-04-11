const Pool = require('pg').Pool

const pool = new Pool({
    user: "YOUR USERNAME",
    password: "YOUR PASSWORD",
    host: "YOUR HOST",
    port: 0000,
    database: "YOUR DATABASE"
})

module.exports = pool;