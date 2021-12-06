const mockData = {
    "main": {
        "body": [
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": "thing"
                            },
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "A long string teehee"
                                }
                            ]
                        },
                        {
                            "type": "StringLiteral",
                            "value": " world!"
                        }
                    ]
                }
            },
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "value": "hello"
                        },
                        {
                            "type": "StringLiteral",
                            "value": " world!"
                        }
                    ]
                }
            },
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "value": "more"
                        },
                        {
                            "type": "StringLiteral",
                            "value": " concatenation!"
                        }
                    ]
                }
            }
        ]
    }
};

export default mockData;