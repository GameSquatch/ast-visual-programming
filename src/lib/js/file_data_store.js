import { writable } from 'svelte/store';
import { astMutators } from './ast_mutation_functions.js';


function mutateAtServer(mutation, bodyData) {
    return fetch(`/api/ast-mutate/${mutation}`, {
        body: JSON.stringify(bodyData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


const fileDataStore = (function () {
    const { update, set, subscribe } = writable({});

    return {
        subscribe,
        update,
        set,
        /** @type {(path: string) => void} */
        deleteFlowStepAt(path) {
            mutateAtServer('deleteFlowStepAt', { path })
                .catch((err) => {
                    console.error('Reverse the delete operation, since this failed');
                });

            this.update((flowData) => {
                return astMutators.deleteFlowStepAt({ path, treeRef: flowData });
            });
        },

        moveFlowStep({ fromPath, toPath, insertAt = false }) {
            mutateAtServer('moveFlowStep', { fromPath, toPath, insertAt })
                .catch((err) => {
                    console.error('Reverse the move operation, since this failed');
                });

            this.update((flowData) => {
                return astMutators.moveFlowStep({ treeRef: flowData, fromPath, toPath, insertAt });
            });
        },

        insertNodeIntoFlowAt({ path, nodeData, append = false }) {
            mutateAtServer('insertNodeIntoFlowAt', { path, nodeData, append })
                .catch((err) => {
                    console.error('Reverse the insert at operation, since this failed');
                });

            this.update((flowData) => {
                return astMutators.insertNodeIntoFlowAt({ treeRef: flowData, path, nodeData, append });
            });
        },

        setNodeAt({ path, nodeData }) {
            mutateAtServer('setNodeAt', { path, nodeData })
                .catch((err) => {
                    console.error('Reverse the set at operation, since this failed');
                });

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