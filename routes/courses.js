import express from 'express'
import coursesController from '../controllers/courses.js'
const router = express.Router()

router.get('/', coursesController.getAllCourses)
router.get('/:id', coursesController.getOneCourse)
router.post('/post', coursesController.insertOneCourse)
router.put('/update/:id', coursesController.updateCourses)
router.delete('/delete/:id', coursesController.deleteOneCourse)

export default router