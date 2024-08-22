const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token, message: "User login successful" });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

// Signup function
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during signup.' });
  }
};
