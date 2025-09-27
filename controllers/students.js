const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = require('mongodb')

/**
 * Retrieves all enrolled students from the database.
 * This is an unprotected public route.
 */
const getAllEnrolledStudents = async (req, res) => {
    try {
        const db = database.getDatabase()
        const students = await db.collection('students').find().toArray()
        if (!students || students.length === 0) {
            return res.status(404).json({
                message: "No Students Found!"
            })
        }
        res.status(200).json(students)
    } catch (err) {
        console.error('Error fetching all students:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Retrieves a single enrolled student by ID.
 * This is an unprotected public route.
 */
const getOneEnrolledStudent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Student ID Format!"})
        }
        // Using new ObjectId() for consistency
        const studentId = new ObjectId(req.params.id);
        const db = database.getDatabase()
        const student = await db.collection('students').findOne({_id: studentId})
        if (!student) {
            return res.status(404).json({
                message: "Student Not Found!"
            })
        }
        res.status(200).json(student)
    } catch (err) {
        console.error('Error fetching one student:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Inserts a new student enrollment record. Requires authentication and checks for required fields.
 * Links the new record to the authenticated user via 'userId'.
 */
const insertOneEnrolledStudent = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to enroll a student.' });
        }

        const db = database.getDatabase();
        
        const newStudent = {
            // Map request body to Student schema fields
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            enrolment_date: req.body.enrolment_date,
            status: req.body.status,
            gpa: req.body.gpa,
            course_id: req.body.course_id, // Link to the course they are enrolling in
            
            // 3. AUTHORIZATION/OWNERSHIP: Link to the authenticated user
            userId: req.user._id 
        };

        // 2. INPUT VALIDATION: Check for required fields
        if (!newStudent.first_name || !newStudent.email || !newStudent.course_id) {
             return res.status(400).json({ error: 'Validation Error', message: 'Missing required student enrollment fields (first_name, email, course_id).' });
        }

        const result = await db.collection('students').insertOne(newStudent);
        
        res.status(201).json({ 
            message: 'Student enrolled successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Enroll student error:', err);
        next(err); 
    }
};

/**
 * Updates an existing student enrollment record. Requires authentication and ownership check.
 */
const updateStudentEnrollment = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const studentId = req.params.id;
       
        // 2. VALIDATION
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Student ID is not a valid ObjectId.' });
        }
        
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(studentId), 
            userId: req.user._id 
        };

        const updateDoc = { $set: req.body };

        const result = await db.collection('students').updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            // Check if the student record exists but is not owned by the user (403 Forbidden)
            const checkExists = await db.collection('students').findOne({ _id: new ObjectId(studentId) });
            
            if (checkExists) {
                 return res.status(403).json({ message: 'Forbidden: You can only update student records you created.' });
            }
            
            // Does not exist (404 Not Found)
            return res.status(404).json({ message: 'No student found to update.' });
        }
        
        res.status(200).json({
            message: `Student enrollment updated successfully. Modified count: ${result.modifiedCount}.`, 
            result
        });

    } catch (error) {
        console.error('Update student error:', error);
        next(error); 
    }
};

/**
 * Deletes an existing student enrollment record. Requires authentication and ownership check.
 */
const deleteOneEnrolledStudent = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const studentId = req.params.id;

        // 2. VALIDATION
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Student ID is not a valid ObjectId.' });
        }
        
        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(studentId), 
            userId: req.user._id 
        };

        const result = await db.collection('students').deleteOne(filter);

        if (result.deletedCount === 0) {
            // Check if the student record exists but is not owned by the user (403 Forbidden)
            const checkExists = await db.collection('students').findOne({ _id: new ObjectId(studentId) });
            
            if (checkExists) {
                 return res.status(403).json({ message: 'Forbidden: You can only delete student records you created.' });
            }
            
            // Does not exist (404 Not Found)
            return res.status(404).json({ message: 'No student found to delete.' });
        }
        
        res.status(200).json({ message: 'Student deleted successfully.' });

    } catch (err) {
        console.error('Delete student error:', err);
        next(err); 
    }
};

module.exports = { getAllEnrolledStudents, getOneEnrolledStudent, insertOneEnrolledStudent, updateStudentEnrollment, deleteOneEnrolledStudent }
