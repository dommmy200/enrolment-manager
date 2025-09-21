const express = require('express')
const router = express.Router()
const coursesController = require('../controllers/courses')

router.get('/', coursesController.getAllEnrolledCourses)
router.get('/:id', coursesController.getOneEnrolledCourses)
router.post('/post', coursesController.insertOneEnrolledCourses)
router.put('/update/:id', coursesController.updateCoursesEnrollment)
router.delete('/delete/:id', coursesController.deleteOneEnrolledCourses)

module.exports = router