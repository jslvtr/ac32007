/**
 * Created by remon on 25/11/2014.
 */
var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');
var hat      = require('hat');
var request = require('request');

function query(req, res)    {

    var token_id = req.params.id;


    var query       = 'select * from agile_api.endpoints where token_id=? allow filtering;';
    var params      = [ token_id ];
    var jsonResult = [];
    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
        if (err) {
            res.json(HttpStatus.METHOD_FAILURE, {
                status: 420,
                message: 'Can\'t find project.'
            });
            console.log(err);
        }   else if (result.rows != null) {
            for (var row in result.rows) {
                jsonResult.push({
                    token_id : result.rows[row].token_id,
                    body : result.rows[row].body,
                    body_type : result.rows[row].body_type,
                    description : result.rows[row].description,
                    headers : result.rows[row].headers,
                    method_type : result.rows[row].method_type,
                    owner_id : result.rows[row].owner_id,
                    project_id : result.rows[row].project_id,
                    title : result.rows[row].title,
                    url : result.rows[row].url,
                    url_params : result.rows[row].url_params,
                    category    : result.rows[row].category_id
                });
            }

            request(
                { method: jsonResult[0].method_type
                    , uri: jsonResult[0].url
                    , body: jsonResult[0].body
                    , headers: jsonResult[0].headers
                    , gzip: true
                }
                , function (error, response, body) {
                    // body is the decompressed response body
                    res.json(response);
                    //console.log('the decoded data is: ' + body)
                }
            ).on('data', function(data) {
                    // decompressed data as it is received
                    //console.log('decoded chunk: ' + data)
                })
                .on('response', function(response) {
                    // unmodified http.IncomingMessage object
                    response.on('data', function(data) {
                        // compressed data as it is received
                        console.log('received ' + data.length + ' bytes of compressed data')
                    })
                })

        }   else {
            res.json(HttpStatus.NOT_FOUND , {
                status: 404,
                project : "Project not found"
            });
        }
    });
}


module.exports = {
    query   :   query
}