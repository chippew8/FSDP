const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Cinema = db.define('cinema',
    {
        branch: { type:Sequelize.STRING },
    });
    
module.exports = Cinema;