const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students');
const { authenticateJWT } = require('../middleware/authenticate');

/*
 * ====================================================================
 * PUBLIC ROUTES (GET)
 * Students can be read by anyone (or the caller of the API, regardless of JWT status)
 * ====================================================================
 */

// GET all enrolled students
/**
 * @swagger
 * /students:
 * get:
 * tags:
 * - Students
 * summary: Retrieve a list of all enrolled students.
 * responses:
 * 200:
 * description: A list of students.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Student'
 * 404:
 * description: No students found.
 * 500:
 * description: Internal Server Error.
 */
router.get('/', studentsController.getAllEnrolledStudents);

// GET a single student by ID
/**
 * @swagger
 * /students/{id}:
 * get:
 * tags:
 * - Students
 * summary: Retrieve a single student by their ID.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The student's MongoDB ID.
 * responses:
 * 200:
 * description: A single student object.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Student'
 * 400:
 * description: Invalid ID format.
 * 404:
 * description: Student not found.
 * 500:
 * description: Internal Server Error.
 */
router.get('/:id', studentsController.getOneEnrolledStudent);


/*
 * ====================================================================
 * PROTECTED ROUTES (POST, PUT, DELETE)
 * These require a valid JWT via the authenticateJWT middleware
 * ====================================================================
 */

// POST a new student enrollment (Protected)
/**
 * @swagger
 * /students:
 * post:
 * tags:
 * - Students
 * summary: Enroll a new student (requires JWT).
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Student'
 * responses:
 * 201:
 * description: Student enrolled successfully.
 * 400:
 * description: Validation error or missing required fields.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 500:
 * description: Internal Server Error.
 */
router.post('/', authenticateJWT, studentsController.insertOneEnrolledStudent);

// PUT/UPDATE an existing student enrollment (Protected)
/**
 * @swagger
 * /students/{id}:
 * put:
 * tags:
 * - Students
 * summary: Update an existing student record (requires JWT and ownership).
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The student's MongoDB ID.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Student'
 * responses:
 * 200:
 * description: Student updated successfully.
 * 400:
 * description: Invalid ID format or empty request body.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 403:
 * description: Forbidden (User does not own this record).
 * 404:
 * description: Student not found.
 * 500:
 * description: Internal Server Error.
 */
router.put('/:id', authenticateJWT, studentsController.updateStudentEnrollment);

// DELETE a student enrollment (Protected)
/**
 * @swagger
 * /students/{id}:
 * delete:
 * tags:
 * - Students
 * summary: Delete a student record (requires JWT and ownership).
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The student's MongoDB ID.
 * responses:
 * 200:
 * description: Student deleted successfully.
 * 400:
 * description: Invalid ID format.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 403:
 * description: Forbidden (User does not own this record).
 * 404:
 * description: Student not found.
 * 500:
 * description: Internal Server Error.
 */
router.delete('/:id', authenticateJWT, studentsController.deleteOneEnrolledStudent);

module.exports = router;
