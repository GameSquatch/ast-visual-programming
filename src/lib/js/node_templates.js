import { v4 as uuidv4 } from 'uuid';
import typeDefs from './type_definitions.js';


/**
 * @typedef {Object} UtilityCallExpressionData
 * @property {string} type
 * @property {string} utilityName
 * @property {string} utilityMethod
 * @property {LiteralNode[]} arguments
 * @property {string} dataType
 */

/**
 * @typedef {Object} LiteralNode
 * @property {string} type
 * @property {string|number|boolean} value
 * @property {string} dataType
 */

/**
 * @typedef {Object} VariableRefCallExpression
 * @property {string} type
 * @property {Object} refData
 * @property {string} method
 * @property {Array.<LiteralNode|UtilityCallExpressionData|RefIdentifier|FunctionCallExpression>} arguments
 * @property {string} dataType
 */

/**
 * @typedef {Object} FlowStep
 * @property {string} type
 * @property {string} id
 * @property {null} expression
 */

/**
 * @typedef {Object} RefIdentifier
 * @property {string} type
 * @property {string} refId
 * @property {string} dataType
 * @property {string} fnRefType
 */

/**
 * @typedef {Object} RefAssignment
 * @property {string} type
 * @property {RefIdentifier} left
 * @property {UtilityCallExpressionData|VariableRefCallExpression|LiteralNode} right
 */

/**
 * @typedef {Object} FunctionCallExpression
 * @property {string} type
 * @property {string} fileId
 * @property {Array.<LiteralNode|UtilityCallExpressionData|RefIdentifier|FunctionCallExpression>} arguments
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
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]()),
            dataType: methodDefinition.returnType
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.method
     * @param {string} spec.dataType
     * @param {Object} spec.refData
     * @returns {VariableRefCallExpression}
     */
    identifierRefCallExpression: function({ method, dataType, refData }) {
        const methodDefinition = typeDefs[refData.dataType][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "IdentifierRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]()),
            dataType
        };
    },
    /** @type {() => FlowStep} */
    flowStep: () => {
        const newUuid = uuidv4();
        return {
            type: "FlowStep",
            id: newUuid,
            expression: null
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.refId
     * @param {string} spec.dataType
     * @param {string} spec.fnRefType
     * @returns {RefAssignment}
     */
    variableRefAssignment: function({ refId, dataType, fnRefType }) {
        return {
            type: "AssignmentExpression",
            left: {
                type: "RefIdentifier",
                refId,
                dataType,
                fnRefType
            },
            right: this[dataType + 'Literal']()
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.refId
     * @param {string} spec.dataType
     * @param {string} spec.fnRefType
     * @returns {RefIdentifier}
     */
    variableRefIdentifer: ({ refId, dataType, fnRefType }) => ({
        type: "RefIdentifier",
        refId,
        dataType,
        fnRefType
    }),
    // Capitalizing because it matches the 'type' field in the AST
    /** @type {({ value: string }) => LiteralNode} */
    StringLiteral: ({ value } = { value: "" }) => ({
        type: "StringLiteral",
        value: value,
        dataType: "String"
    }),
    // Capitalizing because it matches the 'type' field in the AST
    /** @type {({ value: number }) => LiteralNode} */
    IntegerLiteral: ({ value } = { value: 0 }) => ({
        type: "IntegerLiteral",
        value,
        dataType: "Integer"
    }),
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.fileId - The id that refers back to the file metadata writable store
     * @returns {FunctionCallExpression}
     */
    "function": function({ fileId }) {
        return {
            type: "FunctionCallExpression",
            fileId,
            arguments: []
        };
    }
};

export default nodeTemplates;