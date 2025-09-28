import express from "express";
import ensureAuthenticated from "../middleware/ensureAuth.js";
const router = express.Router()
import studentController from '../controllers/students.js'

// GET /students/
// #swagger.tags = ['Students']
// #swagger.security = [{"OAuth2": ["read:students"]}]
router.get('/', ensureAuthenticated, studentController.getAllEnrolledStudents)

// GET /students/
// #swagger.tags = ['Students']
// #swagger.security = [{"OAuth2": ["read:students"]}]
router.get('/:id', ensureAuthenticated, studentController.getOneEnrolledStudent)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{"OAuth2": ["write:students"]}]
router.post('/post', ensureAuthenticated, studentController.insertOneEnrolledStudent)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{"OAuth2": ["write:students"]}]
router.put('/update/:id', ensureAuthenticated, studentController.updateStudentEnrollment)

// PUT /students/update/:id
// #swagger.tags = ['Students']
// #swagger.security = [{"OAuth2": ["write:students"]}]
router.delete('/delete/:id', ensureAuthenticated, studentController.deleteOneEnrolledStudent)

export default router