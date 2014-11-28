var configDB = require('../config/database.js');

var last_chat_message = '';
var openedRooms = [];

function inRoom (name, client, callback) {
    for (var i=0;i<openedRooms.length;i+=1) {
        if (openedRooms[i].name === name && openedRooms.client === client) {
            return callback(true);
        }
    }

    return callback(false);
}

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

    inRoom(room, socket.client.id, function (listening) {
        if (!listening) {
            console.log('listening on room '+room);
            openedRooms.push(room);

            socket.on(room, function (data) {
                if (data.chat && last_chat_message !== data.chat) {
                    last_chat_message = data.chat;
                    io.emit(room, data.access_token, data.project, data.owner, data.error, data.chat, null, data.sender);

                    // dirty hack
                    setTimeout(function () {
                        last_chat_message = '';
                    }, 500);
                }
            });
        }
    });

    findByToken(access_token, function (err, sessionUser) {
        if (sessionUser) {
            //io.emit(room, access_token, title, owner, err, 'Welcome ' + sessionUser.username);

        } else {
            io.emit('project', access_token, title, owner, err, '[[ Access Denied ]]', null, null);
        }
    });
}

module.exports = {
    on       : on
};