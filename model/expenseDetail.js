const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expenses', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: { 
    type: Sequelize.DATE, 
    allowNull: true, 
  },
  userId: { // Adding the userId field
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { // Define the foreign key relationship
      model: 'Users', // Name of the related table
      key: 'id', // Key in the related table
    },
  },
});

module.exports = Expense;
