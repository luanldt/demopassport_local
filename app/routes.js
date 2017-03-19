/**
 * Created by minhluan on 19/03/2017.
 */
module.exports = function(app, passport) {

    // HOME PAGE
    app.get('/', function(req, res) {
       res.render('index');
    });

    // LOGIN
    app.get('/login', function(req, res) {
       res.render('login', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))

    // SIGNUP
    app.get('/signup', function(req, res) {
       res.render('signup', { message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //PROFILE
    app.get('/profile', isLoggedIn, function(req, res) {
       res.render('profile', {
          user: req.user
       });
    });

    // LOGOUT
    app.get('/logout', function(req, res) {
       req.logout();
       res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}