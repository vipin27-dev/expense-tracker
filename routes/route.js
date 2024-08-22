require('dotenv').config(); 
const express = require("express");
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expense"); 
const premiumController = require("../controllers/premiumController"); 
const passwordController = require('../controllers/passwordController');
const authMiddleWare = require('../middleWare/auth');
const router = express.Router();

// User routes
router.post("/signup", (req, res) => {
  userController.signupUser(req, res);
});

router.post("/login", (req, res) => {
  userController.loginUser(req, res);
});

// Expense routes
router.get("/add-expense", authMiddleWare, (req, res) => {
  expenseController.getAllExpenses(req, res);
});

router.post("/add-expense", authMiddleWare, (req, res) => {
  expenseController.addExpense(req, res);
});

router.put("/add-expense/:id", authMiddleWare, (req, res) => {
  expenseController.updateExpense(req, res);
});

router.delete("/add-expense/:id", (req, res) => {
  expenseController.deleteExpense(req, res);
});

// Premium routes
router.post("/purchase/premium", authMiddleWare, (req, res) => {
  premiumController.createOrder(req, res);
});


router.post("/purchase/update", authMiddleWare, (req, res) => {
  premiumController.updateOrderStatus(req, res);
});

router.get("/premium-status", authMiddleWare,(req,res)=>{
  premiumController.createOrder(req,res);
})
router.get("/leaderboard",authMiddleWare,(req,res)=>{
  premiumController.getLeaderboard(req,res);
})

router.post('/password/forgotpassword',(req,res)=>{
  passwordController.forgotPassword(req,res);
})

router.get('/api/download-expenses',authMiddleWare,(req,res)=>{
  expenseController.downloadExpenses(req,res);
})
module.exports = router;
