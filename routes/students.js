import express from "express";
import studentController from '../controllers/students.js'
import {studentRules, validate}  from '../middleware/validate.js';
import {isAuthenticated}   from '../middleware/authenticate.js';
const router = express.Router()

router.get('/',
    studentController.getAllEnrolledStudents)


router.get('/:id',
    studentController.getOneEnrolledStudent)

router.post('/',
    isAuthenticated,
    studentRules(),
    validate,
    studentController.insertAStudent)


router.put('/:id',
    isAuthenticated,
    studentRules(), 
    validate,
    studentController.updateStudentEnrollment)


router.delete('/:id',
    isAuthenticated,
    studentController.deleteOneEnrolledStudent)

export default router