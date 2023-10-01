// In your Expense model file (e.g., Expense.js)
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/sqlconfig');

const Expense = sequelize.define('Expense', {
  // Define Expense model attributes here, including userId as a foreign key
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull:false,
    primaryKey: true
},
amount: Sequelize.INTEGER,
description: Sequelize.STRING,
desType: Sequelize.STRING

});

module.exports = Expense;

