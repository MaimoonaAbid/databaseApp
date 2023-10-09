const express = require('express');
const cors = require('cors'); 
const app = express();
const bodyParser=require('body-parser')
// Requiring and execute db.js to establish the database connection
require('./Configurations/db');


// Enabling CORS for all routes
app.use(bodyParser.json())
app.use(cors());

// Defining routes
const userRoutes = require('./Routes/user'); // Importing user route
//const databaseRoutes = require('./Routes/database'); // Importing database route


// Defining middleware to set the Content-Type header for JSON responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

app.use('/api/user', userRoutes); 
//app.use('/api/database', databaseRoutes); // Mounting the database routes under /api/database

// Starting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
