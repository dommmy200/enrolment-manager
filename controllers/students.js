const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = mongodb.ObjectId

getAllEnrolledStudents = async (req, res) => {
    try {
        const db = database.getDatabase()
        const students = await db.collection('students').find().toArray()
        if (!students) {
            return res.status(404).json({
                message: "No Students Found!"
            })
        }
        res.status(200).json(students)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
getOneEnrolledStudent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Format!"})
        }
        const studentId = ObjectId.createFromHexString(req.params.Id)
        const db = database.getDatabase()
        const student = db.collection('students').findOne({_id: studentId})
        if (!student) {
            return res.status(404).json({
                message: "No Student Found!"
            })
        }
        res.status(200).json(student)
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
insertOneEnrolledStudent = async (req, res) => {
    const db = database.getDatabase()
    const updateEnrolment = {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        phoneNumber: req.body.phone_number,
        course: req.body.course,
        enrolmentDate: req.body.enrolment_date,
        status: req.body.status,
        gpa: req.body.gpa
    }
    await db.collection('students').insertOne(updateEnrolment).then(result =>{
        res.status(201).json(result)
    }).catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
    
}

module.exports = {getAllEnrolledStudents, getOneEnrolledStudent, insertOneEnrolledStudent}