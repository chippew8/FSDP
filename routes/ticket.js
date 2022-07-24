const express = require('express')
const router = express.Router();
const moment = require('moment');
const Ticket = require('../models/Ticket');
const flashMessage = require('../helpers/messenger');
const Promotion = require('../models/Promotion');
// const ensureAuthenticated = require('../helpers/auth');


router.get('/seats', (req, res) => {
    res.render('ticket/seats');
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

router.get('/listTickets', (req, res) => {
    Ticket.findAll({
        order: [['selectedSeat', 'DESC']],
        raw: true
    })
        .then((ticket) => {
            res.render('ticket/listTickets', { ticket });
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