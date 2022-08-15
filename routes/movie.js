const { config } = require('dotenv');
const express = require('express')
const router = express.Router();
const moment = require('moment');
const Movie = require('../models/Movie')
require('dotenv').config();
const fetch = require('node-fetch');
const Showtime = require('../models/Showtime');
// const ensureAuthenticated = require('../helpers/auth');

router.get('/listMovies', (req, res) => {
    Movie.findAll({
        order: [['dateRelease', 'DESC']],
        raw: true
    })
        .then(
            Showtime.findAll({})
        )
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
    let posterURL = req.body.posterURL;
    let language = req.body.language.toString();
    // Multi-value components return array of strings or undefined
    let subtitles = req.body.subtitles === undefined ? '' :
        req.body.subtitles.toString();
    let classification = req.body.classification;
    let duration = req.body.duration;
    let genre = req.body.genre;
    let seat = "A1,A2,A3,A4,A5,A6,B1,B2,B3,B4,B5,B6,C1,C2,C3,C4,C5,C6";
    var branch;
    var showDateTime;
    
    for (var i of ["Tampines", "Bedok", "Yishun", "Woodlands"]){
        for (var j of ["2022-09-22", "2022-09-23", "2022-09-24", "2022-09-25", "2022-09-26", "2022-09-27", "2022-09-28", "2022-09-29"]) {
            for (var s of ["11:00:00", "14:00:00", "17:00:00", "17:30:00", "19:30:00", "20:00:00", "21:30:00", "20:30:00"]) {
                branch = i;
                showDateTime = `${j} ${s}`;
                // showDateTime = moment.utc().format('YYYY-MM-DD HH:mm:ss');
                console.log(showDateTime);
                Showtime.create(
                    {
                        branch, title, showDateTime, seat
                    }
                )
                    .then((showtime) => {
                        console.log(showtime.toJSON());
                    })
                    .catch(err => console.log(err))
            }
        }
      }
      
    Movie.create(
        {
            title, story, classification, duration, language, subtitles, genre, posterURL,dateRelease
        }
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

router.get('/deleteMovie/:id', async function (req, res) {
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

router.get('/omdb', (req, res) => {
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