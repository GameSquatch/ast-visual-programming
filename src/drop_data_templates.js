
const dropDataTemplates = {
    "stringUtil": (method = "concat", returnType = "String") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: [],
        returns: returnType
    }),
    "expression": () => ({
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
    }),
    "variableExpression": ({ name = "", type = ""}) => ({
        type: "AssignmentExpression",
        left: {
            type: "Identifier",
            name,
            returns: type
        },
        right: null
    }),
    "variableValue": ({ name = "", type = "" }) => ({
        type: "Identifier",
        name,
        returns: type
    })
};

export default dropDataTemplates;