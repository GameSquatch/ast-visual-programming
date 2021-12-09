
export default {
    "stringUtil": (method = "concat") => ({
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: "StringUtil"
            },
            property: {
                type: "Identifier",
                name: method
            }
        },
        arguments: []
    }),
    "expressionStatement": () => ({
        type: "ExpressionStatement",
        expression: null
    })
};