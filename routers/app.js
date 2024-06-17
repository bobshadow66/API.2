const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const mongoose = require('mongoose'); 
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use((err, req, res, next) => { 
    if (err) {
        res.status(500).json({ message: "error in the server" });
    } else {
        next();
    }
});

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
