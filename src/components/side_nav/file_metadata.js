import { writable } from 'svelte/store';
import { typeDefaults } from '../../lib/js/type_defaults';

/**
 * @typedef {Object} FileMetadataFlowData
 * @property {Object.<string, FunctionParameterConfig>} parameters
 * @property {string} returnType
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
            returnType: "String"
        }
    },
    "123": {
        title: "Fn2",
        fileType: "function",
        objectFlowData: {
            parameters: {},
            returnType: "Integer"
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
                const param = state[fnId].objectFlowData.parameters[paramId];
                param.dataType = dataType;
                param.defaultValue = typeDefaults[dataType];
                return state;
            });
        },
        changeParameterName({ fnId, paramId, newName }) {
            update((state) => {
                state[fnId].objectFlowData.parameters[paramId].name = newName;
                return state;
            });
        },
        changeParameterDefaultValue({ fnId, paramId, newValue }) {
            update((state) => {
                state[fnId].objectFlowData.parameters[paramId].defaultValue = newValue;
                return state;
            });
        },
        addFile({ id, title, fileType }) {
            this.update((state) => {
                state[id] = createFileMetadata({ title, fileType });
                return state;
            });
        }
    };
})();


const fileTypeObjectFlowTemplates = {
    "function": () => ({
        parameters: {},
        returnType: "String"
    })
};

/**
 * @function
 * @param {Object} spec
 * @param {string} spec.title
 * @param {string} spec.fileType
 * @returns {FileMetadataEntry}
 */
function createFileMetadata({ title, fileType }) {
    const fileOjbectFlowData = fileTypeObjectFlowTemplates[fileType]?.() ?? {};

    return {
        title,
        fileType,
        objectFlowData: fileOjbectFlowData
    };
}

export { fileMetadata, createFileMetadata };