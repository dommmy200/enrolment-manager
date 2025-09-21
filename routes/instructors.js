const express = require('express')
const router = express.Router()
const instructorController = require('../controllers/instructors')

router.get('/', instructorController.getAllInstructors)
router.get('/:id', instructorController.getOneInstructor)
router.post('/post', instructorController.insertOneInstructor)
router.put('/update/:id', instructorController.updateInstructors)
router.delete('/delete/:id', instructorController.deleteOneInstructor)

module.exports = router