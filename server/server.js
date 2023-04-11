const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const cors = require('cors')
const pool = require("./db")
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../client/dist')))

app.get("/", (req,res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
})

app.get("/all", async (req,res) => {
    try {
        const allclicks = await pool.query("SELECT * FROM totalcount")
        res.status(200).json(allclicks.rows)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})
app.get("/allcities", async (req,res) => {
    try {
        const allcities = await pool.query("SELECT * FROM citycounts")
        res.status(200).json(allcities.rows)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.put("/all", async (req,res) => {
    try {
        const updated = await pool.query("UPDATE totalcount SET count = count+1 WHERE id = 1")
        res.status(200).json(updated)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.put("/single", async (req,res) => {
    try {
        const { city } = req.body
        
        const updated = await pool.query(`
            DO $$
            BEGIN 
            IF EXISTS (select city from citycounts where city = '${city}') THEN
                UPDATE citycounts SET count = count+1 WHERE city = '${city}';
            ELSE
                INSERT INTO citycounts (city,count) VALUES ('${city}',1);
            END IF;
            END $$;
        `)
            

        res.status(200).json(updated)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})


const PORT = process.env.PORT || 7342

app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`))