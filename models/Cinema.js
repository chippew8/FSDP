const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


// Create videos table in MySQL Database
const Cinema = db.define('cinema',
    {
        branch: { type:Sequelize.STRING },
        branchCode: { type:Sequelize.STRING(2),
                      primaryKey: true }
    });
    
module.exports = Cinema;