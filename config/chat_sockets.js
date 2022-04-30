module.exports.chatSockets = function(chatServer){
    const { Server } = require("socket.io");
    const io = new Server(chatServer, {
        cors: {
          origin: "http://localhost:8000"
        }
      });

    io.on('connection', function(socket){
        console.log('new connection recieved',socket.id);

        socket.on('disconnect', function (){
            console.log('socket disconnected');
        })

        socket.on('send_message', function(data){
            console.log('joining req recieved',data);
            socket.join(data.chatroom)
            io.in(data.chatroom).emit('recieve_message',data)
        })
    });
};