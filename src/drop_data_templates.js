import { v4 as uuidv4 } from 'uuid';
import typeDefs from './type_definitions.js';

const dropDataTemplates = {
    "StringUtil": function(method = "concat") {
        const methodDefinition = typeDefs['StringUtil'][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: "StringUtil",
            utilityMethod: method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            returns: methodDefinition.returns
        };
    },
    "typeUtil": function({ method, returns, variableName }) {
        const methodDefinition = typeDefs[variableName.returns][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "VarCallExpression",
            variableName: {...variableName},
            method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            returns
        };
    },
    "expression": () => {
        const newUuid = uuidv4();
        return {
            type: "ExpressionStatement",
            id: newUuid,
            expression: null
        };
    },
    "AssignmentExpression": ({ name = "", type = ""}) => ({
        type: "AssignmentExpression",
        left: {
            type: "Identifier",
            name,
            returns: type
        },
        right: null
    }),
    "variableExpression": ({ refId, type = ""}) => ({
        type: "AssignmentExpression",
        left: {
            type: "VarIdentifier",
            refId,
            returns: type
        },
        right: null
    }),
    "variableValue": ({ refId, type = "" }) => ({
        type: "VarIdentifier",
        refId,
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