const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nocache = require('nocache');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}));

app.use(nocache());

 
// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static files 
app.use('/static', express.static(path.join(__dirname, 'Public/Styles')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UMS', {
}).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.log('Database connection error:', error);
});
   
// routes
const router = require('./Routes/router');
app.use('/', router);



const port = 3000;
app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
}); 
 
