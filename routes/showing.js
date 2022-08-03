const express = require('express')
const router = express.Router();
const Movie = require('../models/Movie')
const Cinema = require('../models/Cinema')
const Showing = require('../models/Showing')

router.get('/addShowing', (req, res) => {
    Movie.findAll({
        order: [['dateRelease', 'DESC']],
        raw: true
    })
    Cinema.findAll({
        raw: true
    })
        .then((movie,cinema) => {
            res.render('showing/addShowing', { movie }, { cinema });
        })
        .catch(err => console.log(err));
});

router.post('/addShowing', (req, res) => {
    let showday = req.body.showday;
    let showtime = req.body.showtime;
    let movieid = req.body.movieid
    Showing.create(
        { showday,showtime,movieid }
    )
        .then((showing) => {
            console.log(showing.toJSON());
            res.redirect('/');
        })
        .catch(err => console.log(err))
});


module.exports = router;