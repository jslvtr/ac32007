var apiRoutes        = require('./endpoints/api.js');
var authRoutes       = require('./endpoints/auth.js');
var userRoutes       = require('./endpoints/user.js');
var projectRoutes    = require ('./endpoints/project.js');

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
    app.get('/get', apiRoutes.methodGet);
    app.get('/do_dododo', apiRoutes.do_dododo);

    // User
    app.get('/user/:username/profile',
        passport.authenticate('bearer', { session: false }),
        userRoutes.profile
    );

    /*

                    Project

        Routes
            /project
            /user/:user/project/:project

        Where
            :user is username
            :project is project title

    */

    app.get('/user/:user/project',                              //Gets all projects of that user
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectGet
    );

    app.post('/project',                                        //Creates a new project with that user as the creator
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectAdd
    );
    app.put('/user/:user/project/:id',                          //Updates project data
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectUpdate
    );
    app.delete('/user/:user/project/:id',                       //Deletes the project providing that creator sent the request
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectDelete
    );
    app.get('/user/:user/project/:id',                          //Return project data
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectGetID
    );
};
