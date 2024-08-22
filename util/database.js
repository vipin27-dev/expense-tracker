const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-finish','root','Vip@2706',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports=sequelize;