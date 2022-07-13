import { writable } from 'svelte/store';

const fileTree = writable({
    items: [
        {
            title: "Main",
            type: "file",
            id: "abc"
        },
        {
            title: "Fn2",
            type: "file",
            id: "123"
        }
    ]
});

export { fileTree };