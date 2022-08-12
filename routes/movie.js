const express = require('express')
const router = express.Router();
const moment = require('moment');
const Movie = require('../models/Movie')
const Cinema = require('../models/Cinema')
const Showing = require('../models/Showing')
const ensureAuthenticated = require('../helpers/auth');
require('dotenv').config();
const fetch = require('node-fetch');

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

router.get('/listMovies', (req, res) => {
    Movie.findAll({
        order: [['dateRelease', 'DESC']],
        raw: true
    })
        .then((movie) => {
            if (req.user.accounttype == 'Admin') {
                res.render('movie/listMovies', { movie, layout: 'adminmain' });
            }
            else if (req.user.accounttype == 'User') {
                res.render('movie/listMovies', { movie, layout: 'usermain' });
            }
        })
        .catch(err => console.log(err));
 
});

router.get('/addMovie', (req, res) => {
    if (req.user.accounttype == 'Admin') {
        res.render('movie/addMovie', { layout: 'adminmain' });
    }
    else if (req.user.accounttype == 'User') {
        res.render('movie/addMovie', { layout: 'usermain' });
    }
});

router.post('/addMovie', (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let posterURL = req.body.posterURL;
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language === undefined ? '':
        req.body.language.toString();
    // Multi-value components return array of strings or undefined
    let subtitles = req.body.subtitles === undefined ? '' :
        req.body.subtitles.toString();
    let classification = req.body.classification;
    let duration = req.body.duration;
    let genre = req.body.genre
    Movie.create(
        { title, story, posterURL, classification, duration, genre, language, subtitles, dateRelease }
    )
        .then((movie) => {
            console.log(movie.toJSON());
            res.redirect('/movie/listMovies');
        })
        .catch(err => console.log(err))
});

router.get('/editMovie/:id', (req, res) => {
    Movie.findByPk(req.params.id)
        .then((movie) => {
            res.render('movie/editMovie', { movie });
        })
        .catch(err => console.log(err));
});

router.post('/editMovie/:id', (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let posterURL = req.body.posterURL;
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language === undefined ? '':
        req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' :
        req.body.subtitles.toString();
    let classification = req.body.classification;
    let duration = req.body.duration;
    let genre = req.body.genre
    Movie.update(
        { title, story, posterURL, classification, duration, genre, language, subtitles, dateRelease },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' movie updated');
            res.redirect('/movie/listMovies');
        })
        .catch(err => console.log(err));
});

router.get('/deleteMovie/:id', async function(req, res) {
    try {
            let movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            flashMessage(res, 'error', 'Movie not found');
            res.redirect('/video/listVideos');
            return;
        }
        // if (req.user.id != video.userId) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/video/listVideos');
        //     return;
        // }   
        let result = await Movie.destroy({ where: { id: movie.id } });
        console.log(result + ' movie deleted');
        res.redirect('/movie/listMovies');
    }
    catch (err) {
        console.log(err);   
    }
});

router.get('/omdb', ensureAuthenticated, (req, res) => {
    let apikey = process.env.OMDB_API_KEY;
    let title = req.query.title;
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apikey}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        res.json(data);
    });
});
    

module.exports = router;