const mySQLDB = require('./DBConfig');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Ticket = require('../models/Ticket');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');



// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /*
            Defines the relationship where a user has many videos.
            The primary key from user will be a foreign key in video.
            */
            Cinema.hasMany(Movie);
            Movie.belongsTo(Cinema);
            Ticket.belongsTo(Movie);
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};


module.exports = { setUpDB };