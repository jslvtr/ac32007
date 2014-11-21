var apiRoutes   = require('./endpoints/api.js');
var authRoutes  = require('./endpoints/auth.js');
var userRoutes  = require('./endpoints/user.js');

module.exports = function(app, passport) {

    // Auth
    app.post('/auth/login', authRoutes.login);
    app.post('/auth/register', authRoutes.register);
    app.get('/auth/logout', authRoutes.logout);

    // API
    app.get('/', apiRoutes.about);

    // User
    app.get('/user/:id/profile',
        passport.authenticate('bearer', { session: false }),
        userRoutes.profile
    );

};
