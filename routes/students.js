import express from "express";
import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
const router = express.Router()
import studentController from '../controllers/students.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: OduduaZXY
 *         last_name:
 *           type: string
 *           example: YorubaXYZ
 *         email:
 *           type: string
 *           format: email
 *           example: abrahimttt.mukaila@example.com
 *         phone_number:
 *           type: string
 *           example: +234809870987
 *         course:
 *           type: string
 *           example: Medic
 *         enrollment_date:
 *           type: string
 *           format: date
 *           example: 2020-11-20
 *         status:
 *           type: string
 *           example: Graduated
 *         gpa:
 *           type: number
 *           format: float
 *           example: 4.0
 */

/**
 * @swagger
 * /students/:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *
 * /students/{id}:
 *   get:
 *     summary: Get a single student by ID
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A student record
 *       404:
 *         description: Student not found
 *
 * /students/post:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created
 *
 * /students/update/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated
 *       404:
 *         description: Student not found
 *
 * /students/delete/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 *       404:
 *         description: Student not found
 */


router.get('/',
    studentController.getAllEnrolledStudents)


router.get('/:id',
    studentController.getOneEnrolledStudent)

router.post('/post',
    ensureAuthenticated,
    ensureScope(["write:students"]),
    studentController.insertOneEnrolledStudent)


router.put('/update/:id',
    ensureAuthenticated,
    ensureScope(["write:students"]),
    studentController.updateStudentEnrollment)


router.delete('/delete/:id',
    ensureAuthenticated,
    ensureScope(["delete:students"]),
    studentController.deleteOneEnrolledStudent)

export default router