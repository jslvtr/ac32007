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

function on (io, socket, access_token, title, owner, error, message) {
    var room = '#' + title + '-' + owner;
    console.log('listening on room '+room);

    socket.on(room, function (data) {
        if (data.chat) {
            io.emit(room, data.access_token, data.project, data.owner, data.error, data.chat);
        }
    });

    findByToken(access_token, function (err, sessionUser) {
        if (sessionUser) {
            io.emit(room, access_token, title, owner, err, 'Welcome ' + sessionUser.username);

        } else {
            io.emit('project', access_token, title, owner, err, 'Go Away!!');
        }
    });
}

module.exports = {
    on       : on
};