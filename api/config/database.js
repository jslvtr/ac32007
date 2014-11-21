var cassandra = require('cassandra-driver');
var assert = require('assert');

var client = null;

var clientInfo = {
    contactPoints: [ '127.0.0.1' ]
};

function InitClient () {
    client = new cassandra.Client(clientInfo);
    return client;
}

function db_schema_error_handling (err, message, callback) {
    if (err) {
        console.error(err);
    } else {
        console.log(message); // Comment this line to disable database creation logs
        callback();
    }
}

function db_schema (delete_all) {
    client = (client || InitClient());

    if (delete_all) {
        client.execute(
            'DROP KEYSPACE IF EXISTS agile_api;',
            function (err) { db_schema_error_handling(err, '[Success] Keyspace `agile_api` dropped.', function () {}) }

        );
    }

    // Creates the KeySpace
    client.execute(
        'create keyspace if not exists agile_api  WITH replication = {\'class\':\'SimpleStrategy\', \'replication_factor\':1};',
        function (err) {
            db_schema_error_handling(err, '[Success] Keyspace `agile_api` created.', function () {
                // Creates `users` table
                client.execute(
                    'CREATE TABLE if not exists agile_api.users (' +
                    'full_name varchar,' +
                    'username varchar,' +
                    'email varchar,' +
                    'password varchar,' +
                    'access_token varchar,' +
                    'PRIMARY KEY (username)' +
                    ');',
                    function (err) {
                        db_schema_error_handling(err, '[Success] Table `users` created.', function () {
                            // Creates an index for the `users` table
                            client.execute(
                                'CREATE INDEX IF NOT EXISTS access_token ON agile_api.users (access_token);',
                                function (err) {
                                    db_schema_error_handling(err, '[Success] Index `access_token` for table `user` created.', function () {
                                    });
                                }
                            );
                        });
                    }
                );
            });
        }
    );
}

module.exports = {
    client: (client || InitClient()),
    initDB: db_schema
};