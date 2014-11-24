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
                    message: 'Cant find user.'
                });
            } else {
                if (result.rows[0].user_id == sessionUser.username)  {
                    var token_id = hat();
                    var title = req.body.title;
                    var description = req.body.description;
                    var url = req.body.urlpath;
                    var headers = Array.prototype.slice.call(req.body.headers);
                    //headers.push(req.body.headers);
                    //headers = JSON.stringify(headers);

                    var url_params = Array.prototype.slice.call(req.body.url_params);
                    var method_type = req.body.method_type;
                    var body = JSON.stringify(req.body.body);
                    var body_type = req.body.body_type;

                    console.log("before prep");
                    var query       = 'insert into agile_api.endpoints (project_id, owner_id, token_id, title, description, url, headers, url_params, method_type, body, body_type) values (?,?,?,?,?,?,?, ?, ?, ?, ?) IF NOT EXISTS;';
                    var params      = [ project, owner, token_id, title, description, url, headers, url_params, method_type, body, body_type ];

                    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                            if (err) {
                                res.json(HttpStatus.METHOD_FAILURE, {
                                    status: 420,
                                    message: 'Cant create endpoint.'
                                });
                                console.log(err);
                            } else if (result.rows["0"]["[applied]"] === true) {
                                res.json(HttpStatus.CREATED, {
                                    status: 201,
                                    message: 'endpoint created',
                                    error:err
                                });
                            } else {
                                res.json(HttpStatus.NO_CONTENT, {
                                    status: 204,
                                    message: 'endpoint already exists.'
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