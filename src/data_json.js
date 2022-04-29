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
                    "returns": "String"
                },
                [var2]: {
                    "name": "aNum",
                    "value": 0,
                    "returns": "Integer"
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
                        "type": "FunctionRefIdentifier",
                        "refId": var1,
                        "returns": "String",
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
                                "returns": "String"
                            },
                            {
                                "type": "FunctionRefIdentifier",
                                "refId": var1,
                                "returns": "String",
                                "fnRefType": "variables"
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
                        "type": "FunctionRefIdentifier",
                        "refId": var1,
                        "returns": "String",
                        "fnRefType": "variables"
                    },
                    "right": {
                        "type": "FunctionRefCallExpression",
                        "refData": {
                            "type": "FunctionRefIdentifier",
                            "refId": var1,
                            "returns": "String",
                            "fnRefType": "variables"
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
                        "type": "FunctionRefIdentifier",
                        "refId": var2,
                        "returns": "Integer",
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