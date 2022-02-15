const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining User Schema for Mongoose
const user = new Schema({
    email: String,
    name: String,
    timeStamp: String,
    mobile_number: {type: String, unique: true},
    imgUrl: [{
        imgId: String,
        imgUrl: String,
    }],
});

// Exporting User Model  
module.exports = mongoose.model('user', user);