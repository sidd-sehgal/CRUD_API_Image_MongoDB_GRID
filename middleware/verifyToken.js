const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const {auth_token} = req.headers;
    if (auth_token) {
        try{
            jwt.verify(auth_token, process.env.PRIVATE_KEY);
            next();
        } catch(e){
            res.send("Error: " + e.message);
        }
    } else {
        res.send("Error: Provide a Auth Token in Headers");
    }
}
