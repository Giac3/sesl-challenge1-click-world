const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "1T9mACVXDhPuFOce064v",
    host: "containers-us-west-160.railway.app",
    port: 5835,
    database: "railway"
})

module.exports = pool;