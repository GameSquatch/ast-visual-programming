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
                    "type": "UtilityCallExpression",
                    "utilityName": "StringUtil",
                    "utilityMethod": "concat",
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "value": "hello"
                        },
                        {
                            "type": "StringLiteral",
                            "value": " world!"
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
                            "value": "more"
                        },
                        {
                            "type": "StringLiteral",
                            "value": " concatenation!"
                        }
                    ],
                    "returns": "String"
                }
            }
        ]
    }
};

export default mockData;