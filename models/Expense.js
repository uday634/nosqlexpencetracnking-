const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    amount: Number,
    description: String,
    desType: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Expense',expenseSchema )

// // In your Expense model file (e.g., Expense.js)
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../util/sqlconfig');

// const Expense = sequelize.define('Expense', {
//   // Define Expense model attributes here, including userId as a foreign key
//   id:{
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull:false,
//     primaryKey: true
// },
// amount: Sequelize.INTEGER,
// description: Sequelize.STRING,
// desType: Sequelize.STRING

// });

// module.exports = Expense;

