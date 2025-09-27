// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the structure for a User in your database
const userSchema = new Schema({
    // This is the unique ID provided by GitHub, used for searching
    githubId: {
        type: String, 
        required: true, 
        unique: true 
    },
    // Display name provided by GitHub
    displayName: String,
    // Email (if requested via scope)
    email: String,
    // Optional: Date the user was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;