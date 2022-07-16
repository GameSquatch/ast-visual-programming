import { v4 as uuidv4 } from 'uuid';

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
                        "returns": "String"
                    },
                    [var2]: {
                        "name": "aNum",
                        "defaultValue": 0,
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
                            "type": "VariableRefIdentifier",
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
                                    "type": "VariableRefIdentifier",
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
                            "type": "VariableRefIdentifier",
                            "refId": var1,
                            "returns": "String",
                            "fnRefType": "variables"
                        },
                        "right": {
                            "type": "VariableRefCallExpression",
                            "refData": {
                                "type": "VariableRefIdentifier",
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
                            "type": "VariableRefIdentifier",
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
                        "returns": "String"
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
                            "type": "VariableRefIdentifier",
                            "refId": var3,
                            "returns": "String",
                            "fnRefType": "variables"
                        },
                        "right": null
                    }
                },
            ]
        }
    }
};

export default mockData;