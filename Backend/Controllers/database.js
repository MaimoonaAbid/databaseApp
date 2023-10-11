const User = require('../Models/User');
const pgp = require('pg-promise')();

// Define your PostgreSQL connection configuration
const connection = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

const db = pgp(connection);

// Controller function to create a new database with the admin's username and id
exports.createAdminDatabase = async (user) => {
  try {
    
    const { id, name } = user;
    const uniqueDbName = `${name}_${id}`;

    // Creating the new database
    await db.none(`CREATE DATABASE $1:name;`, [uniqueDbName]);

    // Switching to the newly created database
    const newDb = pgp({ ...connection, database: uniqueDbName });

    // Creating the 'cars' table within the new database
    await newDb.none(`
      CREATE TABLE cars (
        carName TEXT,
        carModel TEXT,
        carCc INT
      );
    `);

    // Updating the db_created value for the admin to true
    user.db_created = true;
    await user.save();
 return uniqueDbName; 
  } 
  catch (error) {
    // Handle errors, e.g., database or table creation failure
    console.error('Database creation failed:', error);
    throw new Error('Database creation failed');
  } finally {
    // Release the database connection
    pgp.end();
  }
};
