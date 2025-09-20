const express = require('express')
const router = express.Router()

router.get('/', studentController.getAllEnrolledStudents)
router.get('/:id', studentController.getOneEnrolledStudent)
router.post('/posts', studentController.insertOneEnrolledStudent)

module.exports = router