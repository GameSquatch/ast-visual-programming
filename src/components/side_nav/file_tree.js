import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const fileMetadata = writable({
    "abc": {
        title: "Main",
        objectType: "function",
        objectFlowData: {
            parameters: []
        }
    },
    "123": {
        title: "Fn2",
        objectType: "function",
        objectFlowData: {
            parameters: []
        }
    }
});

const fileTree = writable({
    items: [
        {
            type: "file",
            id: "abc"
        },
        {
            type: "file",
            id: "123"
        }
    ]
});

function createFileMetadata({ title, id = uuidv4(), objectType, objectFlowData = {} }) {
    return {
        title,
        id,
        objectType,
        objectFlowData
    };
}

function createFileTreeReference(id) {
    id = id || uuidv4();
    return {
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

function createNodeTreeEntry(id) {
    return {
        main: {
            id,
            info: {
                variables: {},
                parameters: {}
            },
            body: []
        }
    };
}

export { fileTree, fileMetadata, createFileTreeReference, createFileMetadata, createFolder, createNodeTreeEntry };