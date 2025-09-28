import 'dotenv/config'

import express from 'express'
import router from './routes/index.js'
import mongodb from './data/database.js'

import session from 'express-session'
import passport from './config/auth.js'
import cors from 'cors'

const port = process.env.PORT || 3000

const app = express()
app.use(express.json()); // Parse JSON bodies

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-Width", "Content-Type", "Z-Keys"]
}))
// Session middleware (required by passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)

mongodb.initDatabase((err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        app.listen(port, () =>  {
            console.log(`Database is connected. Server is live on Port: ${port}`)
             console.log(`API Documentation available at: http://localhost:${port}/api-docs\n`)
        })
    }
})