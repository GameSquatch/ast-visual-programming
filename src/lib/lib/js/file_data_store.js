import { writable } from 'svelte/store';
import { astMutators } from './ast_mutation_functions.js';
// import { socketStore } from '../../store/socket_store.js';
// import { get } from 'svelte/store';


function mutateAtServer(mutation, bodyData) {
    // const socket = get(socketStore);
    // if (socket === null) return;

    // socket.emit('mutate', { mutation, paramsObj: bodyData });
}


const fileDataStore = (function () {
    const { update, set, subscribe } = writable({});

    return {
        subscribe,
        update,
        set,
        /** @type {({ path: string }) => void} */
        deleteFlowStepAt({ path }) {
            mutateAtServer('deleteFlowStepAt', { path });

            this.update((flowData) => {
                return astMutators.deleteFlowStepAt({ path, treeRef: flowData });
            });
        },

        moveFlowStep({ fromPath, toPath, insertAt = false }) {
            mutateAtServer('moveFlowStep', { fromPath, toPath, insertAt });

            this.update((flowData) => {
                return astMutators.moveFlowStep({ treeRef: flowData, fromPath, toPath, insertAt });
            });
        },

        insertNodeIntoFlowAt({ path, nodeData, append = false }) {
            mutateAtServer('insertNodeIntoFlowAt', { path, nodeData, append });

            this.update((flowData) => {
                return astMutators.insertNodeIntoFlowAt({ treeRef: flowData, path, nodeData, append });
            });
        },

        setNodeAt({ path, nodeData }) {
            mutateAtServer('setNodeAt', { path, nodeData });

            this.update((flowData) => {
                return astMutators.setNodeAt({ treeRef: flowData, path, nodeData });
            });
        },

        setFile(fileData) {
            this.update((files) => {
                files[fileData.info.id] = fileData;
                return files;
            });
        },

        removeFile(fileId) {
            this.update((files) => {
                delete files[fileId];
                return files;
            });
        }
    };

})();

export { fileDataStore };