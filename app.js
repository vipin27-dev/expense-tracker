require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const userRoutes = require("./routes/route");

const app = express();
console.log('JWT Secret:', process.env.JWT_SECRET);

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', userRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/add-expense', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

app.get('/premiumuser.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'premiumUser.html'));
});


app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});


app.use((err, req, res, next) => {
  console.error('Unexpected error:', err); 
  res.status(500).send('Something went wrong!');
});


sequelize.sync({ alter: true })  
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch(err => {
    console.error('Error synchronizing the database:', err);
  });
