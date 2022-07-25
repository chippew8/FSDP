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
    let duration = req.body.duration;
    Movie.create(
<<<<<<< HEAD
        {
            title, story, classification, language, subtitles,
            dateRelease
        }
=======
        { title, story, classification, duration, language, subtitles,
dateRelease }
>>>>>>> df79e96b61dcbe4972c93c52c0001e59d3d99e51
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
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;

    Movie.update(
        { title, story, classification, language, subtitles, dateRelease },
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

module.exports = router;