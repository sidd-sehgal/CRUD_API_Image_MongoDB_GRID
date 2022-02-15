const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining Admin Schema for Mongoose
const admin = new Schema({
    email: String,
    password: String,
});

// Exporting Admin Model  
module.exports = mongoose.model('admin', admin);