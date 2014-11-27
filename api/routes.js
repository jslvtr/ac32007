var apiRoutes               = require('./endpoints/api.js');
var authRoutes              = require('./endpoints/auth.js');
var userRoutes              = require('./endpoints/user.js');
var projectRoutes           = require('./endpoints/project.js');
var projectUserRoutes       = require('./endpoints/project_users.js');
var endpointRoutes          = require('./endpoints/endpoints.js');
var endpointCategoryRoutes  = require('./endpoints/endpoint_categories.js');
var queryRoutes             = require('./endpoints/query.js');

var projectsRoom             = require('./sockets/projects.js');

module.exports = function(app, io, passport) {

    // Socket
    io.on('connection', function (socket) {
        socket.on('project', function (data) {
            projectsRoom.on(io, socket, data.access_token, data.project, data.owner, data.error, data.message);
        });
    });

    // Auth
    app.post('/auth/login', authRoutes.login);
    app.post('/auth/register', authRoutes.register);
    app.get('/auth/logout',
        passport.authenticate('bearer', { session: false }),
        authRoutes.logout
    );
    app.delete('/auth/delete',
        passport.authenticate('bearer', { session: false }),
        authRoutes.deleteUser
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


    /*
                Project Users

            Handling of users of projects
            Includes:
                - Inviting of users
                - Gettings users of defined project
     */
    /*
    app.get('/user/:user/project/:id/invite/:invite',                          //Display the invite acceptance page to confirm invite
        passport.authenticate('bearer', { session: false }),
        projectRoutes.projectGetID
    );
    */
    app.post('/user/:owner/project/:project/invite/:user',                          //Invite a user
        passport.authenticate('bearer', { session: false }),
        projectUserRoutes.projectInviteTarget
    );

    app.delete('/user/:owner/project/:project/remove/:user',                          //remove a user
        passport.authenticate('bearer', { session: false }),
        projectUserRoutes.projectRemoveTarget
    );

    app.get('/user/:owner/project/:project/invite/:user/accept/:secret',
        projectUserRoutes.projectInviteAccept
    );

    app.get('/user/:owner/project/:project/members',
        projectUserRoutes.projectGetMembers
    );




    /*

                    Endpoints

            These routes handle endpoints in projects

     */



    app.post('/user/:owner/project/:project/endpoint',
        passport.authenticate('bearer', { session: false }),
        function (req, res) {
            endpointRoutes.endpointAdd(req, res, io);
        }
    )

    app.get('/user/:owner/project/:project/endpoint',
        passport.authenticate('bearer', { session: false }),
        endpointRoutes.endpointGetAll
    )

    app.get('/user/:owner/project/:project/endpoint/:id',
        passport.authenticate('bearer', { session: false }),
        endpointRoutes.endpointGet
    )

    app.put('/user/:owner/project/:project/endpoint/:id',
        passport.authenticate('bearer', { session: false }),
        function (req, res) {
            endpointRoutes.endpointUpdate(req, res, io);
        }
    )

    app.delete('/user/:owner/project/:project/endpoint/:id',
        passport.authenticate('bearer', { session: false }),
        function (req, res) {
            endpointRoutes.endpointDel(req, res, io);
        }
    )


    /*

                endpointCategoryRoutes
           Handles the handling of categories with endpoints

     */


    app.put('/user/:owner/project/:project/endpoint/:id/category/:category/add',
        passport.authenticate('bearer', { session: false }),
        function (req, res) {
            endpointCategoryRoutes.endpointAddCategory(req, res, io);
        }

    )

    app.delete('/user/:owner/project/:project/endpoint/:id/category/:category/remove',
        passport.authenticate('bearer', { session: false }),
        function (req, res) {
            endpointCategoryRoutes.endpointRemoveCategory(req, res, io);
        }

    )



    /*

                    Querying
        Handling of doing querying with endpoints

     */

    app.post('/run/:id',
        passport.authenticate('bearer', { session: false }),        //queries using endpoint token
        queryRoutes.query
    )

    app.get('/run/logs/:id',                                            //gets logs for that endpoint token
        passport.authenticate('bearer', { session: false }),
        queryRoutes.getLogs
    )

};
