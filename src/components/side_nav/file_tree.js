import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { TreePath } from '../../lib/js/tree_path.js';


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
    moveItem({ from, to, navType = 'files'}) {
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
            let locationArr = tree;
            if (toPath.tokens.length > 1) {
                toPath.tokens.forEach((token) => {
                    locationArr = locationArr[token];
                });
            }
            
            locationArr[navType] = [
                ...locationArr[navType],
                fromObj
            ];

            return tree;
        });
    }
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
            info: {
                id,
                variables: {},
                parameters: {},
                dataType: "String"
            },
            body: []
        }
    };
}

export { fileTree, createFileTreeReference, createFolder, createNodeTreeEntry };