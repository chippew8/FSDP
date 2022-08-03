const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Showing = db.define('showing',
    {
        showday: { type: Sequelize.DATEONLY },
        showtime: { type: Sequelize.TIME }

    });
    
module.exports = Showing;