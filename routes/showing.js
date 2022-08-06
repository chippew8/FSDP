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
    
        .then((movies) => {
            Cinema.findAll(
                
            )
                .then((cinemas)=> {
                    res.render('showing/addShowing', { movies, cinemas } )
                }

            );
        })
        .catch(err => console.log(err));
});

router.post('/addShowing', (req, res) => {
    let showday = req.body.showday;
    let showtime = req.body.showtime;
    // let movieId = req.body.movieid;
    // let cinemaId = req.body.cinemaid;
    Showing.create(
        { showday, showtime, 
            // cinemaId, movieId 
        }
    )
        .then((showing) => {
            console.log(showing.toJSON());
            res.redirect('/');
        })
        .catch(err => console.log(err))
});


module.exports = router;