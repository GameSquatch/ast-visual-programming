
const { Server } = require('socket.io');


function startSocketServer(server) {
    let msgs = [];
    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.emit('connected');
        socket.emit('historical msgs', { msgs });
    
        socket.on('chat msg', (msgData) => {
            io.emit('chat msg', msgData);
            
            if (msgs.length === 100) {
                msgs.shift();
            }
            msgs.push(msgData);
        });

        socket.on('disconnect', () => {
            io.emit('chat msg', { msgText: `User [${socket.id}] has disconnected`, msgTime: Date.now(), userId: 'socket-server' });
        });
    });
}

module.exports = { startSocketServer };