const uuidv4 = require('uuid').v4;

const var1 = uuidv4();
const var2 = uuidv4();

const mockData = {
    "main": {
        "info": {
            "variables": {
                [var1]: {
                    "name": "aStr",
                    "value": "",
                    "returns": "String"
                },
                [var2]: {
                    "name": "aNum",
                    "value": 0,
                    "returns": "Integer"
                }
            },
            "parameters": [],
        },
        "body": [
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
                    "type": "AssignmentExpression",
                    "left": {
                        "type": "VarIdentifier",
                        "refId": var1,
                        "returns": "String"
                    },
                    "right": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "A long string teehee",
                                "returns": "String"
                            },
                            {
                                "type": "VarIdentifier",
                                "refId": var1,
                                "returns": "String"
                            }
                        ],
                        "returns": "String"
                    }
                }
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
                    "type": "AssignmentExpression",
                    "left": {
                        "type": "VarIdentifier",
                        "refId": var1,
                        "returns": "String"
                    },
                    "right": {
                        "type": "VarCallExpression",
                        "variable": {
                            "type": "VarIdentifier",
                            "refId": var1,
                            "returns": "String"
                        },
                        "method": "concat",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "A long string teehee",
                                "returns": "String"
                            }
                        ],
                        "returns": "String"
                    }
                }
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
                    "type": "AssignmentExpression",
                    "left": {
                        "type": "VarIdentifier",
                        "refId": var2,
                        "returns": "Integer"
                    },
                    "right": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "length",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "Counting the length of the string",
                                "returns": "String"
                            }
                        ],
                        "returns": "Integer"
                    }
                }
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": null
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": null
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": null
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": null
            },
        ]
    }
};
exports.mockData = mockData;

/**
 * @typedef {(ASTNode) => string} CodeGenerator
 */

/**
 * @typedef {Object.<string, CodeGenerator>} CodeWriterConfig
 */
exports.codeWriter = {
    ExpressionStatement: function(node) {
        return node.expression === null ? "" : this[node.expression.type](node.expression) + ";\n";
    },
    UtilityCallExpression: function(node) {
        const utility = `${node.utilityName}.${node.utilityMethod}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i), "");

        return `${utility}(${arguments})`;
    },
    VarCallExpression: function(node) {
        const varCall = `${this.VarIdentifier(node.variable)}.${node.method}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i), "");

        return `${varCall}(${arguments})`;
    },
    AssignmentExpression: function(node) {
        const left = this[node.left.type](node.left);
        const right = this[node.right.type](node.right);

        return `${left} = ${right}`;
    },
    Identifier: function(node) {
        return node.name;
    },
    VarIdentifier: function(node) {
        const varRef = mockData.main.info.variables[node.refId];

        return varRef.name;
    },
    StringLiteral: function(node) {
        return `"${node.value}"`;
    },
    IntegerLiteral: function(node) {
        return node.value.toString();
    }
};

function argStringBuilder(acc, arg, index) {
    //console.log(`inside reduce argtype: ${arg.type}`);
    return acc += index > 0 ? `, ${this[arg.type](arg)}` : this[arg.type](arg);
}