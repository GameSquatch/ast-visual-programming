import { v4 as uuidv4 } from 'uuid';

const dropDataTemplates = {
    "stringUtil": (method = "concat") => ({
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        arguments: [
            // {
            //     type: "StringLiteral",
            //     value: "",
            //     returns: "String"
            // },
            // {
            //     type: "StringLiteral",
            //     value: "",
            //     returns: "String"
            // }
        ],
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
    }),
    // Capitalizing because it matches the 'type' field in the AST
    "StringLiteral": ({ value = "" }) => ({
        type: "StringLiteral",
        value: value,
        returns: "String"
    }),
    // Capitalizing because it matches the 'type' field in the AST
    "IntegerLiteral": ({ value = 0 }) => ({
        type: "IntegerLiteral",
        value,
        returns: "Integer"
    })
};

export default dropDataTemplates;