const LocalStrategyUser = require('passport-local').Strategy;
const LocalStrategyAdmin = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const User = require('../models/User');

function localStrategy(passport) {
    let tp = 'a';
    passport.use(
        new LocalStrategyUser({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ where: { email: email } })
                .then(User => {
                        if (!User) {
                            return done(null, false, { message: 'No Customer Found' });
                        }
                        // Match password
                        isMatch = bcrypt.compareSync(password, User.password);
                        if (!isMatch) {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                        return done(null, User);
                    })
            console.log('user search succ');
            }));
    // Serializes (stores) user id into session upon successful
    // authentication
        passport.serializeUser((User, done) => {
            // customer.id is used to identify authenticated user
            tp = User.accounttype;
            console.log(tp);
            done(null, User.id);
        });

        passport.deserializeUser((UserID, done) => {
            if (tp == 'User') {
                User.findByPk(UserID)
                .then((user) => {
                    done(null, user);
                    // user object saved in req.session
                })
                .catch((done) => {
                    // No user found, not stored in req.session
                    console.log(done);
                });
                console.log('user');
            }
            else if (tp == 'Admin') {
                User.findByPk(UserID)
                .then((admin) => {
                    done(null, admin);
                    // user object saved in req.session
                })
                .catch((done) => {
                    // No user found, not stored in req.session
                    console.log(done);
                });
                console.log('admin');
            }
        });
}
module.exports = { localStrategy };