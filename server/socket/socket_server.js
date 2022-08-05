
const { Server } = require('socket.io');

function startSocketServer(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.emit('connected');
    
        socket.on('chat msg', (msg) => {
            io.emit('chat msg', { msg, userId: socket.id });
        });
    });
}

module.exports = { startSocketServer };