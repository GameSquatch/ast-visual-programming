
export default {
    "stringUtil": () => ({
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: "StringUtil"
            },
            property: {
                type: "Identifier",
                name: "concat"
            }
        },
        arguments: []
    }),
    "expressionStatement": () => ({
        type: "ExpressionStatement",
        expression: null
    })
};