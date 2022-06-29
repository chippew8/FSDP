const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Staff = db.define('staff',
    {
        title: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING(2000) },
        language: { type: Sequelize.STRING },
        subtitles: { type: Sequelize.STRING },
        classification: { type: Sequelize.STRING },
        duration: { type: Sequelize.INTEGER },
        dateRelease: { type: Sequelize.DATE },
        dateEnd: { type: Sequelize.DATE }
    });
    
module.exports = Staff;