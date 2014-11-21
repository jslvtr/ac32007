var cassandra = require('cassandra-driver');
var assert = require('assert');

var client = null;

var clientInfo = {
    contactPoints: [ '127.0.0.1', 'h2' ],
    keyspace: 'agile_api'
};

function InitClient () {
    client = new cassandra.Client(clientInfo);
    return client;
}

function db_schema_error_handling (err, message) {
    if (err) {
        console.error(err);
    } else {
        console.log(message);
    }
}

function db_schema (delete_all) {
    if (delete_all) {
        this.client.execute(
            'DROP KEYSPACE IF EXISTS agile_api;',
            db_schema_error_handling('[Success] Keyspace `agile_api` dropped.')
        );
    }

    this.client.execute(
        'create keyspace if not exists agile_api  WITH replication = {\'class\':\'SimpleStrategy\', \'replication_factor\':1};',
        db_schema_error_handling('[Success] Keyspace `agile_api` created.')
    );
}

module.exports = {
    client: (client || InitClient()),
    initDB: db_schema
};