import { v4 as uuidv4 } from 'uuid';

const var1 = uuidv4();
const var2 = uuidv4();
const var3 = uuidv4();

const mockData = {
    "abc": {
        "main": {
            "info": {
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
                }
            ]
        }
    },
    "123": {
        "main": {
            "info": {
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
                            "type": "FunctionRefIdentifier",
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