const upload = require("../middleware/upload");
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");


router.get("/", function (req, res) {
    res.send("Get on /admin/")
});

router.post("/login", upload.none(), function (req, res) {
    const { email, password } = req.body;

    if (email && password) {
        Admin.findOne({ email: email.toLowerCase() }, (err, result) => {
            // console.log(result);
            if (result) {
                if (result.password === password) {
                    // Success Login
                    const token = jwt.sign({ email },
                        process.env.PRIVATE_KEY,
                        { expiresIn: "2h" });

                    res.send("Login Successfully\nJWT Token: " + token)
                } else {
                    res.send("Incorrect password. Please try again!!")
                }
            } else {
                res.send("No Account exist with this email!!")
            }
        })
    } else res.send("Please Provide Email and Password")


});



module.exports = router;