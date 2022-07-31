const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Showtime = db.define('showtime',
    {
        branch: { type:Sequelize.STRING },
        title: { type: Sequelize.STRING },
        showday: { type: Sequelize.DATEONLY },
        showtime: { type: Sequelize.TIME }
    });
    
module.exports = Showtime;