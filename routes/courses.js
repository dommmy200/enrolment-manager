const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses');
const { authenticateJWT } = require('../middleware/authenticate');

/**
 * GET /courses
 */
router.get('/', 
  authenticateJWT,
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Retrieve all courses'
  coursesController.getAllCourses
);

/**
 * GET /courses/{id}
 */
router.get('/:id',
  authenticateJWT,
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Get a course by ID'
  // #swagger.parameters['id'] = { description: "Course ID" }
  coursesController.getOneCourse
);

/**
 * POST /courses
 */
router.post('/post',
   authenticateJWT, 
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Create a new course'
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Course" }
  //     }
  //   }
  // }
  // #swagger.responses[201] = { description: "Course created", schema: { $ref: "#/components/schemas/Course" } }
  coursesController.insertOneCourse
);

/**
 * PUT /courses/{id}
 */
router.put('/update/:id', 
  authenticateJWT, 
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Update a course by ID'
  // #swagger.parameters['id'] = { description: "Course ID" }
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Course" }
  //     }
  //   }
  // }
  // #swagger.responses[200] = { description: "Course updated", schema: { $ref: "#/components/schemas/Course" } }
  coursesController.updateCourses
);

/**
 * DELETE /courses/{id}
 */
router.delete('/delete/:id', 
  authenticateJWT, 
  // #swagger.tags = ['Courses']
  // #swagger.description = 'Delete a course by ID'
  // #swagger.parameters['id'] = { description: "Course ID" }
  // #swagger.security = [{"cookieAuth": []}]
  coursesController.deleteOneCourse
);

module.exports = router;
