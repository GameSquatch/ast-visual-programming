const { Server } = require('socket.io');


function startSocketServer(server) {
    let msgs = [];
    let connectedUserCount = 0;
    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.emit('historical msgs', { msgs });
        io.emit('user count', ++connectedUserCount);
    
        socket.on('chat msg', (msgData) => {
            io.emit('chat msg', msgData);
            
            if (msgs.length === 100) {
                msgs.shift();
            }
            msgs.push(msgData);
        });

        socket.on('user typing', (userId) => {
            io.emit('user typing', userId);
        });

        socket.on('disconnect', (reason) => {
            io.emit('user count', --connectedUserCount);
        });
    });
}

module.exports = { startSocketServer };