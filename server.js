const express = require('express')
const router = require('./routes')
const dotenv = require('dotenv')
const mongodb = require('./data/database')
const cors = require('cors')

const port = process.env.PORT || 3000

const app = express()
dotenv.config()
app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data if using forms

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Header',
//         'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     next();
// });
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