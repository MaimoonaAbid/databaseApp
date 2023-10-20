const { DataTypes } = require('sequelize');
const sequelize = require('../Configurations/squelize-db'); // Import your Sequelize instance here


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, 
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
    defaultValue: false, 
  },
  db_name: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  otp: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  spaceneeded: {
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
}); 

module.exports = User;
