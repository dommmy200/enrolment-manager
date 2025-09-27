const express = require('express');
const router = express.Router();
const instructorsController = require('../controllers/instructors');
const { authenticateJWT } = require('../middleware/authenticate');

/*
 * ====================================================================
 * ROUTES (All protected by authenticateJWT based on the original structure)
 * Note: Standard REST APIs often leave GET routes public. We've kept them protected 
 * here as per your original code, but added the JWT security documentation.
 * ====================================================================
 */

// GET all instructors (Protected)
/**
 * @swagger
 * /instructors:
 * get:
 * tags:
 * - Instructors
 * summary: Retrieve a list of all instructors (requires JWT).
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: A list of instructors.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Instructor'
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 404:
 * description: No instructors found.
 * 500:
 * description: Internal Server Error.
 */
router.get('/', authenticateJWT, instructorsController.getAllInstructors);

// GET a single instructor by ID (Protected)
/**
 * @swagger
 * /instructors/{id}:
 * get:
 * tags:
 * - Instructors
 * summary: Get an instructor by ID (requires JWT).
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The instructor's MongoDB ID.
 * responses:
 * 200:
 * description: A single instructor object.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Instructor'
 * 400:
 * description: Invalid ID format.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 404:
 * description: Instructor not found.
 * 500:
 * description: Internal Server Error.
 */
router.get('/:id', authenticateJWT, instructorsController.getOneInstructor);

// POST a new instructor (Protected)
/**
 * @swagger
 * /instructors:
 * post:
 * tags:
 * - Instructors
 * summary: Create a new instructor record (requires JWT and ownership).
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Instructor'
 * responses:
 * 201:
 * description: Instructor created successfully.
 * 400:
 * description: Validation error or missing required fields.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 500:
 * description: Internal Server Error.
 */
router.post('/', authenticateJWT, instructorsController.insertOneInstructor);

// PUT/UPDATE an existing instructor (Protected)
/**
 * @swagger
 * /instructors/{id}:
 * put:
 * tags:
 * - Instructors
 * summary: Update an instructor record by ID (requires JWT and ownership).
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The instructor's MongoDB ID.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Instructor'
 * responses:
 * 200:
 * description: Instructor updated successfully.
 * 400:
 * description: Invalid ID format or empty request body.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 403:
 * description: Forbidden (User does not own this record).
 * 404:
 * description: Instructor not found.
 * 500:
 * description: Internal Server Error.
 */
router.put('/:id', authenticateJWT, instructorsController.updateInstructors);

// DELETE an instructor (Protected)
/**
 * @swagger
 * /instructors/{id}:
 * delete:
 * tags:
 * - Instructors
 * summary: Delete an instructor record by ID (requires JWT and ownership).
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The instructor's MongoDB ID.
 * responses:
 * 200:
 * description: Instructor deleted successfully.
 * 400:
 * description: Invalid ID format.
 * 401:
 * description: Unauthorized (Missing or invalid JWT).
 * 403:
 * description: Forbidden (User does not own this record).
 * 404:
 * description: Instructor not found.
 * 500:
 * description: Internal Server Error.
 */
router.delete('/:id', authenticateJWT, instructorsController.deleteOneInstructor);

module.exports = router;
