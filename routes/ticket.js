const express = require('express')
const router = express.Router();
const moment = require('moment');
// const ensureAuthenticated = require('../helpers/auth');


router.get('/seats', (req, res) => {
    res.render('ticket/seats');
});

module.exports = router;