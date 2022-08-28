import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';
import { TreePath } from './tree_path.js';

const var1 = "4d6b745f-a0e2-4b09-8657-479edfcd79b0";//uuidv4();
const var2 = "e7abc1fa-8630-46ef-8a31-5c4667c1be65";//uuidv4();
const var3 = "88d2fc6d-3c58-4cef-8eda-d84617bb135f";//uuidv4();
const var4 = "86d3dc6d-3c58-4cef-8eda-d84617bb121f"


const mockData = (function () {
    const { update, set, subscribe } = writable({
        "factorial": {
            "info": {
                "id": "factorial",
                "variables": {}
            },
            "body": [
                {
                    "type": "IfStatement",
                    "id": uuidv4(),
                    "test": {
                        "type": "IdentifierRefCallExpression",
                        "method": "lessThan",
                        "dataType": "Boolean",
                        "arguments": [
                            {
                                "type": "IntegerLiteral",
                                "value": 2,
                                "dataType": "Integer"
                            }
                        ],
                        "refData": {
                            "type": "RefIdentifier",
                            "fnRefType": "parameters",
                            "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                            "dataType": "Integer"
                        }
                    },
                    "consequent": {
                        "body": [
                            {
                                "type": "FlowStep",
                                "id": uuidv4(),
                                "expression": {
                                    "type": "ReturnStatement",
                                    "functionId": "factorial",
                                    "returnType": "Integer",
                                    "expression": {
                                        "type": "IntegerLiteral",
                                        "value": 1,
                                        "dataType": "Integer"
                                    }
                                }
                            }
                        ]
                    },
                    "alternate": {
                        "body": [
                            {
                                "type": "FlowStep",
                                "id": uuidv4(),
                                "expression":
                                {
                                    "type": "ReturnStatement",
                                    "functionId": "factorial",
                                    "returnType": "Integer",
                                    "expression": {
                                        "type": "IdentifierRefCallExpression",
                                        "refData": {
                                            "type": "RefIdentifier",
                                            "fnRefType": "parameters",
                                            "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                                            "dataType": "Integer"
                                        },
                                        "dataType": "Integer",
                                        "method": "multiplyBy",
                                        "arguments": [
                                            {
                                                "type": "FunctionCallExpression",
                                                "fileId": "factorial",
                                                "arguments": [
                                                    {
                                                        "type": "IdentifierRefCallExpression",
                                                        "dataType": "Integer",
                                                        "refData": {
                                                            "type": "RefIdentifier",
                                                            "fnRefType": "parameters",
                                                            "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                                                            "dataType": "Integer"
                                                        },
                                                        "method": "subtract",
                                                        "arguments": [
                                                            {
                                                                "type": "IntegerLiteral",
                                                                "value": 1,
                                                                "dataType": "Integer"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "abc": {
            "info": {
                "id": "abc",
                "variables": {}
            },
            "body": [
                {
                    "type": "FlowStep",
                    "id": uuidv4(),
                    "expression": {
                        "type": "UtilityCallExpression",
                        "utilityName": "LoggerUtil",
                        "utilityMethod": "logNumber",
                        "dataType": "Void",
                        "arguments": [
                            {
                            "type": "FunctionCallExpression",
                            "fileId": "factorial",
                            "arguments": [
                                {
                                    "type": "IntegerLiteral",
                                    "value": 5,
                                    "dataType": "Integer"
                                }
                            ]
                        }
                        ]
                    }
                }
            ]
        }
    });

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
        }
    };

})();

export { mockData };