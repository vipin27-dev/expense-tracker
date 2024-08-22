require('dotenv').config();
const Razorpay = require('razorpay');
const Order = require('../model/order');
const User = require('../model/user');
const Expense = require('../model/expenseDetail');
const sequelize = require('../util/database');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const amount = 50000; 
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    await Order.create({
      userId: req.userId,  
      orderId: order.id,
      status: 'PENDING',
    }, { transaction });

    await transaction.commit(); // Commit the transaction

    res.status(200).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.log(error);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { order_id, payment_id, status } = req.body;
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const order = await Order.findOne({ where: { orderId: order_id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save({ transaction });

    if (status === "SUCCESSFUL") {
      // Update the user to premium
      const user = await User.findByPk(req.userId, { transaction });  // Added transaction here
      user.isPremium = true;
      await user.save({ transaction });
    }

    await transaction.commit(); // Commit the transaction

    res.status(200).json({ success: true });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.log(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_expense']],
      include: [{
        model: Expense,
        attributes: []
      }],
      group: ['User.id'],
      order: [[sequelize.literal('total_expense'), 'DESC']]
    });

    // Map the users to handle null total_expense
    const leaderboard = users.map(user => ({
      id: user.id,
      name: user.name,
      totalExpense: user.dataValues.total_expense !== null ? parseFloat(user.dataValues.total_expense) : 0
    }));

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve leaderboard" });
  }
};
