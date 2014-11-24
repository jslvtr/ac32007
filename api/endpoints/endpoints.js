var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');
var hat      = require('hat');

function endpointAdd(req, res)  {
    ///user/:owner/project/:project/endpoints
    var project = req.params.project;
    var owner = req.params.owner;
    var sessionUser = req.user;

    //Check if the user is a member of the project
    var query = 'select user_id from agile_api.project_members where user_id = ?';
    var params = [ sessionUser.username ];


    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Can\'t find user.'
                });
            } else {
                if (result.rows[0].user_id == sessionUser.username)  {
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
                    res.json({message:"couldn't find you"});
                }
            }
        }
    );


}


module.exports = {
    endpointAdd     :   endpointAdd
};