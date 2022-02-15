const upload = require("multer")({ dest: 'uploads/' });
const router = require('express').Router();
const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");


router.get("/", function (req, res) {
    res.send("Admin Page Here")
});

router.post("/login", upload.none(), async function (req, res) {
    const { email, password } = req.body;

    if (email && password) {
        const result = await Admin.findOne({ email: email.toLowerCase() }).exec();

        if (result) {
            if (result.password === password) {
                // Success Login
                const token = jwt.sign({ email },
                    process.env.PRIVATE_KEY,
                    { expiresIn: "2h" });

                res.send("Login Successfully\nJWT Token: " + token)

            } else res.send("Incorrect password. Please try again!!")
            
        } else res.send("No Account exist with this email!!")
        
    } else res.send("Please Provide Email and Password")

});



module.exports = router;