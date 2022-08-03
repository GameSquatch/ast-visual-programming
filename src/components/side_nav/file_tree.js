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
        createFolder({ title: 'folder' })
    ]
});

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

            return tree;
        });
    },
    createRootFile({ id }) {
        this.update((tree) => {
            tree.files.push(createFileTreeReference(id));
            return tree;
        });
    },
    createRootFolder({ title }) {
        this.update((tree) => {
            tree.folders.push(createFolder({ title }));
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
                dataType: "String"
            },
            body: []
        }
    };
}

export { fileTreeStore, createFileTreeReference, createFolder, createNodeTreeEntry };