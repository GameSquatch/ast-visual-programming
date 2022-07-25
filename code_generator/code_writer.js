const uuidv4 = require('uuid').v4;


const var1 = "4d6b745f-a0e2-4b09-8657-479edfcd79b0";//uuidv4();
const var2 = "e7abc1fa-8630-46ef-8a31-5c4667c1be65";//uuidv4();
const var3 = "88d2fc6d-3c58-4cef-8eda-d84617bb135f";//uuidv4();

const mockData = {
    "abc": {
        "main": {
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
                "parameters": {},
            },
            "body": [
                {
                    "type": "ExpressionStatement",
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
                    "type": "ExpressionStatement",
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
                    "type": "ExpressionStatement",
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
        }
    },
    "123": {
        "main": {
            "info": {
                "id": "123",
                "variables": {
                    [var3]: {
                        "name": "Fn2Str",
                        "defaultValue": "hello",
                        "dataType": "String"
                    }
                },
                "parameters": {}
            },
            "body": [
                {
                    "type": "ExpressionStatement",
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
            ]
        }
    }
};
exports.mockData = mockData;

/** @type {Object.<string, {title: string, fileType: string, objectFlowData: {parameters: Object.<string, {name: string}>, dataType: string}}>} */
const fm = {
    "abc": {
        title: "Main",
        fileType: "function",
        objectFlowData: {
            parameters: {
                id1: {
                    name: "param1"
                }
            },
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
exports.fileMetadata = fm;

/**
 * @typedef {(ASTNode) => string} CodeGenerator
 */

/**
 * @typedef {Object.<string, CodeGenerator>} CodeWriterConfig
 */
exports.codeWriter = {
    ExpressionStatement: function(node, fileId) {
        return node.expression === null ? "" : `    ${this[node.expression.type](node.expression, fileId)};\n`;
    },
    UtilityCallExpression: function(node, fileId) {
        const utility = `${node.utilityName}.${node.utilityMethod}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId), "");

        return `${utility}(${arguments})`;
    },
    FunctionCallExpression: function(node, fileId) {
        const title = fm[node.fileId].title;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId), "");

        return `${title}.(${arguments})`;
    },
    IdentifierRefCallExpression: function(node, fileId) {
        const varCall = `${this.RefIdentifier(node.refData, fileId)}.${node.method}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId), "");

        return `${varCall}(${arguments})`;
    },
    AssignmentExpression: function(node, fileId) {
        const left = this[node.left.type](node.left, fileId);
        if (node.right === null) return left;
        const right = this[node.right.type](node.right, fileId);

        return `${left} = ${right}`;
    },
    RefIdentifier: function(node, fileId) {
        let variableRef;
        if (node.fnRefType === 'variables') {
            variableRef = mockData[fileId].main.info.variables[node.refId];
        } else {
            variableRef = fm[fileId].objectFlowData.parameters[node.refId];
        }

        return variableRef.name;
    },
    StringLiteral: function(node, fileId) {
        return `"${node.value}"`;
    },
    IntegerLiteral: function(node, fileId) {
        return node.value.toString();
    }
};

function argStringBuilder(acc, arg, index, fileId) {
    //console.log(`inside reduce argtype: ${arg.type}`);
    return acc += index > 0 ? `, ${this[arg.type](arg, fileId)}` : this[arg.type](arg, fileId);
}