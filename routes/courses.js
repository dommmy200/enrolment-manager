const express = require('express')
const router = express.Router()
const coursesController = require('../controllers/courses')

router.get('/', coursesController.getAllCourses)
router.get('/:id', coursesController.getOneCourse)
router.post('/post', coursesController.insertOneCourse)
router.put('/update/:id', coursesController.updateCourses)
router.delete('/delete/:id', coursesController.deleteOneCourse)

module.exports = router