//var bodyparser = require('body-parser');
var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');

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
    projectAdd       : projectAdd
};