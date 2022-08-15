// const flash = require('connect-flash/lib/flash');
const express = require('express');
// const { is } = require('express/lib/request');
const router = express.Router();
const flashMessage = require('../helpers/messenger');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Ticket = require('../models/Ticket');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

router.get('/picture', (req, res) => {
    res.render('user/profile/updatepicture');
});


router.get('/login', (req, res) => {
    res.render('user/login');
});

router.get('/register', (req, res) => {
    res.render('user/register');
});

router.get('/profile', (req, res) => {
    loggeduser = req.user
    Ticket.findAll({
        where: { 'CustomerID': '001' },
        raw: true
    })
        .then((ticket) => {
            if (loggeduser.accounttype == 'User') {
                res.render('user/profile/profile', { loggeduser, tickets : ticket, layout : 'usermain' });
            }
            else if (loggeduser.accounttype == 'Admin') {
                res.render('user/profile/profile', { loggeduser, tickets : ticket, layout : 'adminmain' });
            }        })
        .catch(err => console.log(err));
});

router.get("/profile/updateprofile/:id", function(req,res){
    loggeduser = req.user
    if (loggeduser.accounttype == 'User') {
        res.render('user/profile/updateprofile', { loggeduser, layout : 'usermain' });
    }
    else if (loggeduser.accounttype == 'Admin') {
        res.render('user/profile/updateprofile', { loggeduser, layout : 'adminmain' });
    }
});

router.post("/profile/updateprofile/:id", function(req,res){
    let name = req.body.name;
    let email = req.body.email;
    let phone_number = req.body.phone_number
    let gender = req.body.gender
    User.update( { name, email, phone_number, gender},
    { where: { id: req.params.id } }
    )
        .then((result) => {
        console.log(result[0] + ' profile updated');
        res.redirect('/user/profile');
        })
        .catch(err => console.log(err));
})

router.post('/register', async function (req, res) {
    let { name, email, password, password2 } = req.body;

    let isValid = true;
    if (password.length < 6 ) {
        flashMessage(res, 'error', 'Password must be at least 6 characters');
        isValid = false;
    }
    if (password != password2) {
        flashMessage(res, 'error', 'Passwords do not match');
        isValid = false;
    }
    if (!isValid) {
        res.render('user/register', {
            name, email
        });
        return;
    }

    try {
         // If all is well, checks if user is already registered
         let user = await User.findOne({ where: { email: email } });
         if (user) {
             // If user is found, that means email has already been registered
             flashMessage(res, 'error', email + ' already registered');
            res.render('user/register', {
                 name, email
             });
         }
         else {
             // Create new user record
             var salt = bcrypt.genSaltSync(10);
             var hash = bcrypt.hashSync(password, salt);
             // Use hashed password
             let user = await User.create({ name, email, password: hash, accounttype: 'User'});
             flashMessage(res, 'success', email + ' registered successfully');
             res.redirect('/user/login');
             }
        }
         catch (err) {
             console.log(err);
         }
});

router.post('/login', (req, res, next) => {
     passport.authenticate('local', {
     // Success redirect URL
     successRedirect: '/',
     // Failure redirect URL
     failureRedirect: '/user/login',
//     /* Setting the failureFlash option to true instructs Passport to flash
//     an error message using the message given by the strategy's verify callback.
//     When a failure occur passport passes the message object as error */
     failureFlash: true
     })(req, res, next);
 });

router.get('/logout', (req, res) => {
     req.logout();
     res.redirect('/');
 });



module.exports = router;