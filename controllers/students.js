
import { ObjectId } from 'mongodb';
import database from '../data/database.js'

const getAllEnrolledStudents = async (req, res) => {
    //swagger.tags=['Hello World']
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
const getOneEnrolledStudent = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Format!"})
        }
        const studentId = ObjectId.createFromHexString(req.params.id);
        const db = database.getDatabase()
        const student = await db.collection('students').findOne({_id: studentId})
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

const insertOneEnrolledStudent = async (req, res) => {
    //swagger.tags=['Hello World']
    const db = database.getDatabase()
    const updateEnrolment = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        course: req.body.course,
        enrolment_date: req.body.enrolment_date,
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
const updateStudentEnrollment = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format'});
        }
        //  Validate body
        console.log('Incoming update body:', req.body); // Debug log
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // Converts the string id you received (e.g., from a URL parameter) 
        // into a MongoDB ObjectId instance so MongoDB can match it.
        const filter = { 
            _id: new ObjectId(id)
        };
        const allowedFields = [
            'first_name', 'last_name', 'email', 
            'phone_number', 'course', 'enrolment_date', 
            'status', 'gpa'
        ];
        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });
        // Without $set, if you passed req.body directly:
        // MongoDB would replace the entire document with only the fields in 
        // req.body, deleting any others not listed. $set avoids that by 
        // performing a partial update.
        const updateDoc = { $set: updateData };
        let student = ''
        const result = await db.collection('students').updateOne(filter, updateDoc);
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'No matching student found.'
            });
        }
        if (result.matchedCount === 1) {
            student = 'student'
        } else if (result.matchedCount > 1){
            student = 'students'
        }

        res.status(200).json({
            message: `Updated ${result.modifiedCount} ${student}.`, result
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            error: `Internal Server Error!`
        });
    }
    
};

const deleteOneEnrolledStudent = async (req, res) => {
    //swagger.tags=['Hello World']
    try {
        const db = database.getDatabase();
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        console.log('ObjectId:', filter);
        console.log('req.params.id:', req.params.id);

        if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
        }
        const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No student found to delete.' });
        }
        res.json({ message: 'Student deleted successfully.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
};

export default { getAllEnrolledStudents, getOneEnrolledStudent, insertOneEnrolledStudent, updateStudentEnrollment, deleteOneEnrolledStudent }