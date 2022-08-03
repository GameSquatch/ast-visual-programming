import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { TreePath } from '../../lib/js/tree_path.js';

/**
 * @typedef {Object} FileItem
 * @property {string} type
 * @property {string} id
 */
/**
 * @typedef {Object} FolderItem
 * @property {FileItem[]} files
 * @property {FolderItem[]} folders
 * @property {string} id
 * @property {string} title
 * @property {string} type
 */
/**
 * @typedef {Object} FileTreeRoot
 * @property {FileItem[]} files
 * @property {FolderItem[]} folders
 */


/** @type {FileTreeRoot} */
const mockStart = {
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
        createFolder({ title: 'folder' })
    ]
};

/** @type {FileTreeRoot} */
const emptyStart = {
    files: [],
    folders: []
};

const { subscribe, set, update } = writable(emptyStart);

const fileTreeStore = {
    subscribe,
    set,
    update,
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.from
     * @param {string} spec.to
     * @param {string} spec.navType
     */
    moveItem({ from, to, navType = 'files'}) {
        this.update((tree) => {
            const fromPath = new TreePath({ stringPath: from });
            const toPath = new TreePath({ stringPath: to });

            /** @type {object} */
            let fromArr = tree;
            fromPath.tokens.forEach((token, i, tokens) => {
                if (i === tokens.length - 1) return;
                fromArr = fromArr[token];
            });
            const index = parseInt(fromPath.getTokenAt(-1))
            // Take a copy instead of splicing out
            const fromObj = fromArr[index];
            
            /** @type {object} */
            let locationArr = tree;
            if (toPath.tokens.length > 1) {
                toPath.tokens.forEach((token) => {
                    locationArr = locationArr[token];
                });
            }
            
            // Need to splice after we use location, because moving things at the same level
            // will change the indices at which those things exist in the arrays
            fromArr.splice(index, 1)[0];
            locationArr[navType] = [
                ...locationArr[navType],
                fromObj
            ];

            saveFileTree(tree)
                .then(console.log);

            return tree;
        });
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.treePath
     * @param {Object.<string, any>} spec.itemData
     * @param {string} spec.navType
     */
    addItemAt({ treePath, itemData, navType = 'files' }) {
        const path = new TreePath({ stringPath: treePath });

        this.update((tree) => {
            let location = tree;
            if (path.tokens.length > 1) {
                path.tokens.forEach((token, i, tokens) => {
                    location = location[token];
                });
            }

            location[navType] = [
                ...location[navType],
                itemData
            ];

            if (navType === 'files') {
                saveFileTree(tree, itemData, 'create')
                    .then(console.log);
            } else {
                saveFileTree(tree)
                    .then(console.log);
            }
            

            return tree;
        });
    },
    createRootFile({ id }) {
        this.update((tree) => {
            const fileItem = createFileTreeReference(id);
            tree.files.push(fileItem);
            saveFileTree(tree, fileItem, 'create')
                .then(console.log);
            return tree;
        });
    },
    createRootFolder({ title }) {
        this.update((tree) => {
            const fileItem = createFolder({ title });
            tree.folders.push(fileItem);
            saveFileTree(tree)
                .then(console.log);
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
                dataType: "String"
            },
            body: []
        }
    };
}


/**
 * @function
 * @param {Object.<string, any>} tree
 * @param {Object.<string, any>} [fileItemData]
 * @param {string} action
 * @returns {Promise<string>}
 */
async function saveFileTree(tree, fileItemData = {}, action = '') {
    try {
        const response = await fetch(`/api/file-tree/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileTree: tree, fileItemData })
        });
        /** @type {{ message: string }} */
        const { message } = await response.json();
        return message;
    } catch (e) {
        return 'Bad stuff, uh oh';
    }
}


async function getFileTree() {
    try {
        const response = await fetch('/api/file-tree');

        const { fileTree } = await response.json();
        return fileTree;
    } catch (e) {
        throw new Error('Yikes!');
    }
}

export { fileTreeStore, createFileTreeReference, createFolder, createNodeTreeEntry };