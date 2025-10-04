import express from 'express'
import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
import coursesController from '../controllers/courses.js'
const router = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Mathematics
 *         description:
 *           type: string
 *           example: Intro to Mathematics
 *         credits:
 *           type: integer
 *           example: 3
 *         department:
 *           type: string
 *           example: Computer Science
 *         instructor_id:
 *           type: string
 *           example: 68d87eb28b3ef5ea611c00bc
 *         semester:
 *           type: string
 *           example: Fall 2025
 *         status:
 *           type: string
 *           example: Active
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T10:15:00.000+00:00
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T10:15:00.000+00:00
 *         prerequisite:
 *           type: array
 *           items:
 *             type: string
 *           example: ["math001", "chem010"]
 */


/**
 * @swagger
 * /courses/:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
*
* /courses/{id}:
*   get:
*     summary: Get a single course by ID
*     tags: [Course]
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
*         description: A course record
*       404:
*         description: course not found
*
* /courses/post:
*   post:
*     summary: Create a new course
*     tags: [Course]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Course'
*     responses:
*       201:
*         description: Course created
*
* /courses/update/{id}:
*   put:
*     summary: Update an existing course
*     tags: [Course]
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
*             $ref: '#/components/schemas/Course'
*     responses:
*       200:
*         description: Course updated
*       404:
*         description: Course not found
*
* /courses/delete/{id}:
*   delete:
*     summary: Delete a course
*     tags: [Course]
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
*         description: Course deleted
*       404:
*         description: Course not found
*/
router.get('/', 
    coursesController.getAllCourses)

router.get('/:id',
    coursesController.getOneCourse)

router.post('/post',
    ensureAuthenticated, 
    ensureScope(["write:courses"]),
    coursesController.insertOneCourse)

router.put('/update/:id',
    ensureAuthenticated, 
    ensureScope(["write:courses"]),
    coursesController.updateCourses)

router.delete('/delete/:id',
    ensureAuthenticated, 
    ensureScope(["write:courses", "delete:courses"]),
    coursesController.deleteOneCourse)

export default router