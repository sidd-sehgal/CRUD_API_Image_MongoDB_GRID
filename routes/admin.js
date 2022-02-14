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

    Admin.findOne({ email: email }, (err, result) => {
        // console.log(result);
        if (result) {
            if (result.password === password) {
                // Success Login
                const token = jwt.sign({ email },
                    process.env.PRIVATE_KEY,
                    { expiresIn: "1h" });

                res.send("Login Successfully\nJWT Token: " + token)
            } else {
                res.send("Incorrect password. Please try again!!")
            }
        } else {
            res.send("No Account exist with this email!!")
        }
    })

});



module.exports = router;