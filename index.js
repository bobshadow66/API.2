const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API URL from environment variables
const api = process.env.API_URL;

// Routers
const productsRouter = require('./routers/product');
const categoriesRouter = require('./routers/category');
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'eshop-database'
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.log(err);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


