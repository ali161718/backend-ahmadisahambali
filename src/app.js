const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoutes');
const authRoute = require('../src/routes/auth');
const verifyToken = require('./validations/validationToken');
require('dotenv/config');

app.use(bodyParser.json());
app.use('/auth', authRoute);
app.use('/', verifyToken, userRoute);

mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(!err) {
            console.log("Success");
        } else {
            console.log("Error Connection");
        }
    }
);

// start listening to server
app.listen(3000);