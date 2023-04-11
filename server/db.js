const Pool = require('pg').Pool

const pool = new Pool({
    user: "USER",
    password: "PASSWORD",
    host: "HOST",
    port: 0000,
    database: "DATABASE"
})

module.exports = pool;