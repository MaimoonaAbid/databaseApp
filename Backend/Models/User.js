const { DataTypes } = require('sequelize');
const sequelize = require('../Configurations/squelize-db'); // Import your Sequelize instance here


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER, // Use INTEGER for auto-incrementing primary key
    primaryKey: true,
    autoIncrement: true, // Enable auto-increment
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // allowNull true because unique constraint is handled separately
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
  db_created: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Set to false by default
  },
  db_name: {
    type: DataTypes.STRING, // Assuming you want to store the database name as a string
    allowNull: true, // You can set it to allowNull true or false as per your requirements
  },
  otp: {
    type: DataTypes.STRING, // Assuming you want to store OTP as a string
    allowNull: true, // You can set it to allowNull true or false as per your requirements
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Set to false by default
  },
}); 

module.exports = User;
