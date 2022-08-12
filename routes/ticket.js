const express = require('express')
const router = express.Router();
const moment = require('moment');
const Ticket = require('../models/Ticket');
const flashMessage = require('../helpers/messenger');
const Promotion = require('../models/Promotion');
// const ensureAuthenticated = require('../helpers/auth');


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

router.get('/seats', isLoggedIn, (req, res) => {
    if (req.user.accounttype == 'User') {
        res.render('ticket/seats', {layout : "usermain"});
    }
    else if (req.user.accounttype == 'Admin') {
        res.render('ticket/seats', {layout : "adminmain"});
    }
});

router.post('/seats', async (req, res) => {
    let promocode = req.body.promocode;
    let promo = await Promotion.findOne({ where: { code: promocode } });
    let result = await Promotion.destroy({ where: { code: promocode } });
    console.log(promo);
    console.log(promocode);
    let selectedSeat = req.body.seats.toString();



    Ticket.create(
        { selectedSeat }
    )
        .then((ticket) => {
            console.log(ticket.toJSON());
            res.redirect('/ticket/listTickets');
        })
        .catch(err => console.log(err))
});

router.get('/listTickets', isLoggedIn, (req, res) => {
    Ticket.findAll({
        order: [['selectedSeat', 'DESC']],
        raw: true
    })
        .then((ticket) => {
            if (req.user.accounttype == 'User') {
                res.render('ticket/listTickets', { ticket , layout: 'usermain'});
            }
            else if (req.user.accounttype == 'Admin') {
                res.render('ticket/listTickets', { ticket , layout: 'adminmain'});
            }
        })
        .catch(err => console.log(err));
});

router.get('/deleteTicket/:id', async function (req, res) {
    try {
        let seat = await Ticket.findByPk(req.params.id);
        if (!seat) {
            flashMessage(res, 'error', 'Ticket not found');
            res.redirect('/ticket/listTickets');
            return;
        }
        let result = await Ticket.destroy({ where: { id: seat.id } });
        console.log(result + ' ticket cancelled');
        flashMessage(res, 'success', 'Ticket successfully cancelled.');
        res.redirect('/ticket/listTickets');
    }
    catch (err) {
        console.log(err);
    }
});


module.exports = router;