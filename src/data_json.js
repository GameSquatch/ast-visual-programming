import { v4 as uuidv4 } from 'uuid';

const var1 = uuidv4();
const var2 = uuidv4();

const mockData = {
    "main": {
        "info": {
            "variables": {
                [var1]: {
                    "name": "aStr",
                    "value": "",
                    "type": "String"
                },
                [var2]: {
                    "name": "aNum",
                    "value": 0,
                    "type": "Integer"
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

export default mockData;