//var bodyparser = require('body-parser');
var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');


/*

            TODO            Check if the user that has issued the delete
                            is the user that owns the project


 */
function projectGetID  (req, res)  {

    //Gets the information from the uri
    var title = req.params.id;
    var owner = req.params.user;
    console.log("title: " + title + " | owner: " + owner);

    var query = 'select * from agile_api.projects where title = ? and owner = ?;';
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

}
function projectUpdate  (req, res)  {

    //Gets the information from the uri
    //var title = req.params.id;
    //var owner = req.params.user;

    //todo change to get data from uri instead of data.
    var title           = req.body.title;
    var description     = req.body.description;
    var owner           = req.body.owner;

    var query = 'update agile_api.projects set description = ? where title = ? and owner = ?;';
    var params = [ description, title, owner ];


    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Can\'t update project.'
                });
                //console.log(err);

            } else {
                res.json(HttpStatus.CREATED, {
                    status: 202,
                    message: 'Project updated',
                    project : {
                        title : title,
                        description : description,
                        owner :   owner
                    }
                });
            }
        }
    );

}


function projectDelete  (req, res)  {

    //Gets the information from the uri
    //var title = req.params.id;
    //var owner = req.params.user;

    //todo change to get data from uri instead of data.
    var title   = req.body.title;
    var owner   = req.body.owner;

    var query = 'delete from agile_api.projects where title = ? and owner = ?;';
    var params = [ title, owner ];


    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                res.json(HttpStatus.METHOD_FAILURE, {
                    status: 420,
                    message: 'Can\'t delete project.'
                });
                //console.log(err);

            } else {
                res.json(HttpStatus.NO_CONTENT, {
                    status: 204,
                    message: 'Project deleted'
                });
            }
        }
    );

}


function projectAdd (req, res)  {
    var title       = req.body.title;
    var description = req.body.description;
    var owner     = req.body.owner;
    var query = 'insert into agile_api.projects (title, description, owner) values (?, ?, ?) IF NOT EXISTS;';
    var params = [ title, description, owner ];


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

}

module.exports = {
    projectAdd      :   projectAdd,
    projectDelete   :   projectDelete,
    projectUpdate   :   projectUpdate,
    projectGetID    :   projectGetID
};