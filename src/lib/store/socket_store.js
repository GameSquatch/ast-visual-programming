import { writable, get } from 'svelte/store';
// import { io } from 'socket.io-client';


// I don't know that this needs to be a store; can probably be a normal object since
// it's not subscribed to like a store would be
const { update, set, subscribe } = writable(null);

const socketStore = {
    update,
    set,
    subscribe,
    startConnection() {
        // const currentClient = get(this);
        // if (currentClient) return currentClient;

        // const ioClient = io();
        // this.set(ioClient);
        // return ioClient;
    },
    disconnect() {
        // get(this)?.disconnect();
        // this.set(null);
    }
};

export { socketStore };