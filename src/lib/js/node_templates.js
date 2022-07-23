import { v4 as uuidv4 } from 'uuid';
import typeDefs from './type_definitions.js';


/**
 * 
 */


const nodeTemplates = {
    StringUtil: function(method = "concat") {
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
    variableRefCallExpression: function({ method, returns, refData, fnRefType }) {
        const methodDefinition = typeDefs[refData.returns][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "VariableRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            returns,
            fnRefType
        };
    },
    expression: () => {
        const newUuid = uuidv4();
        return {
            type: "ExpressionStatement",
            id: newUuid,
            expression: null
        };
    },
    variableRefAssignment: ({ refId, returns, fnRefType }) => ({
        type: "AssignmentExpression",
        left: {
            type: "VariableRefIdentifier",
            refId,
            returns,
            fnRefType
        },
        right: null
    }),
    variableRefIdentifer: ({ refId, returns, fnRefType }) => ({
        type: "VariableRefIdentifier",
        refId,
        returns,
        fnRefType
    }),
    // Capitalizing because it matches the 'type' field in the AST
    StringLiteral: ({ value = "" }) => ({
        type: "StringLiteral",
        value: value,
        returns: "String"
    }),
    // Capitalizing because it matches the 'type' field in the AST
    IntegerLiteral: ({ value = 0 }) => ({
        type: "IntegerLiteral",
        value,
        returns: "Integer"
    }),
    /**
     * @param {Object} config
     * @param {string} config.fileId - The id that refers back to the file metadata writable store
     * @param {Object} config.objectFlowData
     * @param {import('../../components/side_nav/file_tree.js').FunctionParameterConfig} config.objectFlowData.parameters
     * @returns {{ type: string, fileId: string, arguments: Array }}
     */
    "function": function({ fileId, objectFlowData }) {
        return {
            type: "FunctionCallExpression",
            fileId,
            arguments: Object.keys(objectFlowData.parameters).map((param) => this[objectFlowData.parameters[param].returns + 'Literal']({}))
        };
    }
};

export default nodeTemplates;