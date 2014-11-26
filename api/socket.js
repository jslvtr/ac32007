
module.exports = function(app, io) {

    io.on('connection', function (socket) {
        io.emit('chat message', "User has connected");

        socket.on('disconnect', function(){
            io.emit('chat message', "User has disconnected");
        });


        socket.on('chat message', function(msg){
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