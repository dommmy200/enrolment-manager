
// import { ObjectId } from 'mongodb';
// import database from '../data/database.js'

// const getAllEnrolledStudents = async (req, res) => {
//     try {
//         const db = database.getDatabase()
//         const students = await db.collection('students').find().toArray()
//         if (!students) {
//             return res.status(404).json({
//                 message: "No Students Found!"
//             })
//         }
//         res.status(200).json(students)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }
// const getOneEnrolledStudent = async (req, res) => {
//     try {
//         if (!ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({message: "Invalid Format!"})
//         }
//         const studentId = ObjectId.createFromHexString(req.params.id);
//         const db = database.getDatabase()
//         const student = await db.collection('students').findOne({_id: studentId})
//         if (!student) {
//             return res.status(404).json({
//                 message: "No Student Found!"
//             })
//         }
//         res.status(200).json(student)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }

// const insertOneEnrolledStudent = async (req, res) => {
//     const db = database.getDatabase()
//     const updateEnrolment = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         email: req.body.email,
//         phone_number: req.body.phone_number,
//         course: req.body.course,
//         enrolment_date: req.body.enrolment_date,
//         status: req.body.status,
//         gpa: req.body.gpa
//     }
//     await db.collection('students').insertOne(updateEnrolment).then(result =>{
//         res.status(201).json(result)
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message
//         })
//     })
    
// }
// const updateStudentEnrollment = async (req, res) => {
//     try {
//         const db = database.getDatabase();
//         const { id } = req.params;
//         if (!ObjectId.isValid(id)) {
//             return res.status(400).json({ error: 'Invalid ID format'});
//         }
//         //  Validate body
//         console.log('Incoming update body:', req.body); // Debug log
//         if (!req.body || Object.keys(req.body).length === 0) {
//           return res.status(400).json({ error: 'Update data cannot be empty' });
//         }

//         // Converts the string id you received (e.g., from a URL parameter) 
//         // into a MongoDB ObjectId instance so MongoDB can match it.
//         const filter = { 
//             _id: new ObjectId(id)
//         };
//         const allowedFields = [
//             'first_name', 'last_name', 'email', 
//             'phone_number', 'course', 'enrolment_date', 
//             'status', 'gpa'
//         ];
//         const updateData = {};
//         allowedFields.forEach(field => {
//             if (req.body[field] !== undefined) updateData[field] = req.body[field];
//         });
//         // Without $set, if you passed req.body directly:
//         // MongoDB would replace the entire document with only the fields in 
//         // req.body, deleting any others not listed. $set avoids that by 
//         // performing a partial update.
//         const updateDoc = { $set: updateData };
//         let student = ''
//         const result = await db.collection('students').updateOne(filter, updateDoc);
//         if (result.matchedCount === 0) {
//             return res.status(404).json({
//                 message: 'No matching student found.'
//             });
//         }
//         if (result.matchedCount === 1) {
//             student = 'student'
//         } else if (result.matchedCount > 1){
//             student = 'students'
//         }

//         res.status(200).json({
//             message: `Updated ${result.modifiedCount} ${student}.`, result
//         });
//     } catch (error) {
//         console.error('Update error:', error);
//         res.status(500).json({
//             error: `Internal Server Error!`
//         });
//     }
    
// };

// const deleteOneEnrolledStudent = async (req, res) => {
//     try {
//         const db = database.getDatabase();
//         const { id } = req.params;
//         const filter = { _id: new ObjectId(id) };
//         console.log('ObjectId:', filter);
//         console.log('req.params.id:', req.params.id);

//         if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid ID format' });
//         }
//         const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No student found to delete.' });
//         }
//         res.json({ message: 'Student deleted successfully.' });
//     } catch (err) {
//         console.error('Delete error:', err);
//         res.status(500).json({ error: 'Internal Server Error!' });
//     }
// };

// export default { getAllEnrolledStudents, getOneEnrolledStudent, insertOneEnrolledStudent, updateStudentEnrollment, deleteOneEnrolledStudent }

// ======================= GET ALL STUDENTS =======================
const getAllEnrolledStudents = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Fetch all Students documents from the 'Students' collection
        const result = await mongodb.getDatabase().collection('students').find();
        // Convert MongoDB cursor to an array
        const students = await result.toArray();
        
        // If no Students found, return 404
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No Students found!' });
        }
        
        // Return the Students in JSON format
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    } catch (error) {
        // Handle any unexpected server errors
        console.error('Error fetching students:', err);
        res.status(500).json({message: 'Some error occurred while retrieving the Students.'});
    }
}; 
// ======================= GET STUDENT BY ID =======================
const getOneEnrolledStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Convert the ID from the URL to a MongoDB ObjectId
        const studentId = new ObjectId(req.params.id);
        // Find the courses document with the matching ID
        const result = await mongodb.getDatabase().collection('students').find({ _id: studentId });
        const students = await result.toArray();
        
        // If students not found, return 404
        if (!students || students.length === 0) {
            return res.status(404).json({
                message: `Students with ID ${req.params.id} not found`
            });
        }
        
        // Return the single student object
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students[0]);
    } catch (error) {
        // Handle errors such as invalid ID or server issues
        res.status(500).json({message:error || 'Some error occurred while retrieving the student.'});
    }  
};

// ======================= CREATE STUDENTS =======================
const insertAStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Create new student object from request body
        const insertStudent = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            course: req.body.course,
            enrolment_date: req.body.enrolment_date,
            status: req.body.status,
            gpa: req.body.gpa
        }
        
        // Insert new course into MongoDB collection
        const result = await mongodb.getDatabase().collection('students').insertOne(insertStudent);
        
        // Confirm successful insertion
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Student created successfully',
                contactId: result.insertedId
            });
        } else {
            // Insertion failed for some reason
            res.status(500).json({ 
                message: 'Failed to create students'
            });
        }
    } catch (error) {
        // Log and return server error
        console.error('Error creating student', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the student.' });
    }
};
// ======================= UPDATE A STUDENT =======================
const updateStudentEnrollment = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Validate ID format before proceeding
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID format'
            });
        }
        
        // Convert ID to ObjectId and prepare update data
        const studentId = new ObjectId(req.params.id);
        const updateStudent = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            course: req.body.course,
            enrolment_date: req.body.enrolment_date,
            status: req.body.status,
            gpa: req.body.gpa
        }
        
        // Update Course document by ID
        const result = await mongodb.getDatabase().collection('students').updateOne(
            { _id: studentId }, 
            { $set: updateStudent }
        );
        
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Student updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the Student'
            });
        }
    } catch (error) {
        // Log and handle any update errors
        console.error('Error updating Student', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the Student.' });
    }
};
// ======================= DELETE A STUDENTS =======================
const deleteOneEnrolledStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Student ID format'
            });
        }
        
        // Convert ID to ObjectId and delete course by ID
        const studentId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('students').deleteOne({ _id: studentId });
        
        // If no document deleted, actor doesn't exist
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }
        
        // Success response
        res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        // Log and handle deletion errors
        console.error('Error deleting Student:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the Student.' });
    }
};
export default { getAllEnrolledStudents, getOneEnrolledStudent, insertAStudent, updateStudentEnrollment, deleteOneEnrolledStudent }

// export default { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }