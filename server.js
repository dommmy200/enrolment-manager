const express = require('express')
const router = require('./routes')
const dotenv = require('dotenv')
const mongodb = require('./data/database')
const cors = require('cors')

const port = process.env.PORT || 3000

const app = express()
dotenv.config()
app.use(express.json()); // Parse JSON bodies

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-Width", "Content-Type", "Z-Keys"]
}))
app.use('/', router)

mongodb.initDatabase((err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        app.listen(port, () =>  {
            console.log(`Database is connected. Server is live on Port: ${port}`)
        })
    }
})