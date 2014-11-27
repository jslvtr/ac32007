
var configDB     = require('../config/database.js');
var HttpStatus   = require('http-status-codes');
var hat          = require('hat');
var request      = require('request');
var underscore   = require('underscore');
function query(req, res)    {

    var token_id = req.params.id;


    var query       = 'select * from agile_api.endpoints where token_id=? allow filtering;';
    var params      = [ token_id ];
    var jsonResult = [];
    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
        if (err) {
            res.json(HttpStatus.METHOD_FAILURE, {
                status: 420,
                message: 'Can\'t find endpoint.'
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
            var start = new Date();

            request(
                { method: jsonResult[0].method_type
                    , uri: jsonResult[0].url
                    , body: jsonResult[0].body
                    , headers: jsonResult[0].headers
                    , gzip: true
                }
                , function (error, response, body) {
                    // body is the decompressed response body
                    var time = (new Date() - start);
                    var timeNow = new Date;

                    var query = 'insert into agile_api.endpoint_logs (token_id, req_method, res_time, time) values(?, ?, ?, dateof(now())) if not exists;';

                    var params = [ token_id, jsonResult[0].method_type, time ];

                    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                            if (err) {
                                res.json(HttpStatus.METHOD_FAILURE, {
                                    status: 420,
                                    message: 'Can\'t create log.'
                                });
                                console.log(err);

                            }   else    {
                                if (!error) {
                                    res.json(HttpStatus.ACCEPTED, {
                                        status          :   response.statusCode,
                                        response_time   :   time,
                                        header          :   response.headers,
                                        body            :   body
                                    });

                                } else {
                                    res.json(HttpStatus.ACCEPTED, {
                                        error           :   error.message,
                                        response_time   :   time,
                                        header          :   '',
                                        body            :   ''
                                    });
                                }
                            }
                        }
                    );

                    //console.log('the decoded data is: ' + body)
                }
            ).on('data', function(data) {
                    // decompressed data as it is received
                    //console.log('decoded chunk: ' + data)
                    //res.send(data.body);
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
                project : "endpoint not found"
            });
        }
    });
}

function getLogs(req, res)  {
    var token_id = req.params.id;
    var query       = 'select * from agile_api.endpoint_logs where token_id = ?;';
    var params      = [ token_id ];

    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
        if (err) {
            res.json(HttpStatus.METHOD_FAILURE, {
                status: 420,
                message: 'Can\'t find project.'
            });
            console.log(err);
        }   else     {
            var jsonResult = [];
            var avg_ms = 0;
            for (var row in result.rows) {
                jsonResult.push({
                    time    :   result.rows[row].time,
                    method  :   result.rows[row].req_method,
                    response_time   :   result.rows[row].res_time
                });
                avg_ms = parseInt(result.rows[row].res_time, 10);
            }


            res.json(HttpStatus.OK, {
                status  :   200,
                token   :   token_id,
                avg_ms  :   avg_ms,
                entries :   jsonResult.length,
                message :   jsonResult
            });

        }
    });
}

module.exports = {
    query   :   query,
    getLogs :   getLogs
};
