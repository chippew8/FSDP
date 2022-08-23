const express = require('express');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const app = express();
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
	const title = 'Golden Dragon';
	Movie.findAll({
        order: [['createdAt', 'DESC']],
        raw: true
    })
        .then((movie) => {
                if (req.isAuthenticated()) {
					// if user is admin, go next
					if (req.user.accounttype == 'Admin') {
						app.set('view options', { layout: 'adminmain' });
						res.render('index', { title: title, movies: movie, layout: 'adminmain'})
					}
					else if (req.user.accounttype == 'User') {
						app.set('view options', { layout: 'usermmain' });
						res.render('index', { title: title, movies: movie, layout: 'usermain'})
					}
				}
				else {
					res.render('index', { title: title, movies : movie, layout: 'main' })
				}
            })
            .catch(err => console.log(err));
    });

router.get('/about', (req, res) => {
	const author = 'Ping Xuan';
	res.render('about', { author });
	});

router.post('/flash', (req, res) => {
	const message = 'This is an important message';
	const error = 'This is an error message';
	const error2 = 'This is the second error message';

	// req.flash('message', message);
	// req.flash('error', error);
	// req.flash('error', error2);

	flashMessage(res, 'success', message); 
	flashMessage(res, 'info', message); 
	flashMessage(res, 'error', error); 
	flashMessage(res, 'error', error2, 'fas fa-sign-in-alt', true);
	res.redirect('/about');
});
module.exports = router;
