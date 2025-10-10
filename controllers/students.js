
import { ObjectId } from 'mongodb';
import mongodb from '../data/database.js'

// ======================= GET ALL STUDENTS =======================
const getAllEnrolledStudents = async (req, res) => {
    //#swagger.tags = ['Students']
    //#swagger.description = 'Retrieve all Students available in the system'
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
        console.error('Error fetching students:', error);
        res.status(500).json({message: 'Some error occurred while retrieving the Students.'});
    }
}; 
// ======================= GET STUDENT BY ID =======================
const getOneEnrolledStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    //#swagger.description = 'Retrieve a specific Student by ID'
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
/*
    #swagger.tags = ['Students']
    #swagger.description = 'Add a new student to the catalog'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Student data to add',
      required: true,
      schema: {
        example: {
          first_name: "Aisha",
          last_name: "Garba",
          email: "aisha.garba@example.com",
          phone_number: "+2348034567890",
          course: "Economics",
          enrollment_date: "2025-02-28",
          status: "Active",
          gpa: 3.55
        }
      }
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {

        console.log("Incoming data:", req.body);
        const db = mongodb.getDatabase();
        const student = req.body;
        if (!student.first_name || !student.last_name || !student.email || !student.course) {
            return res.status(400).json({ 
                message: 'Missing required fields: first_name, last_name, email, or course' 
            });
        }
        // Insert new course into MongoDB collection
        const result = await db.collection('students').insertOne(student);
        // Confirm successful insertion
        res.status(201).json({
            message: 'Student created successfully',
            contactId: result.insertedId
        });
    } catch (error) {
        // Log and return server error
        console.error('Error creating student', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the student.' });
    }
};
// ======================= UPDATE A STUDENT =======================
const updateStudentEnrollment = async (req, res) => {
/*
    #swagger.tags = ['Students']
    #swagger.description = 'Update an existing student'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = { in: 'path', description: 'Student ID', required: true }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated student data',
      required: true,
      schema: {
        example: {
          first_name: "Aisha",
          last_name: "Garba",
          email: "aisha.garba@example.com",
          phone_number: "+2348034567890",
          course: "Economics",
          enrollment_date: "2025-02-28",
          status: "Active",
          gpa: 3.75
        }
      }
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {
        const studentId = req.params.id;
        // Validate ID format before proceeding
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: 'Invalid student ID format'
            });
        }

        const updateStudent = req.body;
        const db = mongodb.getDatabase();
        // Update course document by ID
        const result = await db.collection('students').updateOne(
            { _id: new ObjectId(studentId) }, 
            { $set: updateStudent }
        );
        
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount === 0) {
            res.status(200).json({ message: 'No changes made to the Student'});
        }
        res.status(200).json({
            message: 'Student updated successfully'
        });
    } catch (error) {
        // Log and handle any update errors
        console.error('Error updating Student', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the Student.' });
    }
};
// ======================= DELETE A STUDENTS =======================
const deleteOneEnrolledStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    //#swagger.description = 'Delete a Student by ID'
    try {
        // Validate ID format
        const studentId = req.params.id;
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: 'Invalid Student ID format'
            });
        }
        
        // Convert ID to ObjectId and delete student by ID
        const db = mongodb.getDatabase()
        const result = await db.collection('students').deleteOne({ _id: new ObjectId(studentId)  });
        
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
