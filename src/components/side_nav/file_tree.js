import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { TreePath } from '../../lib/js/tree_path.js';

/**
 * @typedef {Object} FileMetadataFlowData
 * @property {Object.<string, FunctionParameterConfig>} parameters
 * @property {string} dataType
 */
/**
 * @typedef {Object} FileMetadataEntry
 * @property {string} title
 * @property {string} fileType
 * @property {FileMetadataFlowData} objectFlowData
 */

/**
 * @type {Object.<string, FileMetadataEntry>} FileMetadata
 */
const fm = {
    "abc": {
        title: "Main",
        fileType: "function",
        objectFlowData: {
            parameters: {},
            dataType: "String"
        }
    },
    "123": {
        title: "Fn2",
        fileType: "function",
        objectFlowData: {
            parameters: {},
            dataType: "String"
        }
    }
};

/**
 * @typedef {Object} FunctionParameterConfig
 * @property {string} name
 * @property {string} dataType
 * @property {string|number|boolean} defaultValue
 */
/**
 * 
 * @param {FunctionParameterConfig} startingValues
 * @returns {FunctionParameterConfig}
 */
function createParameter({ name = "newParam", dataType = "String", defaultValue = "" }) {
    return {
        name,
        dataType,
        defaultValue
    };
}
const fileMetadata = (() => {
    const { subscribe, set, update } = writable(fm);

    return {
        subscribe,
        set,
        update,
        addParameter({ fnId, parameter }) {
            update((state) => {
                state[fnId].objectFlowData.parameters[parameter.id] = createParameter(parameter);
                return state;
            });
        },
        changeParameterType({ fnId, paramId, dataType }) {
            update((state) => {
                state[fnId].objectFlowData.parameters[paramId].dataType = dataType;
                return state;
            });
        }
    };
})();


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

function createFileMetadata({ title, fileType, objectFlowData = { parameters: {}, dataType: "String" } }) {
    return {
        title,
        fileType,
        objectFlowData: { ...objectFlowData }
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
                parameters: {},
                dataType: "String"
            },
            body: []
        }
    };
}

export { fileTree, fileMetadata, createFileTreeReference, createFileMetadata, createFolder, createNodeTreeEntry };