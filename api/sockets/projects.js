var configDB = require('../config/database.js');

function findByToken(token, fn) {
    var query = 'SELECT * FROM agile_api.users WHERE access_token = ?';
    var params = [ token ];

    configDB.client.execute(query, params, {prepare: true}, function(err, result) {
            if (err) {
                return fn(err, null);
            } else if (result.rows.length === 1) {
                return fn(null, result.rows[0]);
            } else {
                return fn(null, null);
            }
        }
    );
}

function checkAuth (token) {
    findByToken(token, function (err, user) {
        if (err) {
            return null;
        }
        if (!user) {
            return null;
        }
        return user;
    })
}

function on (io, access_token, title, owner, error, message) {
    var sessionUser = checkAuth(access_token);

    if (sessionUser) {
        io.emit('project', access_token, title, owner, null, 'Welcome ' + sessionUser.username);

    } else {
        io.emit('project', access_token, title, owner, 'access denied!!', 'Go Away!!');
    }
}

module.exports = {
    on       : on
};