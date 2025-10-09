// import { ObjectId } from 'mongodb';
// import database from '../data/database.js'

// const getAllInstructors = async (req, res) => {
//     try {
//         const db = database.getDatabase()
//         const instructors = await db.collection('instructors').find().toArray()
//         if (!instructors) {
//             return res.status(404).json({
//                 message: "No Instructors Found!"
//             })
//         }
//         res.status(200).json(instructors)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }
// const getOneInstructor = async (req, res) => {
//     try {
//         if (!ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({message: "Invalid Format!"})
//         }
//         const instructorId = ObjectId.createFromHexString(req.params.id);
//         const db = database.getDatabase()
//         const instructor = await db.collection('instructors').findOne({_id: instructorId})
//         if (!instructor) {
//             return res.status(404).json({
//                 message: "No Instructors Found!"
//             })
//         }
//         res.status(200).json(instructor)
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }

// const insertOneInstructor = async (req, res) => {
//     const db = database.getDatabase()
//     const updateEnrolment = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name,
//         email: req.body.email,
//         phone_number: req.body.phone_number,
//         course: req.body.course,
//         department: req.body.department,
//         hire_date: req.body.hire_date,
//         status: req.body.status
//     }
//     await db.collection('instructors').insertOne(updateEnrolment).then(result =>{
//         res.status(201).json(result)
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message
//         })
//     })
    
// }
// const updateInstructors = async (req, res) => {
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

//         // Without $set, if you passed req.body directly:
//         // MongoDB would replace the entire document with only the fields in 
//         // req.body, deleting any others not listed. $set avoids that by 
//         // performing a partial update.
//         const updateDoc = { $set: req.body };
//         let instructor = ''
//         const result = await db.collection('instructors').updateOne(filter, updateDoc);
//         if (result.matchedCount === 0) {
//             return res.status(404).json({
//                 message: 'No matching instructor found.'
//             });
//         }
//         if (result.matchedCount === 1) {
//             instructor = 'instructor'
//         } else if (result.matchedCount > 1){
//             instructor = 'instructors'
//         }

//         res.status(200).json({
//             message: `Updated ${result.modifiedCount} ${instructor}.`, result
//         });
//     } catch (error) {
//         console.error('Update error:', error);
//         res.status(500).json({
//             error: `Internal Server Error!`
//         });
//     }
    
// };

// const deleteOneInstructor = async (req, res) => {
//     try {
//         const db = database.getDatabase();
//         const { id } = req.params;
//         const filter = { _id: new ObjectId(id) };
//         console.log('ObjectId:', filter);
//         console.log('req.params.id:', req.params.id);

//         if (!ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid ID format' });
//         }
//         const result = await db.collection('instructors').deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No instructor found to delete.' });
//         }
//         res.json({ message: 'Instructors deleted successfully.' });
//     } catch (err) {
//         console.error('Delete error:', err);
//         res.status(500).json({ error: 'Internal Server Error!' });
//     }
// };

// export default { getAllInstructors, getOneInstructor, insertOneInstructor, updateInstructors, deleteOneInstructor }


// Import database connection module (ESM syntax)
import mongodb from '../data/database.js';

// Import ObjectId from MongoDB for handling document IDs (ESM syntax)
import { ObjectId } from 'mongodb';

// ======================= GET ALL INSTRUCTORS =======================
const getAllInstructors = async (req, res) => {
    //#swagger.tags = ['Instructors']
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
        res.status(500).json({message: 'Some error occurred while retrieving the instructors.'});
    }
}; 
// ======================= GET INSTRUCTOR BY ID =======================
const getOneInstructor = async (req, res) => {
    //#swagger.tags = ['Instructors']
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
    //#swagger.tags = ['Instructors']
    try {
        // Create new instructor object from request body
        const insertInstructor = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            course: req.body.course,
            department: req.body.department,
            hire_date: req.body.hire_date,
            status: req.body.status
        }
        
        // Insert new course into MongoDB collection
        const result = await mongodb.getDatabase().collection('instructors').insertOne(insertInstructor);
        
        // Confirm successful insertion
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Instructor created successfully',
                contactId: result.insertedId
            });
        } else {
            // Insertion failed for some reason
            res.status(500).json({ 
                message: 'Failed to create instructor'
            });
        }
    } catch (error) {
        // Log and return server error
        console.error('Error creating instructor', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the instructor.' });
    }
};
// ======================= UPDATE A INSTRUCTOR =======================
const updateInstructors = async (req, res) => {
    //#swagger.tags = ['Instructors']
    try {
        // Validate ID format before proceeding
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid instructor ID format'
            });
        }
        
        // Convert ID to ObjectId and prepare update data
        const instructorId = new ObjectId(req.params.id);
        const updateInstructor = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            course: req.body.course,
            department: req.body.department,
            hire_date: req.body.hire_date,
            status: req.body.status
        }
        
        // Update Course document by ID
        const result = await mongodb.getDatabase().collection('instructors').updateOne(
            { _id: instructorId }, 
            { $set: updateInstructor }
        );
        
        // Handle cases where no matching Course found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Instructor with ID ${req.params.id} not found`
            });
        }
        
        // Return success message depending on update result
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Instructor updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the Instructor'
            });
        }
    } catch (error) {
        // Log and handle any update errors
        console.error('Error updating Instructor', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the Instructo.' });
    }
};
// ======================= DELETE INSTRUCTOR =======================
const deleteOneInstructor = async (req, res) => {
    //#swagger.tags = ['Instructors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Instructor ID format'
            });
        }
        
        // Convert ID to ObjectId and delete course by ID
        const instructorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('instructors').deleteOne({ _id: instructorId });
        
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

// export default { getAllCourses, getOneCourse, insertOneCourse, updateCourses, deleteOneCourse }