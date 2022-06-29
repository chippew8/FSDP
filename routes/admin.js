const flash = require('connect-flash/lib/flash');
const express = require('express');
const { is } = require('express/lib/request');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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

router.get('/userlist', isAdmin, (req, res) => {
    User.findAll({
        order: [['id', 'ASC']],
        raw: true
    })
        .then((users) => {
            // pass object to listVideos.handlebar
            res.render('admin/userlist', { users });
        })
        .catch(err => console.log(err));
});

router.get("/updateuser/:id", isAdmin, function(req,res){
    User.findByPk(req.params.id)
        .then((user) => {
            res.render('admin/updateuser', { user });
            })
        .catch(err => console.log(err));
});

router.post("/updateuser/:id",isAdmin, function(req,res){
    let name = req.body.name;
    let email = req.body.email;
    User.update( { name, email },
    { where: { id: req.params.id } }
    )
        .then((result) => {
        console.log(result[0] + ' User updated');
        res.redirect('/admin/userlist');
        })
        .catch(err => console.log(err));
})

router.get('/deleteuser/:id', isAdmin, async function (req, res) {
    try {
        let user = await User.findByPk(req.params.id);
        if (!user) {
        flashMessage(res, 'error', 'User not found');
        res.redirect('/admin/userlist');
        return;
        }
    let result = await User.destroy({ where: { id: user.id } });
    console.log(result + ' User deleted');
    res.redirect('/admin/userlist');
    }
    catch (err) {
    console.log(err);
    }
}
);


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
