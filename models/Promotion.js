const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Promotion = db.define('promotion',
    {
        headline: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING(5000) },
        code: { type: Sequelize.STRING(12) },
    });
    
module.exports = Promotion;