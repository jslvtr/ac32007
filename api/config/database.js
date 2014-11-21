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

module.exports = {
    client: (client || InitClient())
};