import express from 'express'

import {instructorRules, validate} from '../middleware/validate.js';
import {isAuthenticated} from '../middleware/authenticate.js';
import instructorController from '../controllers/instructors.js'
const router = express.Router()

router.get('/',
    instructorController.getAllInstructors)

router.get('/:id',
    instructorController.getOneInstructor)

router.post('/post',
    isAuthenticated,
    instructorRules(), 
    validate,
    instructorController.insertOneInstructor)

router.put('/update/:id',
    isAuthenticated,
    instructorRules(), 
    validate,
    instructorController.updateInstructors)

router.delete('/delete/:id',
    isAuthenticated,
    instructorRules(), 
    validate,
    instructorController.deleteOneInstructor)

export default router

