const express = require('express')
const studentsRoute = require('./students')
const coursesRoute = require('./students')
const instructorRoute = require('./students')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.send('Hello World!')
})
router.use('/', require('./swagger'))
router.use('/students', studentsRoute)
router.use('/courses', coursesRoute)
router.use('/instructors', instructorRoute)

module.exports = router