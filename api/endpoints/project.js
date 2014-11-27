var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');

function projectGet(req, res) {
    //Gets the information from the uri
    var owner = req.params.user;
    var query = 'select title, description, owner from agile_api.projects where owner = ? allow filtering;';
    var params = [ owner ];

    configDB.client.execute(query, params, {prepare: true}, function (err, result) {
        if (err) {
            res.json(HttpStatus.METHOD_FAILURE, {
                status: 420,
                message: 'Can\'t find project.'
            });
        } else if (result.rows["0"] != null) {
            var jsonResult = [];

            for (var row in result.rows) {
                jsonResult.push({
                    title: result.rows[row].title,
                    description: result.rows[row].description,
                    owner: result.rows[row].owner
                });
            }
            res.json(HttpStatus.OK, {
                status: 200,
                projects: jsonResult
            });

        } else {
            res.json(HttpStatus.NOT_FOUND, {
                status: 404,
                project: "Project not found"
            });
        }
    });
}

function projectGetID(req, res) {
    //Gets the information from the uri
    var title = req.params.id;
    var owner = req.params.user;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        var query = 'select * from agile_api.projects where title = ? and owner = ?;';
        var params = [ title, owner ];
        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create project.'
                    });
                } else if (result.rows["0"] != null) {
                    res.json(HttpStatus.OK, {
                        status: 200,
                        project: {
                            title: result.rows[0].title,
                            description: result.rows[0].description,
                            owner: result.rows[0].owner
                        }
                    });

                } else {
                    res.json(HttpStatus.NOT_FOUND, {
                        status: 404,
                        project: "Project not found"
                    });
                }
            }
        );
    } else {
        res.json(HttpStatus.FORBIDDEN, {
            status: 403,
            message: 'Forbidden'
        });
    }
}

/*
 projectUpdate

 Updates the description of the project
 Gets the title and owner from url and description from header
 TODO Change the project name, limited to access by owner

 */
function projectUpdate(req, res) {

    //Gets the information from the uri
    var title = decodeURIComponent(req.params.id);
    var owner = req.params.user;
    var description = req.body.description;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        var query = 'update agile_api.projects set description = ? where title = ? and owner = ?;';
        var params = [description, title, owner];

        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Can\'t update project.'
                });

            } else {
                res.json(HttpStatus.ACCEPTED, {
                    status: 202,
                    message: 'Project updated',
                    project: {
                        title: title,
                        description: description,
                        owner: owner
                    }
                });
            }
        });
    } else {
        res.json(HttpStatus.FORBIDDEN, {
            status: 403,
            message: 'Forbidden'
        });
    }
}

/*
 projectDelete

 Delete the project from the users project list

 */

function projectDelete(req, res) {

    //Gets the information from the uri
    var title = decodeURIComponent(req.params.id);
    var owner = req.params.user;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        var query = 'delete from agile_api.projects where title = ? and owner = ?;';
        var params = [ title, owner ];


        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t delete project.'
                    });
                } else {
                    deleteAllProjectMembers(title, owner, function (err, status) {
                        if (status == 202) {
                            res.json(HttpStatus.ACCEPTED, {
                                status: 202,
                                message: 'Project deleted'
                            });
                        } else {
                            res.json(HttpStatus.CONFLICT, {
                                status: 409,
                                message: 'Error deleting project members'
                            });
                        }
                    });
                }
            }
        );
    } else {
        res.json(HttpStatus.FORBIDDEN, {
            status: 403,
            message: 'Forbidden'
        });
    }


}

function deleteAllProjectMembers(title, owner, callback) {
    var query = 'delete from agile_api.project_members where project_id = ? and owner_id = ?;';
    var params = [ title, owner ];

    configDB.client.execute(query, params, {prepare: true}, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, 420);
        } else {
            callback(err, 202);
        }
    });
}
/*
 projectAdd

 Adds a new project for that user


 */

function projectAdd(req, res, io) {
    var title = req.body.title.split(' ').join('_');
    var description = req.body.description;
    var owner = req.body.owner;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        var query = 'insert into agile_api.projects (title, description, owner) values (?, ?, ?) IF NOT EXISTS;';
        var params = [ title, description, sessionUser.username ];

        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create project.'
                    });
                } else if (result.rows["0"]["[applied]"] === true) {
                    var query = 'insert into agile_api.project_members (project_id, user_id, owner_id) values (?, ?, ?) if not exists;';
                    var params = [ title, owner, owner ];

                    configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                            if (err) {
                                res.json(HttpStatus.METHOD_FAILURE, {
                                    status: 420,
                                    message: 'Can\'t create project member.'
                                });
                            } else if (result.rows["0"]["[applied]"] === true) {
                                res.json(HttpStatus.CREATED, {
                                    status: 201,
                                    message: 'Project registered',
                                    project: {
                                        title: title,
                                        description: description,
                                        owner: owner
                                    }
                                });
                            } else {
                                res.json(HttpStatus.CONFLICT, {
                                    status: 409,
                                    message: 'Project member already exists.'
                                });
                            }
                        }
                    );

                } else {
                    io.emit(room, sessionUser.access_token, title, owner, 'Can\'t create project member.', null);

                    res.json(HttpStatus.CONFLICT, {
                        status: 409,
                        message: 'Project already exists.'
                    });
                }
            }
        );
    } else {
        res.json(HttpStatus.FORBIDDEN, {
            status: 403,
            message: 'Forbidden.'
        });
    }


}

module.exports = {
    projectAdd: projectAdd,
    projectDelete: projectDelete,
    projectUpdate: projectUpdate,
    projectGetID: projectGetID,
    projectGet: projectGet
};
