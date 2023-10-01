// models/orders.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/sqlconfig');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    paymentid:{
        type: DataTypes.STRING
    },
    orderid: {
        type: DataTypes.STRING, // Adjust the data type as per your requirements
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Order;
