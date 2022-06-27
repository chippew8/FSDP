const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Movie = db.define('movie',
    {
        title: { type: Sequelize.STRING },
        story: { type: Sequelize.STRING(2000) },
        language: { type: Sequelize.STRING },
        subtitles: { type: Sequelize.STRING },
        classification: { type: Sequelize.STRING },
        dateRelease: { type: Sequelize.DATE }
    });
    
module.exports = Movie;