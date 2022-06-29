const express = require('express')
const router = express.Router();
const moment = require('moment');
const Movie = require('../models/Movie')
// const ensureAuthenticated = require('../helpers/auth');

router.get('/listMovies', (req, res) => {
    Movie.findAll({
        order: [['dateRelease', 'DESC']],
        raw: true
    })
        .then((movie) => {
            res.render('movie/listMovies', { movie });
        })
        .catch(err => console.log(err));
});

router.get('/addMovie', (req, res) => {
    res.render('movie/addMovie');
});

router.post('/addMovie', (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    // Multi-value components return array of strings or undefined
    let subtitles = req.body.subtitles === undefined ? '' :
req.body.subtitles.toString();
    let classification = req.body.classification;
    Movie.create(
        { title, story, classification, language, subtitles,
dateRelease }
    )
     .then((movie) => {
        console.log(movie.toJSON());
        res.redirect('/movie/listMovies');
    })
    .catch(err => console.log(err))
});

module.exports = router;