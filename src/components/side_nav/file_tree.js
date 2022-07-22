import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { TreePath } from '../../lib/js/tree_path.js';

const fileMetadata = writable({
    "abc": {
        title: "Main",
        objectType: "function",
        objectFlowData: {
            parameters: [],
            returns: "String"
        }
    },
    "123": {
        title: "Fn2",
        objectType: "function",
        objectFlowData: {
            parameters: [],
            returns: "String"
        }
    }
});

const { subscribe, set, update } = writable({
    files: [
        {
            type: "file",
            id: "abc"
        },
        {
            type: "file",
            id: "123"
        }
    ],
    folders: [
        createFolder({ title: 'folder', id: 'xxx' })
    ]
});
const fileTree = {
    subscribe,
    set,
    update,
    moveFile({ from, to }) {
        this.update((tree) => {
            const fromPath = new TreePath({ stringPath: from });
            const toPath = new TreePath({ stringPath: to });

            /** @type {object} */
            let fromObj = tree;
            fromPath.tokens.forEach((token, i, tokens) => {
                if (i === tokens.length - 1) return;
                fromObj = fromObj[token];
            });
            fromObj = fromObj.splice(parseInt(fromPath.getTokenAt(-1)), 1)[0];

            /** @type {object} */
            let filesArr = tree;
            toPath.tokens.forEach((token) => {
                filesArr = filesArr[token];
            });
            
            filesArr.files = [
                ...filesArr.files,
                fromObj
            ];

            return tree;
        });
    }
}

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

function createFolder({ title, id = uuidv4(), files = [], folders = [] }) {
    return {
        title,
        id,
        type: 'folder',
        expanded: false,
        files,
        folders
    };
}

function createNodeTreeEntry(id) {
    return {
        main: {
            id,
            info: {
                variables: {},
                parameters: [],
                returns: "String"
            },
            body: []
        }
    };
}

export { fileTree, fileMetadata, createFileTreeReference, createFileMetadata, createFolder, createNodeTreeEntry };