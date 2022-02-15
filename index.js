// Importing Required Modules
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const app = express();

// Connecting to the MongoDB database
connection();

// Congigure Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

// Configuring Routers
app.use("/user", userRouter);
app.use("/admin", adminRouter);


// Get Request to "/"
app.get('/', (req, res) => {
    res.send("Website is Up and Running");
});

app.use(function (req, res, next) {
    res.status(404);
    res.send('Not found 404');
});

// Listening on this Port
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server listening on port " + port);
    console.log(process.env.DOMAIN);
})