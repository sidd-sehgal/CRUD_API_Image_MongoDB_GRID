const mongoose = require("mongoose");


module.exports = async function connection() {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        // Connecting to the database
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("connected to database");
        
    } catch (error) {
        // Caught an Error
        console.log(error);
        console.log("could not connect to database");
    }
};
