import { writable } from 'svelte/store';

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
        },
        changeParameterName({ fnId, paramId, newName }) {
            update((state) => {
                state[fnId].objectFlowData.parameters[paramId].name = newName;
                return state;
            });
        }
    };
})();


const fileTypeObjectFlowTemplates = {
    "function": () => ({
        parameters: {},
        dataType: "String"
    })
};

function createFileMetadata({ title, fileType }) {
    const fileOjbectFlowData = fileTypeObjectFlowTemplates[fileType]?.() ?? {};

    return {
        title,
        fileType,
        objectFlowData: fileOjbectFlowData
    };
}

export { fileMetadata, createFileMetadata };