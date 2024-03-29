const mySQLDB = require('./DBConfig');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Ticket = require('../models/Ticket');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
// const Showtime = require('../models/Showtime');



// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};


module.exports = { setUpDB };