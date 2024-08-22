const AWS = require('aws-sdk');
const { format } = require('date-fns');
const sequelize = require('../util/database');
const Expense = require('../model/expenseDetail');
const stringify = require('csv-stringify');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

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

exports.downloadExpenses = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const expenses = await Expense.findAll({ where: { userId } });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    // Convert expenses to CSV and upload to S3
    const csvString = await new Promise((resolve, reject) => {
      stringify(expenses.map(exp => ({
        amount: exp.amount,
        description: exp.description,
        type: exp.type,
        date: exp.date
      })), { header: true }, (err, output) => {
        if (err) reject(err);
        else resolve(output);
      });
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `expenses/${userId}/${Date.now()}.csv`,
      Body: csvString,
      ContentType: 'text/csv'
    };

    const s3Response = await s3.upload(params).promise();
    res.status(200).json({ fileUrl: s3Response.Location });
  } catch (error) {
    console.error('Error downloading expenses:', error.message);
    res.status(500).json({ message: "An error occurred while downloading expenses." });
  }
};
exports.addExpense = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const { amount, description, type } = req.body;
  if (!amount || !description || !type) {
    return res.status(400).json({ message: "Invalid expense data" });
  }

  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.create({ amount, description, type, userId }, { transaction });
    await transaction.commit();

    res.status(201).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: "An error occurred while adding the expense." });
  }
};

exports.updateExpense = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { amount, description, type } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({ where: { id, userId } });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount;
    expense.description = description;
    expense.type = type;
    await expense.save({ transaction });

    await transaction.commit();
    res.status(200).json(expense);
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating expense:", error.message);
    res.status(500).json({ message: "An error occurred while updating the expense." });
  }
};

exports.deleteExpense = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  const transaction = await sequelize.transaction();

  try {
    const expense = await Expense.findOne({ where: { id, userId } });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.destroy({ transaction });
    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ message: "An error occurred while deleting the expense." });
  }
};
