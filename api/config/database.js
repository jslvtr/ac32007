var cassandra = require('cassandra-driver');
var assert = require('assert');

var client = null;

var clientInfo = {
    //contactPoints: [ '127.0.0.1' ]
    //contactPoints: ['cassandra.yagocarballo.me']
    contactPoints: ['dr-hat.com']
};

var creationQueries = [
    // Drops the Keyspace
    'DROP KEYSPACE IF EXISTS agile_api;',

    // Creates the Keyspace
    "create keyspace if not exists agile_api  WITH replication = {\'class\':\'SimpleStrategy\', \'replication_factor\':1};",

    // Creates the Users table
    'CREATE TABLE if not exists agile_api.users (' +
    'full_name varchar,' +
    'username varchar,' +
    'email varchar,' +
    'password varchar,' +
    'access_token varchar,' +
    'PRIMARY KEY (username)' +
    ');',

    // Creates an Index for the access_token in the User's Table
    'CREATE INDEX IF NOT EXISTS access_token ON agile_api.users (access_token);',

    // Creates the Projects Table
    'CREATE TABLE if not exists agile_api.projects ('
    +   'title varchar,'
    +   'description varchar,'
    +   'owner varchar,'
    +   'PRIMARY KEY (title, owner));',

    // Creates the Project Members Table
    'CREATE TABLE if not exists agile_api.project_members ('
    +   'project_id varchar,'
    +   'user_id varchar,'
    +   'owner_id varchar,'
    +   'PRIMARY KEY (project_id, user_id, owner_id));',

    // Creates an index for the User ID
    'CREATE INDEX IF NOT EXISTS user_id ON agile_api.project_members (user_id);',

    // Creates the Invites table
    'CREATE TABLE if not exists agile_api.project_invite ('
    +   'project_id varchar,'
    +   'user_id varchar,'
    +   'owner_id varchar,'
    +   'secret varchar,'
    +   'PRIMARY KEY (user_id, project_id, owner_id, secret));',

    // Creates an Index for the Owner ID
    'CREATE INDEX IF NOT EXISTS owner_id ON agile_api.project_members (owner_id);'
];

function createSchema (pos, errors) {
    if (pos < creationQueries.length) {
        client.execute(creationQueries[pos], function (err) {
            if (err) { errors += 1; }
            createSchema(pos + 1, errors);
        });
    } else {
        console.log('[DB Schema] Executed { ' + errors + ' Errors of ' + pos + ' Queries. }');
    }
}

function db_schema (delete_all) {
    client = (client || InitClient());

    if (delete_all) {
        createSchema(0, 0);
    } else {
        createSchema(1, 0);
    }
}

function InitClient () {
    client = new cassandra.Client(clientInfo);
    return client;
}

module.exports = {
    client: (client || InitClient()),
    initDB: db_schema
};