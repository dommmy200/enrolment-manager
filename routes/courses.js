import express from 'express'
// import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
import coursesController from '../controllers/courses.js'
import {courseRules, validate}  from '../middleware/validate.js';
import {isAuthenticated} from '../middleware/authenticate.js';
const router = express.Router()

router.get('/', 
    coursesController.getAllCourses)

router.get('/:id',
    coursesController.getOneCourse)

router.post('/post',
    isAuthenticated,
    courseRules(), 
    validate,
    coursesController.insertOneCourse)

router.put('/update/:id',
    isAuthenticated,
    courseRules(), 
    validate,
    coursesController.updateCourses)

router.delete('/delete/:id',
    isAuthenticated,
    courseRules(), 
    validate,
    coursesController.deleteOneCourse)

export default router