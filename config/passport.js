var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport) {

    // passport session setup
    // required for persistent login sessions

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
           done(err, user);
        });
    });

    //local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({'local.email': email}, function(err, user) {
                if(err) {
                    return done(err);
                }
                if(user) {
                    return done(null, false, req.flash('signupMessage',  'That email is already taken.'))
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if(err) throw err;
                        return done(null, newUser);
                    })
                }
            })
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({'local.email':email}, function(err, user) {
            if(err) return done(err);
            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No user found!'));
            }
            if(!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Opps! Wrong password'))
            }

            return done(null, user);
        })
    }));

};