import { writable } from 'svelte/store';

const { update, set, subscribe } = writable({
    socketId: ''
})

const userStore = {
    update,
    set,
    subscribe,
    setSocketId(newSocketId) {
        this.update((userData) => {
            userData.socketId = newSocketId;
            return userData;
        });
    }
};

export { userStore };