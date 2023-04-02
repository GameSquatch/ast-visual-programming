import { writable } from 'svelte/store';
import { typeDefaults } from '../../lib/js/type_defaults.js';
import type { FunctionParameterConfig } from '../../common_types.js';
import type { PrimitiveType } from '$lib/lib/js/ast_node_creators.js';

interface FileMetadataFlowData {
    parameters: Record<string, FunctionParameterConfig>,
    returnType: PrimitiveType
}

interface FileMetadataEntry {
    title: string,
    fileType: string,
    objectFlowData: FileMetadataFlowData
}

const fm: Record<string, FileMetadataEntry> = {
    "factorial": {
        title: "factorial",
        fileType: "function",
        objectFlowData: {
            parameters: {
                "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5": {
                    name: "a",
                    dataType: "Integer",
                    defaultValue: 0
                }
            },
            returnType: "Integer"
        }
    },
    "abc": {
        title: "main",
        fileType: "function",
        objectFlowData: {
            parameters: {},
            returnType: "String"
        }
    }
};


function createParameter({ name = "newParam", dataType = "String", defaultValue = "" }: FunctionParameterConfig): FunctionParameterConfig {
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
        deleteParameter({ fnId, paramId }) {
            this.update((state) => {
                delete state[fnId].objectFlowData.parameters[paramId];
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


const fileTypeObjectFlowTemplates: Record<string, () => FileMetadataFlowData> = {
    "function": () => ({
        parameters: {},
        returnType: "String"
    })
};

function createFileMetadata({ title, fileType }: { title: string, fileType: string }): FileMetadataEntry {
    const fileOjbectFlowData = fileTypeObjectFlowTemplates[fileType]?.() ?? {};

    return {
        title,
        fileType,
        objectFlowData: fileOjbectFlowData
    };
}

export { fileMetadata, createFileMetadata };