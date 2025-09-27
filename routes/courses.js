const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses');
const { authenticateJWT } = require('../middleware/authenticate');

// GET all courses
router.get('/', authenticateJWT, (req, res, next) => {
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Retrieve all courses'
  coursesController.getAllCourses(req, res, next);
});

// GET one course
router.get('/:id', authenticateJWT, (req, res, next) => {
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Get a course by ID'
  // #swagger.parameters['id'] = { description: "Course ID" }
  coursesController.getOneCourse(req, res, next);
});

// CREATE course
router.post('/post', authenticateJWT, (req, res, next) => {
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Create a new course'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": { schema: { $ref: "#/components/schemas/Course" } }
  //   }
  // }
  // #swagger.responses[201] = {
  //   description: "Course created",
  //   schema: { $ref: "#/components/schemas/Course" }
  // }
  coursesController.insertOneCourse(req, res, next);
});

// UPDATE course
router.put('/update/:id', authenticateJWT, (req, res, next) => {
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Update a course by ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: "Course ID" }
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": { schema: { $ref: "#/components/schemas/Course" } }
  //   }
  // }
  coursesController.updateCourses(req, res, next);
});

// DELETE course
router.delete('/delete/:id', authenticateJWT, (req, res, next) => {
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Delete a course by ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { description: "Course ID" }
  coursesController.deleteOneCourse(req, res, next);
});

module.exports = router;
