const express = require('express');
const cors = require('cors'); 
const app = express();
const bodyParser=require('body-parser')
// Requiring and execute db.js to establish the database connection
//require('./Configurations/db');
// Enabling CORS for all routes
app.use(bodyParser.json())
app.use(
  cors({
    origin: '*', // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  })
);
// Defining routes
const userRoutes = require('./Routes/user'); 
app.use('/api/user', userRoutes); 
// Starting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
