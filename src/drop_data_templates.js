
export default {
    "stringUtil": (method = "concat") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: []
    }),
    "expressionStatement": () => ({
        type: "ExpressionStatement",
        expression: null
    })
};