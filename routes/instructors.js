import express from 'express'
import ensureAuthenticated, { ensureScope } from "../middleware/ensureAuth.js";
import instructorController from '../controllers/instructors.js'
const router = express.Router()

// GET /instructors/
// #swagger.tags = ['Instructors']
router.get('/',
    instructorController.getAllInstructors)

// GET /instructors/
// #swagger.tags = ['Instructors']
router.get('/:id',
    instructorController.getOneInstructor)
// PUT /instructors/update/:id
// #swagger.tags = ['Instructors']
// #swagger.security = [{ "BearerAuth": [] }]
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Course data to create',
//   required: true,
//   schema: {
//      course_name: "Introductory to Biology",
//      description: "Covers basics of cell biology and genetics.",
//      credit: "3",
//      department: "Biological Sciences",
//      instructor-id: Object 68d87eb28b3ef5ea611c00bc,
//      semester: "Fall 2025",
//      status:"active",
//      created_at: "2025-09-27T10:15:00.000+00:00",
//      updated_at: "2025-09-27T10:15:00.000+00:00",
//      prerequisites:[ math001, chem010]
//   }
// }
router.post('/post',
    ensureAuthenticated,
    ensureScope(["write: instructors"]),
     instructorController.insertOneInstructor)

// PUT /instructors/update/:id
// #swagger.tags = ['Instructors']
// #swagger.security = [{ "BearerAuth": [] }]
router.put('/update/:id',
    ensureAuthenticated,
    ensureScope(["write: instructors"]),
     instructorController.updateInstructors)

// PUT /instructors/update/:id
// #swagger.tags = ['Instructors']
// #swagger.security = [{ "BearerAuth": [] }]
router.delete('/delete/:id',
    ensureAuthenticated,
    ensureScope(["write: instructors"]),
     instructorController.deleteOneInstructor)

export default router