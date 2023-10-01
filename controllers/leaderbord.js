const User = require('../models/User');
const Expense = require('../models/Expense'); // Corrected the import name
const sequelize = require('sequelize')
const Sequelize = require('../util/sqlconfig')


exports.getUserLeaderBoard = async (req, res) => {
  try {
    const user =await User.findAll();
    user.sort((a,b)=>b.total_cost-a.total_cost)
    res.json(user)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const { Op } = require('sequelize'); // Assuming you're using Sequelize for database operations

exports.daily = async (req, res) => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    // Assuming your Expense model and Sequelize instance are properly configured
    const expenses = await Expense.findAll({
      where: {
        UserId: req.user.userId,
        updatedAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    // Sort expenses by total_cost (assuming each expense has a total_cost property)
    expenses.sort((a, b) => b.total_cost - a.total_cost);

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  exports.montly = async (req, res) => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
  
      // Assuming your Expense model and Sequelize instance are properly configured
      const expenses = await Expense.findAll({
        where: {
          UserId: req.user.userId,
          updatedAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      // Sort expenses by total_cost (assuming each expense has a total_cost property)
      expenses.sort((a, b) => b.total_cost - a.total_cost);
  
      res.json(expenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  exports.yearly = async (req, res) => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 0, 1);
      const endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
  
      // Assuming your Expense model and Sequelize instance are properly configured
      const expenses = await Expense.findAll({
        where: {
          UserId: req.user.userId,
          updatedAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      // Sort expenses by total_cost (assuming each expense has a total_cost property)
      expenses.sort((a, b) => b.total_cost - a.total_cost);
  
      res.json(expenses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


