import { writable } from 'svelte/store';
import { TreePath } from './tree_path.js';


const fileDataStore = (function () {
    const { update, set, subscribe } = writable({});

    return {
        subscribe,
        update,
        set,
        /** @type {({ flowData: Object, treePath: TreePath }) => Object} */
        getParentReference({ flowData, treePath }) {
            let parentRef = flowData;
            for (let i = 0; i < treePath.tokens.length - 1; ++i) {
                parentRef = parentRef[treePath.tokens[i]];
            }
            return parentRef;
        },
        /** @type {(path: string) => void} */
        deleteFlowStepAt(path) {
            const deletePath = new TreePath({ stringPath: path });

            this.update((flowData) => {
                let bodyArr = this.getParentReference({ flowData, treePath: deletePath });

                // @ts-ignore
                bodyArr.splice(parseInt(deletePath.getTokenAt(-1)), 1);

                return flowData;
            });
        },

        moveFlowStep({ fromPath, toPath, insertAt = false }) {
            const fromTreePath = new TreePath({ stringPath: fromPath });
            const toTreePath = new TreePath({ stringPath: toPath });

            this.update((flowData) => {
                /** @type {Object} */
                let fromBodyArr = this.getParentReference({ flowData, treePath: fromTreePath });
                let fromIndex = parseInt(fromTreePath.getTokenAt(-1));
                const toIndex = parseInt(toTreePath.getTokenAt(-1)) + (insertAt ? 0 : 1);

                let deleteNodeRef = fromBodyArr[fromIndex];

                /** @type {Object} */
                let toBodyArr = this.getParentReference({ flowData, treePath: toTreePath });

                if (fromBodyArr === toBodyArr && fromIndex === toIndex) {
                    return flowData;
                }

                toBodyArr.splice(toIndex, 0, deleteNodeRef);
                // If we are moving to the same array, we have just modified the index, depending on where to moved from,
                // so we need to readjust it to delete the original flow step
                if (fromBodyArr === toBodyArr) {
                    fromIndex += (fromIndex > toIndex ? 1 : 0);
                }
                fromBodyArr.splice(fromIndex, 1);

                return flowData;
            });
        },

        insertNodeIntoFlowAt({ path, nodeData, append = false }) {
            const treePath = new TreePath({ stringPath: path });

            this.update((flowData) => {
                /** @type {Object} */
                let nodeLocation = this.getParentReference({ flowData, treePath });

                const index = +treePath.getTokenAt(-1);
                nodeLocation.splice(append ? index + 1 : index, 0, nodeData);

                return flowData;
            });
        },

        setNodeAt({ path, nodeData }) {
            const treePath = new TreePath({ stringPath: path });

            this.update((flowData) => {
                let parentNode = this.getParentReference({ flowData, treePath });

                parentNode[treePath.getTokenAt(-1)] = nodeData;
                return flowData;
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