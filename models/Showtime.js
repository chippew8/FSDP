const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Showtime = db.define('showtime',
    {
        branch: { type: Sequelize.STRING},
        title: { type: Sequelize.STRING},
        showDateTime: { type: Sequelize.DATE },
        seat: { type: Sequelize.STRING(100) },
    });
    
module.exports = Showtime;