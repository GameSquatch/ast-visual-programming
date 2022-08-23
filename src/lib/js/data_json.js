import { v4 as uuidv4 } from 'uuid';
import { writable } from 'svelte/store';
import { TreePath } from './tree_path.js';

const var1 = "4d6b745f-a0e2-4b09-8657-479edfcd79b0";//uuidv4();
const var2 = "e7abc1fa-8630-46ef-8a31-5c4667c1be65";//uuidv4();
const var3 = "88d2fc6d-3c58-4cef-8eda-d84617bb135f";//uuidv4();
const var4 = "86d3dc6d-3c58-4cef-8eda-d84617bb121f"


const mockData = (function () {
    const { update, set, subscribe } = writable({
        "abc": {
            "info": {
                "id": "abc",
                "variables": {
                    [var1]: {
                        "name": "aStr",
                        "defaultValue": "",
                        "dataType": "String"
                    },
                    [var2]: {
                        "name": "aNum",
                        "defaultValue": 0,
                        "dataType": "Integer"
                    }
                },
                "dataType": "String"
            },
            "body": [
                {
                    "type": "FlowStep",
                    "id": uuidv4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "RefIdentifier",
                            "refId": var1,
                            "dataType": "String",
                            "fnRefType": "variables"
                        },
                        "right": {
                            "type": "UtilityCallExpression",
                            "utilityName": "StringUtil",
                            "utilityMethod": "concat",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "A long string teehee",
                                    "dataType": "String"
                                },
                                {
                                    "type": "RefIdentifier",
                                    "refId": var1,
                                    "dataType": "String",
                                    "fnRefType": "variables"
                                }
                            ],
                            "dataType": "String"
                        }
                    }
                },
                {
                    "type": "FlowStep",
                    "id": uuidv4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "RefIdentifier",
                            "refId": var1,
                            "dataType": "String",
                            "fnRefType": "variables"
                        },
                        "right": {
                            "type": "IdentifierRefCallExpression",
                            "refData": {
                                "type": "RefIdentifier",
                                "refId": var1,
                                "dataType": "String",
                                "fnRefType": "variables"
                            },
                            "method": "concat",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "A long string teehee",
                                    "dataType": "String"
                                }
                            ],
                            "dataType": "String"
                        }
                    }
                },
                {
                    "type": "FlowStep",
                    "id": uuidv4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "RefIdentifier",
                            "refId": var2,
                            "dataType": "Integer",
                            "fnRefType": "variables"
                        },
                        "right": {
                            "type": "UtilityCallExpression",
                            "utilityName": "StringUtil",
                            "utilityMethod": "length",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "Counting the length of the string",
                                    "dataType": "String"
                                }
                            ],
                            "dataType": "Integer"
                        }
                    }
                }
            ]
        },
        "123": {
            "info": {
                "id": "123",
                "variables": {
                    [var3]: {
                        "name": "Fn2Str",
                        "defaultValue": "hello",
                        "dataType": "String"
                    },
                    [var4]: {
                        "name": "isBool",
                        "defaultValue": true,
                        "dataType": "Boolean"
                    }
                },
                "dataType": "String"
            },
            "body": [
                {
                    "type": "FlowStep",
                    "id": uuidv4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "RefIdentifier",
                            "refId": var3,
                            "dataType": "String",
                            "fnRefType": "variables"
                        },
                        "right": {
                            "type": "StringLiteral",
                            "value": "",
                            "dataType": "String"
                        }
                    }
                },
                {
                    "type": "IfStatement",
                    "id": uuidv4(),
                    "test": {
                        "type": "RefIdentifier",
                        "refId": var4,
                        "dataType": "Boolean",
                        "fnRefType": "variables"
                    },
                    "consequent": {
                        "body": [
                            {
                                "type": "FlowStep",
                                "id": uuidv4(),
                                "expression": {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "RefIdentifier",
                                        "refId": var3,
                                        "dataType": "String",
                                        "fnRefType": "variables"
                                    },
                                    "right": {
                                        "type": "StringLiteral",
                                        "value": "dookie",
                                        "dataType": "String"
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
                                "expression": {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "RefIdentifier",
                                        "refId": var3,
                                        "dataType": "String",
                                        "fnRefType": "variables"
                                    },
                                    "right": {
                                        "type": "StringLiteral",
                                        "value": "not dookie",
                                        "dataType": "String"
                                    }
                                }
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