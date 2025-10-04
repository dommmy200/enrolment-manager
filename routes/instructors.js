import express from 'express'
import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
import instructorController from '../controllers/instructors.js'
const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Instructor:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: Adewale
 *         last_name:
 *           type: string
 *           example: Ogunleye
 *         email:
 *           type: string
 *           format: email
 *           example: adewale.ogunleye@example.com
 *         phone_number:
 *           type: string
 *           example: +234809870987
 *         course:
 *           type: string
 *           example: Medic
 *         department:
 *           type: string
 *           example: Computer Science
 *         hire_date:
 *           type: string
 *           example: 20/01/2024
 *         status:
 *           type: string
 *           example: Active
 */

/**
 * @swagger
 * /instructors/:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructors
 *
 * /instructors/{id}:
 *   get:
 *     summary: Get a single instructor by ID
 *     tags: [Instructors]
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
 *         description: A instructor record
 *       404:
 *         description: Instructor not found
 *
 * /instructors/post:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       201:
 *         description: Instructor created
 *
 * /instructors/update/{id}:
 *   put:
 *     summary: Update an existing instructor
 *     tags: [Instructors]
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
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Instructor updated
 *       404:
 *         description: Instructor not found
 *
 * /instructors/delete/{id}:
 *   delete:
 *     summary: Delete a instructor
 *     tags: [Instructors]
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
 *         description: Instructor deleted
 *       404:
 *         description: Instructor not found
 */

router.get('/',
    instructorController.getAllInstructors)

router.get('/:id',
    instructorController.getOneInstructor)

router.post('/post',
    ensureAuthenticated,
    ensureScope(["write:instructors"]),
     instructorController.insertOneInstructor)

router.put('/update/:id',
    ensureAuthenticated,
    ensureScope(["write:instructors"]),
     instructorController.updateInstructors)

router.delete('/delete/:id',
    ensureAuthenticated,
    ensureScope(["delete:instructors"]),
     instructorController.deleteOneInstructor)

export default router

