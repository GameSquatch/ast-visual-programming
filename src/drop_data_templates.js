
const dropDataTemplates = {
    "stringUtil": (method = "concat") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: []
    }),
    "expressionStatement": () => ({
        type: "ExpressionStatement",
        expression: null
    }),
    "AssignmentExpression": (leftIdentifierName = "") => ({
        type: "AssignmentExpression",
        left: {
            type: "Identifier",
            name: leftIdentifierName
        },
        right: null
    })
};

export default dropDataTemplates;