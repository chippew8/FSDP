const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


// Create videos table in MySQL Database
const Cinema = db.define('cinema',
    {
        branch: { type:Sequelize.STRING },
        branchCode: { type:Sequelize.STRING(3) }
    });
    
module.exports = Cinema;