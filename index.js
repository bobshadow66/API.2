// Libs
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API URL from environment variables
const api = process.env.API_URL;
if (!api) {
    console.error("API_URL environment variable is not set.");
    process.exit(1);
}

// Routers
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'eshop-database',
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


