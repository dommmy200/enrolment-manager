const mongodb = require('mongodb');
const database = require('../data/database');
const { ObjectId } = require('mongodb');

// --- READ OPERATIONS ---

/**
 * Retrieves all department records.
 */
const getAllDepartments = async (req, res) => {
    try {
        const db = database.getDatabase();
        // Read access is generally allowed for all authenticated users
        const departments = await db.collection('departments').find().toArray();
        
        if (!departments || departments.length === 0) {
            return res.status(404).json({
                message: "No Departments Found!"
            });
        }
        res.status(200).json(departments);
    } catch (err) {
        console.error('Error fetching all departments:', err);
        res.status(500).json({
            message: "Internal Server Error during fetch.",
            error: err.message
        });
    }
};

/**
 * Retrieves a single department record by its ID.
 */
const getOneDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;

        if (!ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid ID Format!" });
        }
        
        const db = database.getDatabase();
        const department = await db.collection('departments').findOne({ _id: new ObjectId(departmentId) });
        
        if (!department) {
            return res.status(404).json({
                message: "Department not found."
            });
        }
        res.status(200).json(department);
    } catch (err) {
        console.error('Error fetching one department:', err);
        res.status(500).json({
            message: "Internal Server Error during fetch.",
            error: err.message
        });
    }
};

// --- WRITE OPERATIONS (Protected) ---

/**
 * Inserts a new department record, linking it to the creating user (JWT/Ownership).
 */
const insertOneDepartment = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION/AUTHORIZATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in to create a department.' });
        }

        const newDepartment = {
            name: req.body.name,
            code: req.body.code,
            
            // OWNERSHIP LINK: Link the document to the current user
            userId: req.user._id 
        };

        // 2. INPUT VALIDATION
        if (!newDepartment.name || !newDepartment.code) {
             return res.status(400).json({ 
                 error: 'Validation Error', 
                 message: 'Missing required department fields (name and code).' 
             });
        }

        const db = database.getDatabase();
        const result = await db.collection('departments').insertOne(newDepartment);
        
        res.status(201).json({ 
            message: 'Department created successfully.',
            insertedId: result.insertedId 
        });

    } catch (err) {
        console.error('Insert department error:', err);
        next(err); 
    }
};

/**
 * Updates an existing department record, enforcing ownership via filter.
 */
const updateDepartments = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const departmentId = req.params.id;
       
        // 2. VALIDATION
        if (!ObjectId.isValid(departmentId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Department ID is not a valid ObjectId.' });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Update data cannot be empty' });
        }

        const db = database.getDatabase();
        
        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(departmentId), 
            userId: req.user._id 
        };

        // Use $set for partial update
        const updateDoc = { $set: req.body };

        const result = await db.collection('departments').updateOne(filter, updateDoc);

        // 4. RESULT HANDLER (Checks for Not Found and Forbidden)
        if (result.matchedCount === 0) {
            const checkExists = await db.collection('departments').findOne({ _id: new ObjectId(departmentId) });
            
            if (checkExists) {
                 // Exists but not owned by current user
                 return res.status(403).json({ message: 'Forbidden: You can only update your own department records.' });
            }
            
            return res.status(404).json({ message: 'No department found to update.' });
        }
        
        res.status(200).json({
            message: `Department updated successfully. Modified count: ${result.modifiedCount}.`, 
            result
        });

    } catch (error) {
        console.error('Update department error:', error);
        next(error); 
    }
};

/**
 * Deletes an existing department record, enforcing ownership via filter.
 */
const deleteOneDepartment = async (req, res, next) => {
    try {
        // 1. AUTHENTICATION CHECK
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User must be logged in.' });
        }

        const departmentId = req.params.id;

        // 2. VALIDATION
        if (!ObjectId.isValid(departmentId)) {
            return res.status(400).json({ error: 'Invalid ID format', message: 'Department ID is not a valid ObjectId.' });
        }
        
        const db = database.getDatabase();

        // 3. AUTHORIZATION/FILTER: Match document by ID AND ownership
        const filter = { 
            _id: new ObjectId(departmentId), 
            userId: req.user._id 
        };

        const result = await db.collection('departments').deleteOne(filter);

        // 4. RESULT HANDLER (Checks for Not Found and Forbidden)
        if (result.deletedCount === 0) {
            const checkExists = await db.collection('departments').findOne({ _id: new ObjectId(departmentId) });
            
            if (checkExists) {
                 // Exists but not owned by current user
                 return res.status(403).json({ message: 'Forbidden: You can only delete your own department records.' });
            }
            
            return res.status(404).json({ message: 'No department found to delete.' });
        }
        
        res.status(200).json({ message: 'Department deleted successfully.' });

    } catch (err) {
        console.error('Delete department error:', err);
        next(err); 
    }
};

module.exports = { getAllDepartments, getOneDepartment, insertOneDepartment, updateDepartments, deleteOneDepartment };
