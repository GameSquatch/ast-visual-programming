import { io } from 'socket.io-client';

function connectToChat() {
    return io();
}

export { connectToChat };