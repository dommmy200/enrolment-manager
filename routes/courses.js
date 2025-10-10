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

router.post('/',
    isAuthenticated,
    courseRules(), 
    validate,
    coursesController.insertOneCourse)

router.put('/:id',
    isAuthenticated,
    courseRules(), 
    validate,
    coursesController.updateCourses)

router.delete('/:id',
    isAuthenticated,
    coursesController.deleteOneCourse)

export default router