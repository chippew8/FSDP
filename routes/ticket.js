const express = require('express')
const router = express.Router();
const moment = require('moment');
const Ticket = require('../models/Ticket');
const Showtime = require('../models/Showtime');
const flashMessage = require('../helpers/messenger');
const Promotion = require('../models/Promotion');
var title;
var branch;
var selectedSeat;
var updated_seats;
var no_of_Ticket;
var movieDate;
var movieTime;
var seats;
var showDateTime;
var iD;
// const ensureAuthenticated = require('../helpers/auth');

function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
       // if user is admin, go next
       if (req.user.accounttype == 'Admin') {
         return next();
       }
    }
    res.redirect('/');
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
       // if user is admin, go next
       if (req.user.accounttype == 'User' || req.user.accounttype == 'Admin') {
         return next();
       }
    }
    res.redirect('/');
}

router.get('/seats/:id', isLoggedIn, (req, res) => {
    Showtime.findAll({
        where: { 'id': req.params.id },
        raw: true
    })
        .then((showtime) => {
            movieDate = moment(showtime.showDateTime).format('YYYY-MM-DD');
            movieTime = moment(showtime.showDateTime).format('hh:mm:ss');
            if (req.user.accounttype == 'User') {
                res.render('ticket/seats', { showtime, layout : 'usermain' });
            }
            else if (req.user.accounttype == 'Admin') {
                res.render('ticket/seats', { showtime, layout : 'adminmain' });
            }
            else {
                flashMessage(res, 'error', 'Login first');
                res.redirect('movies/listMovies');
            }
        })
        .catch(err => console.log(err));
});


router.post('/seats/:id', (req, res) => {
    selectedSeat = req.body['selected-seats'];
    updated_seats = req.body['updated-seats'];
    seats = updated_seats;
    branch = req.body['branch'];
    title = req.body['title'];
    no_of_Ticket = req.body['noTicket'];
    console.log(no_of_Ticket)
    var price = no_of_Ticket * 9;
    iD = req.params.id;
    res.redirect('../payment');
});

router.get('/payment', isLoggedIn, (req, res) => {
    var price = no_of_Ticket * 9;
    if (req.user.accounttype == 'User') {
        res.render('ticket/payment', { price, branch, title, no_of_Ticket, movieDate, movieTime, layout : 'usermain' });
    }
    else if (req.user.accounttype == 'Admin') {
        res.render('ticket/payment', { price, branch, title, no_of_Ticket, movieDate, movieTime, layout : 'adminmain' });
    }  
});

router.post('/payment', (req, res) => {
    var customerID = req.user.id;
    showDateTime = movieDate + " " + movieTime;
    Ticket.create(
        {
            customerID, branch, title, showDateTime, selectedSeat
        }
    )
        .then((ticket) => {
            console.log(ticket.toJSON());
        })
        .catch(err => console.log(err))

    Showtime.update(
        { 'seat': seats },
        { where: { 'id': iD } }
    )
        .then((result) => {
            console.log(result[0] + ' showtime updated');
            res.redirect('/movie/listMovies');
        })
        .catch(err => console.log(err))
});

router.get('/listTicket', (req, res) => {
    Ticket.findAll({
        where: { 'CustomerID': req.user.id },
        raw: true
    })
        .then((ticket) => {
            if (req.isAuthenticated()) {
                // if user is admin, go next
                if (req.user.accounttype == 'Admin') {
                    res.render('movie/listMovies', { ticket, movieDate, movieTime, layout: 'adminmain'})
                }
                else if (req.user.accounttype == 'User') {
                    res.render('movie/listMovies', { ticket, movieDate, movieTime, layout: 'usermain'})
                }
            }
            else {
                res.render('ticket/listTicket', { ticket, movieDate, movieTime, layout: 'main' });
            }
            res.render('ticket/listTicket', { ticket, movieDate, movieTime });
        })
        .catch(err => console.log(err));
});

router.get('/deleteTicket/:id', async function (req, res) {
    try {
        let ticket = await Ticket.findByPk(req.params.id);
        if (!ticket) {
            flashMessage(res, 'error', 'Ticket not found');
            return;
        }
        title = ticket.title;
        showDateTime = ticket.showDateTime;
        selectedSeat = ticket.selectedSeat;
        branch = ticket.branch;
        let result = await Ticket.destroy({ where: { id: ticket.id } });
        console.log(result + ' ticket deleted');

        Showtime.findAll({
            where: { 'title': title, 'showDateTime':showDateTime, 'branch':branch },
            raw: true
        })
            .then((showtime) => {
                updated_seats = showtime[0].seat;
            })
            .catch(err => console.log(err));

        seats = updated_seats + "," + selectedSeat;
        Showtime.update(
            { 'seat': seats },
            { where: { 'title': title, 'showDateTime':showDateTime, 'branch':branch } }
        )
            .then((result) => {
                console.log(result[0] + ' showtime updated');
                res.redirect('/ticket/listTicket');
            })
            .catch(err => console.log(err))

    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;
