import { v4 as uuidv4 } from 'uuid';

const dropDataTemplates = {
    "stringUtil": (method = "concat") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: [],
        returns: "String"
    }),
    "expression": () => ({
        type: "ExpressionStatement",
        id: uuidv4(),
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