const sequelize  = require('../util/database'); // Import the sequelize instance
const Expense = require('../model/expenseDetail');

// Get all expenses for the logged-in user
exports.getAllExpenses = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const expenses = await Expense.findAll({ where: { userId } });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ message: "An error occurred while fetching expenses." });
  }
};

// Add a new expense for the logged-in user
exports.addExpense = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const { amount, description, type } = req.body;
  if (!amount || !description || !type) {
    return res.status(400).json({ message: "Invalid expense data" });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const expense = await Expense.create({ amount, description, type, userId }, { transaction });
    await transaction.commit(); // Commit the transaction

    res.status(201).json(expense);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: "An error occurred while adding the expense." });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { amount, description, type } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const expense = await Expense.findOne({ where: { id, userId } });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount;
    expense.description = description;
    expense.type = type;
    await expense.save({ transaction });

    await transaction.commit(); // Commit the transaction
    res.status(200).json(expense);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error("Error updating expense:", error.message);
    res.status(500).json({ message: "An error occurred while updating the expense." });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const expense = await Expense.findOne({ where: { id, userId } });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy({ transaction });
    await transaction.commit(); // Commit the transaction
    res.status(204).send();
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ message: "An error occurred while deleting the expense." });
  }
};
