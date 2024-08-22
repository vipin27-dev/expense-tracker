const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, message: "User login successful" });
  } catch (error) {
    console.error('Error during login:', error.message); // Log detailed error message
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

// Signup function
exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error.message); // Log detailed error message
    return res.status(500).json({ success: false, message: 'An error occurred during signup.' });
  }
};
