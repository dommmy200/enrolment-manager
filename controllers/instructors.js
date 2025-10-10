// Import ObjectId from MongoDB for handling document IDs (ESM syntax)
import { ObjectId } from 'mongodb';
// Import database connection module (ESM syntax)
import mongodb from '../data/database.js';

// ======================= GET ALL INSTRUCTORS =======================
const getAllInstructors = async (req, res) => {
    //#swagger.tags = ['Instructors']
    //#swagger.description = 'Retrieve all Instructors available in the system'
    try {
        // Fetch all instructors documents from the 'Instructors' collection
        const result = await mongodb.getDatabase().collection('instructors').find();
        // Convert MongoDB cursor to an array
        const instructors = await result.toArray();
        
        // If no instructors found, return 404
        if (!instructors || instructors.length === 0) {
            return res.status(404).json({ message: 'No instructors found!' });
        }
        
        // Return the instructors in JSON format
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(instructors);
    } catch (error) {
        // Handle any unexpected server errors
         console.error('Error fetching students:', error);
        res.status(500).json({message: 'Some error occurred while retrieving the instructors.'});
    }
}; 
// ======================= GET INSTRUCTOR BY ID =======================
const getOneInstructor = async (req, res) => {
    //#swagger.tags = ['Instructors']
    //#swagger.description = 'Retrieve a specific available in the system'
    try {
        // Convert the ID from the URL to a MongoDB ObjectId
        const instructorId = new ObjectId(req.params.id);
        // Find the courses document with the matching ID
        const result = await mongodb.getDatabase().collection('instructors').find({ _id: instructorId });
        const instructors = await result.toArray();
        
        // If courses not found, return 404
        if (!instructors || instructors.length === 0) {
            return res.status(404).json({
                message: `Instructors with ID ${req.params.id} not found`
            });
        }
        
        // Return the single instructor object
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(instructors[0]);
    } catch (error) {
        // Handle errors such as invalid ID or server issues
        res.status(500).json({message:error || 'Some error occurred while retrieving the instructor.'});
    }  
};

// ======================= CREATE INSTRUCTOR =======================
const insertOneInstructor = async (req, res) => {
/*
    #swagger.tags = ['Instructors']
    #swagger.description = 'Add a new Instructor to the catalog'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Instructor data to add',
      required: true,
      schema: {
        example: {
          first_name: "David",
          last_name: "Ogunleye",
          email: "adewale.ogunleye@example.com",
          phone_number: "+234809870987",
          course: "Medic",
          department: "Computer Science",
          hire_date: "2024-01-20",
          status: "Active"
        }
      }
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {
        // Insert new instructor into MongoDB collection
        console.log("Incoming data:", req.body);
        const db = mongodb.getDatabase();
        const instructor = req.body;
        if (!instructor.first_name || !instructor.last_name || !instructor.phone_number || !instructor.email) {
            return res.status(400).json({ 
                message: 'Missing required fields: first_name, last_name, email, or phone_number' 
            });
        }
        // Insert new course into MongoDB collection
        const result = await db.collection('instructors').insertOne(instructor);
        
        // Confirm successful insertion
        res.status(201).json({
            message: 'Instructor created successfully',
            contactId: result.insertedId
        });
    } catch (error) {
        // Log and return server error
        console.error('Error creating Instructor', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the Instructor.' });
    }
};
// ======================= UPDATE A INSTRUCTOR =======================
const updateInstructors = async (req, res) => {
/*
    #swagger.tags = ['Instructors']
    #swagger.description = 'Update an existing Instructor'
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.parameters['id'] = { in: 'path', description: 'Instructor ID', required: true }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated Instructor data',
      required: true,
      schema: {
        example: {
          first_name: "David",
          last_name: "Ogunleye",
          email: "adewale.ogunleye@example.com",
          phone_number: "+234809870987",
          course: "Medic",
          department: "Computer Science",
          hire_date: "2024-01-20",
          status: "Active"
        }
      }
    }
    #swagger.responses[200] = swaggerTemplates.responses.success[200]
    #swagger.responses[400] = swaggerTemplates.responses.error[400]
    #swagger.responses[404] = swaggerTemplates.responses.error[404]
    #swagger.responses[500] = swaggerTemplates.responses.error[500]
  */
    try {
        const instructorId = req.params.id;
        // Validate ID format before proceeding
        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({
                message: 'Invalid instructor ID format'
            });
        }
        
        const updateInstructor = req.body;
        const db = mongodb.getDatabase();
        // Update course document by ID
        const result = await db.collection('instructors').updateOne(
            { _id: new ObjectId(instructorId) }, 
            { $set: updateInstructor }
        );
        
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Instructor with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount === 0) {
            res.status(200).json({ message: 'No changes made to the Instructor'});
        }
        res.status(200).json({
            message: 'Instructor updated successfully'
        });
    } catch (error) {
        // Log and handle any update errors
        console.error('Error updating Instructor', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the Instructor.' });
    }
};
// ======================= DELETE INSTRUCTOR =======================
const deleteOneInstructor = async (req, res) => {
    //#swagger.tags = ['Instructors']
    //#swagger.description = 'Delete an Instructor by ID'
    try {
        // Validate ID format
        const instructorId = req.params.id;
        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({
                message: 'Invalid Instructor ID format'
            });
        }
        
        // Convert ID to ObjectId and delete student by ID
        const db = mongodb.getDatabase()
        const result = await db.collection('instructors').deleteOne({ _id: new ObjectId(instructorId)  });
                
        // If no document deleted, actor doesn't exist
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Instructor with ID ${req.params.id} not found`
            });
        }
        
        // Success response
        res.status(200).json({
            message: 'Instructor deleted successfully'
        });
    } catch (error) {
        // Log and handle deletion errors
        console.error('Error deleting Instructor:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the Instructor.' });
    }
};
export default { getAllInstructors, getOneInstructor, insertOneInstructor, updateInstructors, deleteOneInstructor }
