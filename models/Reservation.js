const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Reservation = db.define('reservation',
    {
        headline: { type: Sequelize.STRING },
        description: { type: Sequelize.STRING(5000) },
        code: { type: Sequelize.STRING(12) },
    });
    
module.exports = Promotion;