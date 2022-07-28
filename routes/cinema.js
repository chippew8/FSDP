const express = require('express')
const router = express.Router();

const Cinema = require('../models/Cinema')

router.get('/addCinema', (req, res) => {
    res.render('cinema/addCinema');
});

router.post('/addCinema', (req, res) => {
    let branch = req.body.branch;
    let branchCode = req.body.branchCode.slice(0,3);
    
    Cinema.create(
        { branch, branchCode }
    )
        .then((cinema) => {
            console.log(cinema.toJSON());
            res.redirect('/');
        })
        .catch(err => console.log(err))
});

module.exports = router;