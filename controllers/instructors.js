const mongodb = require('mongodb')
const database = require('../data/database')
const { ObjectId } = require('mongodb')

/**
 * Retrieves all instructors from the database.
 * This is an unprotected public route.
 */
const getAllInstructors = async (req, res) => {
    try {
        const db = database.getDatabase()
        const instructors = await db.collection('instructors').find().toArray()
        if (!instructors || instructors.length === 0) {
            return res.status(404).json({
                message: "No Instructors Found!"
            })
        }
        res.status(200).json(instructors)
    } catch (err) {
        console.error('Error fetching all instructors:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Retrieves a single instructor by ID.
 * This is an unprotected public route.
 */
const getOneInstructor = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid Instructor ID Format!"})
        }
        const instructorId = new ObjectId(req.params.id);
        const db = database.getDatabase()
        const instructor = await db.collection('instructors').findOne({_id: instructorId})
        
        if (!instructor) {
            return res.status(404).json({
                message: "Instructor Not Found!"
            })
        }
        res.status(200).json(instructor)
    } catch (err) {
        console.error('Error fetching one instructor:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Inserts a new instructor record. Requires authentication and checks for required fields.
 * Links the new record to the authenticated user via 'userId'.
 */
const insertOneInstructor = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to create an instructor.' });
        }

        const db = database.getDatabase();
        
        const { first_name, last_name, email, phone_number, department_id, hire_date } = req.body;

        // 2. INPUT VALIDATION: Check for required fields
        if (!first_name || !email || !department_id) {
             return res.status(400).json({ 
                error: 'Missing required fields', 
                message: 'Required fields: first_name, email, department_id.' 
            });
        }
        
        const newInstructor = {
            // Map request body to Instructor schema fields
            first_name,
            last_name,
            email,
            phone_number,
            department_id,
            hire_date,
            
            // 3. AUTHORIZATION/OWNERSHIP: Link to the authenticated user
            userId: req.user._id 
        };

        const result = await db.collection('instructors').insertOne(newInstructor);
        
        res.status(201).json({ 
            message: 'Instructor created successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Insert instructor error:', err);
        next(err); 
    }
}

/**
 * Updates an existing instructor record. Requires authentication and ownership check.
 */
const updateInstructors = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const instructorId = req.params.id;
       
        // 2. VALIDATION
        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Instructor ID is not a valid ObjectId.' });
        }
        
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(instructorId), 
            userId: req.user._id 
        };

        const updateDoc = { $set: req.body };
<<<<<<< HEAD
        const result = await db.collection('instructors').updateOne(filter, updateDoc);

=======
        let instructor = ''
        const result = await db.collection('students').updateOne(filter, updateDoc);
>>>>>>> parent of eac715d (Crrection on CRUD method definitions)
        if (result.matchedCount === 0) {
            const checkExists = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
            
            if (checkExists) {
                 // Exists but not owned by current user (403 Forbidden)
                 return res.status(403).json({ message: 'Forbidden: You can only update your own instructor records.' });
            }
            
            // Does not exist (404 Not Found)
            return res.status(404).json({ message: 'No instructor found to update.' });
        }
        
        res.status(200).json({
            message: `Instructor updated successfully. Modified count: ${result.modifiedCount}.`, 
            result
        });

    } catch (error) {
        console.error('Update instructor error:', error);
        next(error); 
    }
};

/**
 * Deletes an existing instructor record. Requires authentication and ownership check.
 */
const deleteOneInstructor = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const db = database.getDatabase();
        const instructorId = req.params.id;

        // 2. VALIDATION
        if (!ObjectId.isValid(instructorId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Instructor ID is not a valid ObjectId.' });
        }
        
        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(instructorId), 
            userId: req.user._id 
        };

        const result = await db.collection('instructors').deleteOne(filter);

        if (result.deletedCount === 0) {
            const checkExists = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
            
            if (checkExists) {
                 // Exists but not owned by current user (403 Forbidden)
                 return res.status(403).json({ message: 'Forbidden: You can only delete your own instructor records.' });
            }
            
            // Does not exist (404 Not Found)
            return res.status(404).json({ message: 'No instructor found to delete.' });
        }
        
        res.status(200).json({ message: 'Instructor deleted successfully.' });

    } catch (err) {
        console.error('Delete instructor error:', err);
        next(err); 
    }
};

module.exports = { getAllInstructors, getOneInstructor, insertOneInstructor, updateInstructors, deleteOneInstructor }
