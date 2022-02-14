require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connection = require('./db');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');


const app = express();
connection();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use("/user", userRouter);
app.use("/admin", adminRouter);


app.get('/', (req, res) => {
    res.send("Server is Running");
})






const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Server listening on port " + port);
    console.log(process.env.DOMAIN);
})