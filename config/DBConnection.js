const mySQLDB = require('./DBConfig');
const Cinema = require('../models/Cinema');
const Movie = require('../models/Movie');
const Ticket = require('../models/Ticket');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Showing = require('../models/Showing');



// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Database connected');
            /*
            Defines the relationship where a cinema has many movies/ all movies.
            The primary key from user will be a foreign key in video.
            */
            Cinema.hasMany(Showing);
            Showing.belongsTo(Cinema);
            Movie.hasMany(Showing);
            Showing.belongsTo(Movie);
            Showing.hasMany(Ticket);
            mySQLDB.sync({
                force: drop
            });
        })
        .catch(err => console.log(err));
};


module.exports = { setUpDB };