//npm install --save express
//npm install --save body-parser
//npm install --save mongoose

//MONGODB PW: 4X13Y00okreUjrDY
//MONGODB CONNECTION: mongodb+srv://Reinaldo:<password>@cluster0.1v62f.mongodb.net/<dbname>?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

//MongoDB Connection
mongoose.connect('mongodb+srv://Reinaldo:4X13Y00okreUjrDY@cluster0.1v62f.mongodb.net/<dbname>?retryWrites=true&w=majority',)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')})
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

//CORS Error - allow all requests from all origins to access the API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;