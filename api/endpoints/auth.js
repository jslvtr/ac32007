var HttpStatus = require('http-status-codes');
var Bcrypt      = require('bcrypt-nodejs');
var hat      = require('hat');

var configDB = require('../config/database.js');

var User = require('../models/user').schema;

function login (req, res){
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {
        var query = 'SELECT * FROM agile_api.users WHERE username = ?';
        var params = [ username ];

        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t find user.'
                    });

                } else if (result.rows.length === 1) {
                    Bcrypt.compare(password, result.rows[0].password, function(err, valid) {
                        if (valid) {
                            if (result.rows[0].access_token) {
                                res.json(HttpStatus.OK, {
                                    status: 200,
                                    message: 'User logged-in',
                                    user : {
                                        full_name : result.rows[0].full_name,
                                        username : result.rows[0].username,
                                        email : result.rows[0].email,
                                        access_token : result.rows[0].access_token
                                    }
                                });

                            } else {
                                var dbUser = result.rows[0];
                                dbUser.access_token = hat();
                                query = 'update agile_api.users set access_token = ? where username = ?;';
                                params = [ dbUser.access_token, dbUser.username ];

                                configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                                        if (err) {
                                            res.json(HttpStatus.METHOD_FAILURE, {
                                                status: 420,
                                                message: 'Can\'t create access_token.'
                                            });

                                        } else {
                                            res.json(HttpStatus.OK, {
                                                status: 200,
                                                message: 'User logged-in',
                                                user : {
                                                    full_name : dbUser.full_name,
                                                    username : dbUser.username,
                                                    email : dbUser.email,
                                                    access_token : dbUser.access_token
                                                }
                                            });
                                        }
                                    }
                                );
                            }


                        } else {
                            res.json(HttpStatus.UNAUTHORIZED, {
                                status: 401,
                                message: 'Invalid password'
                            });
                        }
                    });

                } else {
                    res.json(HttpStatus.FORBIDDEN, {
                        status: 403,
                        message: 'User doesn\'t exist.'
                    });
                }
            }
        );

    } else {
        res.json(HttpStatus.CONFLICT, {
            status: 409,
            message: 'Invalid Username, Password or email.'
        });
    }
}

function register (req, res){
    var full_name = req.body.full_name;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if (username && password && email) {
        var hash = Bcrypt.hashSync(password, Bcrypt.genSaltSync(8), null);
        var access_token = hat();
        var query = 'insert into agile_api.users (full_name, username, email, password, access_token) values (?, ?, ?, ?, ?) IF NOT EXISTS;';
        var params = [ full_name, username, email, hash, access_token ];

        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create user.'
                    });

                } else if (result.rows["0"]["[applied]"] === true) {
                    res.json(HttpStatus.CREATED, {
                        status: 201,
                        message: 'User registered',
                        user : {
                            full_name : full_name,
                            username : username,
                            email : email,
                            access_token : access_token
                        }
                    });

                } else {
                    res.json(HttpStatus.NO_CONTENT, {
                        status: 204,
                        message: 'User already exists.'
                    });
                }
            }
        );

    } else {
        res.json(HttpStatus.CONFLICT, {
            status: 409,
            message: 'Invalid Username, Password or email.'
        });
    }
}

function logout (req, res){
    var query = 'update agile_api.users set access_token = null where username = ?;';
    var params = [ req.user.username ];

    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Can\'t log out.'
                });

            } else {
                res.json(HttpStatus.OK, {
                    status: 200,
                    message: 'Logged Out.'
                });
            }
        }
    );
}

function deleteUser (req, res){
    var query = 'delete from agile_api.users where username = ?;';
    var sessionUser = req.user;
    var params = [ req.user.username ];

    if (sessionUser.username == req.user.username) {

        configDB.client.execute(query, params, {prepare: true}, function (err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t log out.'
                    });

                } else {
                    res.json(HttpStatus.ACCEPTED, {
                        status: 202,
                        message: 'User marked for deletion.'
                    });
                }
            }
        );
    }
}

function facebook (req, res){
    res.json(HttpStatus.NOT_IMPLEMENTED, {
        status : 200,
        message : 'Visiting ' + req + '\'s Profile page.',
        user        : req.user
    });
}

module.exports = {
    login       : login,
    register    : register,
    logout      : logout,
    facebook    : facebook,
    deleteUser  : deleteUser
};