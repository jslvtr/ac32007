var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');

function projectGet  (req, res)  {
    //Gets the information from the uri
    var owner   = req.params.user;
    var query   = 'select title, description from agile_api.projects where owner = ? allow filtering;';
    var params  = [ owner ];

    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
        if (err) {
            res.json(HttpStatus.METHOD_FAILURE, {
                status: 420,
                message: 'Can\'t find project.'
            });
        }   else if (result.rows["0"]!= null) {
            var jsonResult = [];

            for (var row in result.rows) {
                jsonResult.push({
                    title : result.rows[row].title,
                    description : result.rows[row].description,
                    owner :   result.rows[row].owner
                });
            }
            res.json(HttpStatus.ACCEPTED, {
                status: 200,
                projects: jsonResult
            });

        }   else {
            res.json(HttpStatus.NOT_FOUND , {
                status: 404,
                project : "Project not found"
            });
        }
    });
}

function projectGetID  (req, res)  {
    //Gets the information from the uri
    var title       = req.params.id;
    var owner       = req.params.user;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        var query       = 'select * from agile_api.projects where title = ? and owner = ?;';
        var params = [ title, owner ];
        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create project.'
                    });
                }   else if (result.rows["0"]!= null) {
                    res.json(HttpStatus.CREATED, {
                        status: 201,
                        project : {
                            title : result.rows[0].title,
                            description : result.rows[0].description,
                            owner :   result.rows[0].owner
                        }
                    });

                }   else {
                    res.json(HttpStatus.NOT_FOUND , {
                        status: 404,
                        project : "Project not found"
                    });
                }
            }
        );
    }   else    {
        res.json(HttpStatus.FORBIDDEN , {
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
function projectUpdate  (req, res)  {

    //Gets the information from the uri
    var title       = req.params.id;
    var owner       = req.params.user;
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
                res.json(HttpStatus.CREATED, {
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
    }   else    {
        res.json(HttpStatus.FORBIDDEN , {
            status: 403,
            message: 'Forbidden'
        });
    }
}

/*
        projectDelete

    Delete the project from the users project list

 */

function projectDelete  (req, res)  {

    //Gets the information from the uri
    var title = req.params.id.split('_').join(' ');
    var owner = req.params.user;
    var sessionUser = req.user;

    if (sessionUser.username == owner)   {
        var query = 'delete from agile_api.projects where title = ? and owner = ?;';
        var params = [ title, owner ];


        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t delete project.'
                    });
                } else {
                    res.json(HttpStatus.NO_CONTENT, {
                        status: 204,
                        message: 'Project deleted'
                    });
                }
            }
        );
    }   else    {
        res.json(HttpStatus.FORBIDDEN , {
            status: 403,
            message: 'Forbidden'
        });
    }


}
/*
        projectAdd

        Adds a new project for that user


 */

function projectAdd (req, res)  {
    var title       = req.body.title;
    var description = req.body.description;
    var owner       = req.body.owner;
    var sessionUser = req.user;

    if (sessionUser.username == owner)  {
        var query       = 'insert into agile_api.projects (title, description, owner) values (?, ?, ?) IF NOT EXISTS;';
        var params      = [ title, description, owner ];

        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create project.'
                    });
                } else if (result.rows["0"]["[applied]"] === true) {
                    res.json(HttpStatus.CREATED, {
                        status: 201,
                        message: 'Project registered',
                        project : {
                            title : title,
                            description : description,
                            owner :   owner
                        }
                    });
                } else {
                    res.json(HttpStatus.NO_CONTENT, {
                        status: 204,
                        message: 'Project already exists.'
                    });
                }
            }
        );
    }   else    {
        res.json(HttpStatus.FORBIDDEN , {
            status: 403,
            message: 'Forbidden'
        });
    }


}

module.exports = {
    projectAdd      :   projectAdd,
    projectDelete   :   projectDelete,
    projectUpdate   :   projectUpdate,
    projectGetID    :   projectGetID,
    projectGet      :   projectGet
};