import express from "express";
import {studentRules, validate}  from '../middleware/validate.js';
// import validate  from '../middleware/validate.js';
import {isAuthenticated}   from '../middleware/authenticate.js';
const router = express.Router()
import studentController from '../controllers/students.js'

router.get('/',
    studentController.getAllEnrolledStudents)


router.get('/:id',
    studentController.getOneEnrolledStudent)

router.post('/post',
    isAuthenticated,
    studentRules(),
    validate,
    studentController.insertAStudent)


router.put('/update/:id',
    isAuthenticated,
    studentRules(), 
    validate,
    studentController.updateStudentEnrollment)


router.delete('/delete/:id',
    isAuthenticated,
    studentRules(),
    validate,
    studentController.deleteOneEnrolledStudent)

export default router