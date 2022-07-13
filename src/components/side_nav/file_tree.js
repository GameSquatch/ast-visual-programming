import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

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

function createFile({ title, id = uuidv4() }) {
    return {
        title,
        id,
        type: 'file'
    };
}

function createFolder({ title, id = uuidv4() }) {
    return {
        title,
        id,
        type: 'folder',
        items: []
    };
}

export { fileTree, createFile, createFolder };