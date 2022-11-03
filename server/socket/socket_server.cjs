const { Server } = require('socket.io');
const { fileData } = require('../api_router.cjs');
const { astMutators } = require('../../src/lib/js/ast_mutation_functions.cjs');


function startSocketServer(server) {
    let connectedUserCount = 0;
    const io = new Server(server);

    io.on('connection', (socket) => {
        connectedUserCount += 1;
        socket.on('mutate', (mutationData) => {
            const { mutation, paramsObj } = mutationData;
            astMutators[mutation]({ treeRef: fileData, ...paramsObj });
            socket.broadcast.emit('mutate', mutationData);
        });

        socket.on('disconnect', () => connectedUserCount -= 1);
    });

    return io;
}

module.exports = { startSocketServer };