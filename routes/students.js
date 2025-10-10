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
    /*
        #swagger.tags = ['Students']
        #swagger.description = 'Add a new student to the catalog'
        #swagger.parameters['body'] = {
          in: 'body',
          description: 'Student data to add',
          required: true,
          schema: {
            example: {
              first_name: "Aisha",
              last_name: "Garba",
              email: "aisha.garba@example.com",
              phone_number: "+2348034567890",
              course: "Economics",
              enrollment_date: "2025-02-28",
              status: "Active",
              gpa: 3.55
            }
          }
        }
        #swagger.responses[201] = {
          description: 'Student created successfully'
        }
      */
    isAuthenticated,
    studentRules(),
    validate,
    studentController.insertAStudent)


router.put('/:id',
    /*
    #swagger.tags = ['Students']
    #swagger.description = 'Update an existing student'
    #swagger.parameters['id'] = { in: 'path', description: 'Student ID', required: true }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated student data',
      required: true,
      schema: {
        example: {
          first_name: "Aisha",
          last_name: "Garba",
          email: "aisha.garba@example.com",
          phone_number: "+2348034567890",
          course: "Economics",
          enrollment_date: "2025-02-28",
          status: "Active",
          gpa: 3.75
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Student updated successfully'
    }
  */
    isAuthenticated,
    studentRules(), 
    validate,
    studentController.updateStudentEnrollment)


router.delete('/:id',
    isAuthenticated,
    studentController.deleteOneEnrolledStudent)

export default router