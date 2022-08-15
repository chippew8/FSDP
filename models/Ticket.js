const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Ticket = db.define('ticket',
    {
        customerID: { type: Sequelize.STRING(3) },
        branch: { type: Sequelize.STRING },
        title: { type: Sequelize.STRING },
        showDateTime: { type: Sequelize.DATE },
        selectedSeat: { type: Sequelize.STRING }
    });
    
module.exports = Ticket;