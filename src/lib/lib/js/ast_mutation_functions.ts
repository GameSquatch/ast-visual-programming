import { TreePath } from './tree_path.js';

const astMutators = {
    /** @type {({ flowData: Object, treePath: TreePath }) => Object} */
    getParentReference({ flowData, treePath }) {
        let parentRef = flowData;
        for (let i = 0; i < treePath.tokens.length - 1; ++i) {
            parentRef = parentRef[treePath.tokens[i]];
        }
        return parentRef;
    },
    /** @type {({ path: string, treeRef: Object }) => Object} */
    deleteFlowStepAt({ path, treeRef }) {
        const deletePath = new TreePath({ stringPath: path });
        let bodyArr;
        try {
            bodyArr = this.getParentReference({ flowData: treeRef, treePath: deletePath });
        } catch (_) {
            return null;
        }

        // @ts-ignore
        bodyArr.splice(parseInt(deletePath.getTokenAt(-1)), 1);

        return treeRef;
    },

    moveFlowStep({ treeRef, fromPath, toPath, insertAt }) {
        const fromTreePath = new TreePath({ stringPath: fromPath });
        const toTreePath = new TreePath({ stringPath: toPath });

        let fromIndex = parseInt(fromTreePath.getTokenAt(-1));
        const toIndex = parseInt(toTreePath.getTokenAt(-1)) + (insertAt ? 0 : 1);

        let fromBodyArr;
        try {
            /** @type {Object} */
            fromBodyArr = this.getParentReference({ flowData: treeRef, treePath: fromTreePath });
        } catch (_) {
            fromBodyArr = null;
        }

        let deleteNodeRef = fromBodyArr?.[fromIndex];

        let toBodyArr;
        try {
            /** @type {Object} */
            toBodyArr = this.getParentReference({ flowData: treeRef, treePath: toTreePath });
        } catch (_) {
            toBodyArr = null;
        }

        if (fromBodyArr === null && toBodyArr === null) {
            return null;
        }

        if (fromBodyArr === toBodyArr && fromIndex === toIndex) {
            return treeRef;
        }

        toBodyArr.splice(toIndex, 0, deleteNodeRef);
        // If we are moving to the same array, we have just modified the index, depending on where to moved from,
        // so we need to readjust it to delete the original flow step
        if (fromBodyArr === toBodyArr) {
            fromIndex += (fromIndex > toIndex ? 1 : 0);
        }
        fromBodyArr.splice(fromIndex, 1);

        return treeRef;
    },

    insertNodeIntoFlowAt({ treeRef, path, nodeData, append }) {
        const treePath = new TreePath({ stringPath: path });

        let nodeLocation;
        try {
        /** @type {Object} */
            nodeLocation = this.getParentReference({ flowData: treeRef, treePath });
        } catch {
            return null;
        }

        const index = +treePath.getTokenAt(-1);
        nodeLocation.splice(append ? index + 1 : index, 0, nodeData);

        return treeRef;
    },

    setNodeAt({ treeRef, path, nodeData }) {
        const treePath = new TreePath({ stringPath: path });

        let parentNode;
        try {
            parentNode = this.getParentReference({ flowData: treeRef, treePath });
        } catch {
            return null;
        }

        parentNode[treePath.getTokenAt(-1)] = nodeData;
        return treeRef;
    }
};

export { astMutators };