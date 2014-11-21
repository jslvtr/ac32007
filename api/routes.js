var apiRoutes   = require('./endpoints/api.js');
var authRoutes  = require('./endpoints/auth.js');
var userRoutes  = require('./endpoints/user.js');

module.exports = function(app, passport) {

    // Auth
    app.post('/auth/login', authRoutes.login);
    app.post('/auth/register', authRoutes.register);
    app.get('/auth/logout',
        passport.authenticate('bearer', { session: false }),
        authRoutes.logout
    );

    app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: [] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { session: false }),
        authRoutes.facebook
    );

    // API
    app.get('/', apiRoutes.about);
    app.get('/headers', apiRoutes.headers);

    // User
    app.get('/user/:username/profile',
        passport.authenticate('bearer', { session: false }),
        userRoutes.profile
    );

};
