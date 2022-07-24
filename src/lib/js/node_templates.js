import { v4 as uuidv4 } from 'uuid';
import typeDefs from './type_definitions.js';


/**
 * @typedef {Object} UtilityCallExpressionData
 * @property {string} type
 * @property {string} utilityName
 * @property {string} utilityMethod
 * @property {string[]} arguments
 * @property {string} dataType
 */


const nodeTemplates = {
    /**
     * @type {(method: string) => UtilityCallExpressionData}
     */
    StringUtil: function(method = "concat") {
        const methodDefinition = typeDefs['StringUtil'][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: "StringUtil",
            utilityMethod: method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            dataType: methodDefinition.returnType
        };
    },
    variableRefCallExpression: function({ method, dataType, refData, fnRefType }) {
        const methodDefinition = typeDefs[refData.dataType][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "IdentifierRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            dataType,
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
    variableRefAssignment: ({ refId, dataType, fnRefType }) => ({
        type: "AssignmentExpression",
        left: {
            type: "RefIdentifier",
            refId,
            dataType,
            fnRefType
        },
        right: null
    }),
    variableRefIdentifer: ({ refId, dataType, fnRefType }) => ({
        type: "RefIdentifier",
        refId,
        dataType,
        fnRefType
    }),
    // Capitalizing because it matches the 'type' field in the AST
    StringLiteral: ({ value = "" }) => ({
        type: "StringLiteral",
        value: value,
        dataType: "String"
    }),
    // Capitalizing because it matches the 'type' field in the AST
    IntegerLiteral: ({ value = 0 }) => ({
        type: "IntegerLiteral",
        value,
        dataType: "Integer"
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
            arguments: []
        };
    }
};

export default nodeTemplates;