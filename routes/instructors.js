const express = require('express');
const router = express.Router();
const instructorsController = require('../controllers/instructors');
const { authenticateJWT } = require('../middleware/authenticate');

/**
 * GET /instructors
 */
router.get('/',
  authenticateJWT,
  // #swagger.tags = ['Instructors']
  // #swagger.description = 'Retrieve all instructors'
  instructorsController.getAllInstructors
);

/**
 * GET /instructors/{id}
 */
router.get('/:id', 
  authenticateJWT,
  // #swagger.tags = ['Instructors']
  // #swagger.description = 'Get an instructor by ID'
  // #swagger.parameters['id'] = { description: "Instructor ID" }
  instructorsController.getOneInstructor
);

/**
 * POST /instructors
 */
router.post('/post', 
  authenticateJWT, 
  // #swagger.tags = ['Instructors']
  // #swagger.description = 'Create a new instructor'
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Instructor" }
  //     }
  //   }
  // }
  // #swagger.responses[201] = { description: "Instructor created", schema: { $ref: "#/components/schemas/Instructor" } }
  instructorsController.insertOneInstructor
);

/**
 * PUT /instructors/{id}
 */
router.put('/update/:id',
  authenticateJWT, 
  // #swagger.tags = ['Instructors']
  // #swagger.description = 'Update an instructor by ID'
  // #swagger.parameters['id'] = { description: "Instructor ID" }
  // #swagger.security = [{"cookieAuth": []}]
  // #swagger.requestBody = {
  //   required: true,
  //   content: {
  //     "application/json": {
  //       schema: { $ref: "#/components/schemas/Instructor" }
  //     }
  //   }
  // }
  // #swagger.responses[200] = { description: "Instructor updated", schema: { $ref: "#/components/schemas/Instructor" } }
  instructorsController.updateInstructors
);

/**
 * DELETE /instructors/{id}
 */
router.delete('/delete/:id', 
  authenticateJWT, 
  // #swagger.tags = ['Instructors']
  // #swagger.description = 'Delete an instructor by ID'
  // #swagger.parameters['id'] = { description: "Instructor ID" }
  // #swagger.security = [{"cookieAuth": []}]
  instructorsController.deleteOneInstructor
);

module.exports = router;
