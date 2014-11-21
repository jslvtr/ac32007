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

function db_schema (delete_all) {
    if (delete_all) {
        var query = 'DROP KEYSPACE IF EXISTS agile_api;';
        this.client.execute(query, function(err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('[Success] Keyspace `agile_api` dropped.');
                }
            }
        );
    }

}

module.exports = {
    client: (client || InitClient()),
    initDB: db_schema
};