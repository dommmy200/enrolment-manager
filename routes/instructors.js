import express from 'express'
import instructorController from '../controllers/instructors.js'
const router = express.Router()

router.get('/', instructorController.getAllInstructors)
router.get('/:id', instructorController.getOneInstructor)
router.post('/post', instructorController.insertOneInstructor)
router.put('/update/:id', instructorController.updateInstructors)
router.delete('/delete/:id', instructorController.deleteOneInstructor)

export default router