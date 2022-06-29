// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
// const Customer = require('../models/Customer');

// function localStrategy(passport) {
//     passport.use(
//         new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//             Customer.findOne({ where: { email: email } })
//                 .then(customer => {
//                         if (!customer) {
//                             return done(null, false, { message: 'No Customer Found' });
//                         }
//                         // Match password
//                         isMatch = bcrypt.compareSync(password, customer.password);
//                         if (!isMatch) {
//                             return done(null, false, { message: 'Password incorrect' });
//                         }
//                         return done(null, customer);
//                     })
//             }));
//     // Serializes (stores) user id into session upon successful
//     // authentication
//     passport.serializeUser((customer, done) => {
//         // customer.id is used to identify authenticated user
//         done(null, customer.id);
//     });

//     // User object is retrieved by userId from session and
//     // put into req.user
//     passport.deserializeUser((customerId, done) => {
//         User.findByPk(customerId)
//             .then((customer) => {
//                 done(null, customer);
//                 // user object saved in req.session
//             })
//             .catch((done) => {
//                 // No user found, not stored in req.session
//                 console.log(done);
//             });
//     });
// }
// module.exports = { localStrategy };