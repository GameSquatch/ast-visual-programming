const mockData = {
    "main": {
        "body": [
            {
                "type": "ExpressionStatement",
                "location": "body.0",
                "expression": {
                    "type": "CallExpression",
                    "location": "body.0.expression",
                    "callee": {
                        "type": "MemberExpression",
                        "location": "body.0.expression.callee",
                        "object": {
                            "type": "Identifier",
                            "location": "body.0.expression.callee.object",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "location": "body.0.expression.callee.property",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "CallExpression",
                            "location": "body.0.expression.arguments.0",
                            "callee": {
                                "type": "Identifier",
                                "location": "body.0.expression.arguments.0.callee",
                                "name": "thing"
                            },
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "location": "body.0.expression.arguments.0.arguments.0",
                                    "value": "A long string teehee"
                                }
                            ]
                        },
                        {
                            "type": "StringLiteral",
                            "location": "body.0.expression.arguments.1",
                            "value": " world!"
                        }
                    ]
                }
            },
            {
                "type": "ExpressionStatement",
                "location": "body.1",
                "expression": {
                    "type": "CallExpression",
                    "location": "body.1.expression",
                    "callee": {
                        "type": "MemberExpression",
                        "location": "body.1.expression.callee",
                        "object": {
                            "type": "Identifier",
                            "location": "body.1.expression.callee.object",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "location": "body.1.expression.property",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "location": "body.1.expression.arguments.0",
                            "value": "hello"
                        },
                        {
                            "type": "StringLiteral",
                            "location": "body.1.expression.arguments.1",
                            "value": " world!"
                        }
                    ]
                }
            },
            {
                "type": "ExpressionStatement",
                "location": "body.2",
                "expression": {
                    "type": "CallExpression",
                    "location": "body.2.expression",
                    "callee": {
                        "type": "MemberExpression",
                        "location": "body.2.expression.callee",
                        "object": {
                            "type": "Identifier",
                            "location": "body.2.expression.callee.object",
                            "name": "StringUtil"
                        },
                        "property": {
                            "type": "Identifier",
                            "location": "body.2.expression.callee.property",
                            "name": "concat"
                        }
                    },
                    "arguments": [
                        {
                            "type": "StringLiteral",
                            "location": "body.2.expression.arguments.0",
                            "value": "more"
                        },
                        {
                            "type": "StringLiteral",
                            "location": "body.2.expression.arguments.1",
                            "value": " concatenation!"
                        }
                    ]
                }
            }
        ]
    }
};

export default mockData;