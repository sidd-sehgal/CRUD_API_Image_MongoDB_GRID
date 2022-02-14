const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('user', user);