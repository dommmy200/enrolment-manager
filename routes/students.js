const express = require('express')
const router = express.Router()
const studentController = require('../controllers/students')

router.get('/', studentController.getAllEnrolledStudents)
router.get('/:id', studentController.getOneEnrolledStudent)
router.post('/post', studentController.insertOneEnrolledStudent)
router.put('/update/:id', studentController.updateStudentEnrollment)
router.delete('/delete/:id', studentController.deleteOneEnrolledStudent)

module.exports = router