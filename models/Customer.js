const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Customer = db.define('customer',
    {
        name: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        phone_number: { type: Sequelize.INTEGER },
        password: { type: Sequelize.STRING }
    });
    
module.exports = Customer;