const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


// Create videos table in MySQL Database
const Movie = db.define('movie',
    {
        title: { type: Sequelize.STRING,
                 primaryKey: true },
        story: { type: Sequelize.STRING(2000) },
        starring: { type: Sequelize.STRING },
        posterURL: { type: Sequelize.STRING },
        language: { type: Sequelize.STRING },
        subtitles: { type: Sequelize.STRING },
        classification: { type: Sequelize.STRING },
        duration: { type: Sequelize.INTEGER },
        dateRelease: { type: Sequelize.DATE }
    });
    
module.exports = Movie;