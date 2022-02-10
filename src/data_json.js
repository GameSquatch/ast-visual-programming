import { v4 as uuidv4 } from 'uuid';

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
                                "value": "A long string teehee",
                                "returns": "String"
                            },
                            {
                                "type": "Identifier",
                                "name": "aStr",
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
                        "type": "Identifier",
                        "name": "aStr",
                        "returns": "String"
                    },
                    "right": {
                        "type": "UtilityCallExpression",
                        "variableName": "aStr",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
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
                        "type": "Identifier",
                        "name": "aNum",
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
            }
        ]
    }
};

export default mockData;