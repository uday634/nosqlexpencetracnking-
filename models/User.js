const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/sqlconfig');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    total_cost: Sequelize.INTEGER,
    password: Sequelize.STRING,
    ispremiumuser: Sequelize.BOOLEAN // Corrected data type to BOOLEAN
});

module.exports = User;
