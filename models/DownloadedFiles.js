// In your Expense model file (e.g., Expense.js)
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/sqlconfig');

const DownloadedFiles = sequelize.define('DownloadedFiles', {
  // Define Expense model attributes here, including userId as a foreign key
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull:false,
    primaryKey: true
},
link: Sequelize.STRING,
UserId: Sequelize.STRING

});

module.exports = DownloadedFiles;

