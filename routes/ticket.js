const express = require('express')
const router = express.Router();
const moment = require('moment');
const Ticket = require('../models/Ticket');
const Showtime = require('../models/Showtime');
const flashMessage = require('../helpers/messenger');
const Promotion = require('../models/Promotion');
var Title;
var DateRelease;
var Branch;
var updated_seats;
var no_of_Ticket;
// const ensureAuthenticated = require('../helpers/auth');


router.get('/seats', (req, res) => {
    Showtime.findAll({
        where: { 'branch': 'Tampines' },
        raw: true
    })
        .then((showtime) => {
            res.render('ticket/seats', { showtime });
        })
        .catch(err => console.log(err));
});


router.post('/seats', (req, res) => {
    let selected_seats = req.body['selected-seats'];
    updated_seats = req.body['updated-seats'];
    let seats = updated_seats.toString();
    Branch = req.body['branch'];
    Title = req.body['title'];
    DateRelease = "2022-09-21"
    no_of_Ticket = req.body['noTicket'];

    Showtime.update(
        { 'seat' :seats },
        { where: { 'branch' : 'Bedok' } }
    )
        .then(() => {
            res.redirect('payment');
        })
        .catch(err => console.log(err));
    // let story = req.body.story.slice(0, 1999);
    // let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
});

router.get('/payment', (req, res) => {
    var price = no_of_Ticket * 9;
    console.log(Title);
    res.render('ticket/payment', { price, Title, no_of_Ticket });
});

router.post('/payment', (req, res) => {

    Showtime.update(
        { 'seat' :seats },
        { where: { 'branch' : 'Bedok' } }
    )
        .then((result) => {
            console.log(result[0] + ' showtime updated');
            res.redirect('/movie/listMovies');
        })
        .catch(err => console.log(err));
    // let story = req.body.story.slice(0, 1999);
    // let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
});

module.exports = router;