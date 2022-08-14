import { v4 as uuidv4 } from 'uuid';

const var1 = "4d6b745f-a0e2-4b09-8657-479edfcd79b0";//uuidv4();
const var2 = "e7abc1fa-8630-46ef-8a31-5c4667c1be65";//uuidv4();
const var3 = "88d2fc6d-3c58-4cef-8eda-d84617bb135f";//uuidv4();
const var4 = "86d3dc6d-3c58-4cef-8eda-d84617bb121f"


const mockData = {
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
                "type": "FlowStep",
                "id": uuidv4(),
                "expression": {
                    "type": "IfStatement",
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
            },
        ]
    }
};

export default mockData;