import { writable } from 'svelte/store';

const routes = (() => {
    const { subscribe, set, update } = writable('/');

    return {
        subscribe,
        set,
        update
    };
})();

export { routes };