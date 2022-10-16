const { Server } = require('socket.io');


function startSocketServer(server) {
    let connectedUserCount = 0;
    const io = new Server(server);

    io.on('connection', (socket) => {
        connectedUserCount += 1;
        socket.on('mutate', (mutationData) => {
            console.log(socket.id);
            socket.broadcast.emit('mutate', mutationData);
        });

        socket.on('disconnect', () => connectedUserCount -= 1);
    });

    return io;
}

module.exports = { startSocketServer };