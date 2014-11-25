var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');
var hat      = require('hat');

function endpointAddCategory (req, res) {
    var project = req.params.project;
    var owner = req.params.owner;
    var category = req.params.category;
    var token_id = req.params.id;
    var sessionUser = req.user;

    //Check if the user is a member of the project
    var query = 'select user_id from agile_api.project_members where user_id = ?';
    var params = [ sessionUser.username ];


    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Cant find endpoint.'
                });
            } else {
                try {
                    if (result.rows[0].user_id == sessionUser.username)  {
                        var query       = 'update agile_api.endpoints set category_id = ? where token_id = ?;';
                        var params      = [ category, token_id ];

                        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                            if (err) {
                                res.json(HttpStatus.METHOD_FAILURE, {
                                    status: 420,
                                    message: 'Can\'t update endpoint.'
                                });
                            } else {
                                res.json(HttpStatus.CREATED, {
                                    status: 202,
                                    message: 'Endpoint updated'
                                });
                            }
                        });
                    }   else    {
                        res.json({message:"Error with endpoint maybe it doesn't exist or something"});
                    }
                }   catch (err) {
                    console.log("Error has occured: " + err);
                }


            }
        }
    );
}

function endpointRemoveCategory (req, res) {
    var project = req.params.project;
    var owner = req.params.owner;
    var category = req.params.category;
    var token_id = req.params.id;
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
                    var query       = 'update agile_api.endpoints set category_id = ? where token_id = ?;';
                    var params      = [ 'index', token_id ];

                    configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                        if (err) {
                            res.json(HttpStatus.METHOD_FAILURE, {
                                status: 420,
                                message: 'Can\'t update endpoint.'
                            });
                        } else {
                            res.json(HttpStatus.CREATED, {
                                status: 202,
                                message: 'Endpoint updated'
                            });
                        }
                    });
                }   else    {
                    res.json({message:"Error with endpoint maybe it doesn't exist or something"});
                }
            }
        }
    );
}

module.exports = {
    endpointAddCategory     :   endpointAddCategory,
    endpointRemoveCategory  :   endpointRemoveCategory
};