
const dropDataTemplates = {
    "stringUtil": (method = "concat", returnType = "String") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: [],
        returns: returnType
    }),
    "expressionStatement": () => ({
        type: "ExpressionStatement",
        expression: null
    }),
    "AssignmentExpression": ({ name = "", type = ""}) => ({
        type: "AssignmentExpression",
        left: {
            type: "Identifier",
            name,
            returns: type
        },
        right: null
    })
};

export default dropDataTemplates;