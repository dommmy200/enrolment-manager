const express = require('express')
const studentsRoute = require('./students')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send('Hello World!')
})

router.use('/students', studentsRoute)

module.exports = router