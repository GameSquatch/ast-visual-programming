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
const startValue = {
    files: [
        {
            type: "file",
            id: "abc"
        },
        {
            type: "file",
            id: "factorial"
        }
    ],
    folders: [
        createFolder({ title: 'folder' })
    ]
};

const { subscribe, set, update } = writable(startValue);

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
    moveItem({ from, to, navType = 'files' }) {
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
    /** @type {({ id: string }) => void} */
    createRootFile({ id }) {
        this.update((tree) => {
            tree.files.push(createFileTreeReference(id));
            return tree;
        });
    },
    /** @type {({ title: string }) => void} */
    createRootFolder({ title }) {
        this.update((tree) => {
            tree.folders.push(createFolder({ title }));
            return tree;
        });
    }
};


/**
 * @function
 * @param {string} id
 * @returns {FileItem}
 */
function createFileTreeReference(id) {
    id = id || uuidv4();
    return {
        id,
        type: 'file'
    };
}

/**
 * @function
 * @param {Object} spec
 * @param {string} spec.title
 * @param {string} [spec.id]
 * @param {FileItem[]} [spec.files]
 * @param {FolderItem[]} [spec.folders]
 * @returns {FolderItem}
 */
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
        info: {
            id,
            variables: {},
            dataType: "String"
        },
        body: []
    };
}

export { fileTreeStore, createFileTreeReference, createFolder, createNodeTreeEntry };