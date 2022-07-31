const mySQLDB = require('./DBConfig');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Ticket = require('../models/Ticket');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Showtime = require('../models/Showtime');



// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /*
            Defines the relationship where a cinema has many movies/ all movies.
            The primary key from user will be a foreign key in video.
            */
            Cinema.hasMany(Movie);
            Cinema.belongsTo(Movie);
            Movie.hasMany(Cinema);
            Movie.belongsTo(Cinema);
            Cinema.hasMany(Showtime);
            Movie.hasMany(Showtime);
            Showtime.hasMany(Ticket);
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};


module.exports = { setUpDB };