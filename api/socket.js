
module.exports = function(app, io) {

    io.on('connection', function (socket) {
        io.emit('chat message', "User has connected");

        socket.on('disconnect', function(){
            io.emit('chat message', "User has disconnected");
        });


        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });

}