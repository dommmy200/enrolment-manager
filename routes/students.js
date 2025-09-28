import express from "express";
import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
const router = express.Router()
import studentController from '../controllers/students.js'

// GET /students/
// #swagger.tags = ['Students']
router.get('/',
    studentController.getAllEnrolledStudents)

// GET /students/
// #swagger.tags = ['Students']
router.get('/:id',
    studentController.getOneEnrolledStudent)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{ "BearerAuth": [] }]
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Student data to create',
//   required: true,
//   schema: {
//     first_name: "OduduaZXY",
//     last_name: "YorubaXYZ",
//     email: "abrahimttt.mukaila@example.com",
//     phone_number: "+234809870987",
//     course: "Medic",
//     enrollment_date: "2020-11-20",
//     status: "Enrolled",
//     gpa: 3.5
//   }
// }
router.post('/post',
    ensureAuthenticated,
    ensureScope(["write: students"]),
    studentController.insertOneEnrolledStudent)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{ "BearerAuth": [] }]
router.put('/update/:id',
    ensureAuthenticated,
    ensureScope(["write: students"]),
    studentController.updateStudentEnrollment)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{ "BearerAuth": [] }]
router.delete('/delete/:id',
    ensureAuthenticated,
    ensureScope(["write: students"]),
    studentController.deleteOneEnrolledStudent)

export default router