const { codeWriter } = require('./code_writer');
const uuidv4 = require('uuid').v4;

const mockData = {
    "main": {
        "info": {
            "variables": [
                {
                    "name": "aStr",
                    "value": "",
                    "type": "String"
                },
                {
                    "name": "aNum",
                    "value": 0,
                    "type": "Integer"
                }
            ],
            "parameters": [],
        },
        "body": [
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
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
                            "type": "StringLiteral",
                            "value": " world!",
                            "returns": "String"
                        }
                    ],
                    "returns": "String"
                }
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
                    "type": "AssignmentExpression",
                    "left": {
                        "type": "Identifier",
                        "name": "aStr",
                        "returns": "String"
                    },
                    "right": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "hello",
                                "returns": "String"
                            },
                            {
                                "type": "StringLiteral",
                                "value": " world!",
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
                    "type": "UtilityCallExpression",
                    "utilityName": "String",
                    "variableName": "aStr",
                    "utilityMethod": "concat",
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "value": "add to variable aStr",
                            "returns": "String"
                        }
                    ],
                    "returns": "String"
                }
            },
            {
                "type": "ExpressionStatement",
                "id": uuidv4(),
                "expression": {
                    "type": "UtilityCallExpression",
                    "utilityName": "StringUtil",
                    "utilityMethod": "concat",
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "value": "more",
                            "returns": "String"
                        },
                        {
                            "type": "StringLiteral",
                            "value": " concatenation!",
                            "returns": "String"
                        }
                    ],
                    "returns": "String"
                }
            }
        ]
    }
};

for (let variable of mockData.main.info.variables) {
    console.log(`let ${variable.name} = ${variable.type === "String" ? '"' + variable.value + '"' : variable.value};\n`);
}

for (let statement of mockData.main.body) {
    codeOutput(statement);
}

function codeOutput(node) {
    // write code for node.type to a file, but for now just log it
    console.log(codeWriter[node.type](node));
}