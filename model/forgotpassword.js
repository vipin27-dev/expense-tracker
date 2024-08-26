const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 
const User = require('./user'); 

const ForgotPassword = sequelize.define('ForgotPassword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
    lowercase: true,
    validate: {
      isEmail: true,
    },
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'forgot_passwords',
});

// Define associations
User.hasMany(ForgotPassword, { foreignKey: 'userId' });
ForgotPassword.belongsTo(User, { foreignKey: 'userId' });

module.exports = ForgotPassword;
