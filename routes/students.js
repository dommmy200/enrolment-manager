const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students');
const { authenticateJWT } = require('../middleware/authenticate');

/**
 * GET /students
 */
router.get('/',
  authenticateJWT,
  // #swagger.tags = ['Students']
  // #swagger.description = 'Retrieve all students'
  studentsController.getAllEnrolledStudents
);

/**
 * GET /students/{id}
 */
router.get('/:id',
  authenticateJWT,
  // #swagger.tags = ['Students']
  // #swagger.description = 'Get a student by ID'
  // #swagger.parameters['id'] = { description: "Student ID" }
  studentsController.getOneEnrolledStudent
);

/**
 * POST /students
 */
router.post('/post', 
  authenticateJWT, 
  // #swagger.tags = ['Students']
  // #swagger.description = 'Enroll a new student'
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Student" }
  //     }
  //   }
  // }
  // #swagger.responses[201] = { description: "Student enrolled", schema: { $ref: "#/components/schemas/Student" } }
  studentsController.insertOneEnrolledStudent
);

/**
 * PUT /students/{id}
 */
router.put('/update/:id',
  authenticateJWT, 
  // #swagger.tags = ['Students']
  // #swagger.description = 'Update a student by ID'
  // #swagger.parameters['id'] = { description: "Student ID" }
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Student" }
  //     }
  //   }
  // }
  // #swagger.responses[200] = { description: "Student updated", schema: { $ref: "#/components/schemas/Student" } }
  studentsController.updateStudentEnrollment
);

/**
 * DELETE /students/{id}
 */
router.delete('/delete/:id', 
  authenticateJWT, 
  // #swagger.tags = ['Students']
  // #swagger.description = 'Delete a student by ID'
  // #swagger.parameters['id'] = { description: "Student ID" }
  // #swagger.security = [{"cookieAuth": []}]
  studentsController.deleteOneEnrolledStudent
);

module.exports = router;
