const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

// Create videos table in MySQL Database
const Ticket = db.define('ticket',
    {
        selectedSeat: { type: Sequelize.STRING }
    });
    
module.exports = Ticket;