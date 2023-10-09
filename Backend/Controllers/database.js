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
    // Extract the admin's ID and username from the admin object
    const { id, name } = user;

    // Create a unique database name using the admin's username and ID
    const uniqueDbName = `${name}_${id}`;

    // Attempt to create the new database
    await db.none(`CREATE DATABASE $1:name;`, [uniqueDbName]);

    // Switch to the newly created database
    const newDb = pgp({ ...connection, database: uniqueDbName });

    // Create the 'cars' table within the new database
    await newDb.none(`
      CREATE TABLE cars (
        carName TEXT,
        carModel TEXT,
        carCc INT
      );
    `);

    // Update the db_created value for the admin to true
    user.db_created = true;
    await user.save();

    // Return a success message indicating that the database has been created
    return uniqueDbName; // Return only the unique database name
  } catch (error) {
    // Handle errors, e.g., database or table creation failure
    console.error('Database creation failed:', error);
    throw new Error('Database creation failed');
  } finally {
    // Release the database connection
    pgp.end();
  }
};
