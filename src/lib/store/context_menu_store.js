import { writable } from 'svelte/store';

const contextMenuStore = writable({
    showing: false,
    x: 0,
    y: 0,
    menuItems: []
});

export { contextMenuStore };