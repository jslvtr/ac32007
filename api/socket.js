var configDB = require('./config/database.js');


module.exports = function(app, io) {

    io.on('connection', function (socket) {
        io.emit('chat message', "User has connected");

        socket.on('disconnect', function(){
            io.emit('chat message', "User has disconnected");
        });


        socket.on('chat message', function(msg){
            var query = 'insert into agile_api.chat_logs (project_id, owner_id, message, user, time) values(?, ?, ?, ?, dateof(now()));';

            var params = [ 'test', 'test', msg, 'test user' ];

            configDB.client.execute(query, params, {prepare: true}, function(err, result) {

                }
            );
            io.emit('chat message', msg);
        });


        socket.on("sender", function (data) {
            socket.emit("sender", data);
            socket.broadcast.emit("sender", data); //Broadcast the user typing to all the other users over the network
        });

        socket.on('about', function(socket){
            socket.broadcast.emit("sender", "about pages");
        });
    });

}