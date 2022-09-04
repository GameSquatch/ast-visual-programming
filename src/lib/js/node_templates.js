import { v4 as uuidv4 } from 'uuid';
import typeDefs from './type_definitions.js';
import { utilDefs } from './util_definitions.js';


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
 * @property {string} dataType
 * @property {Array.<LiteralNode|UtilityCallExpressionData|RefIdentifier|FunctionCallExpression>} arguments
 */


const nodeTemplates = {
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.utilDefName
     * @param {string} spec.methodName
     */
    util: function({ utilDefName, methodName }) {
        const methodDefinition = utilDefs[utilDefName][methodName];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: utilDefName,
            utilityMethod: methodName,
            arguments: definitionArgs.map((arg) => {
                const argTypeAdj = arg.dataType + 'Literal';
                const argNodeData = this[argTypeAdj]();
                return {
                    nodeData: argNodeData,
                    ...arg
                }
            }),
            dataType: methodDefinition.returnType
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.method
     * @param {string} spec.dataType
     * @param {Object} spec.refData
     */
    identifierRefCallExpression: function({ method, dataType, refData }) {
        const methodDefinition = typeDefs[refData.dataType][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "IdentifierRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType) => {
                const argNodeData = this[argType.dataType + "Literal"]();
                return {
                    nodeData: argNodeData,
                    ...argType
                };
            }),
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
     * @param {Object} [spec.testData] 
     * @returns {Object}
     */
    ifStatement: ({ testData } = { testData: null}) => {
        return {
            type: "IfStatement",
            id: uuidv4(),
            test: testData,
            consequent: {
                body: []
            },
            alternate: {
                body: []
            }
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

    returnStatement: function ({ functionId, returnType }) {
        return {
            type: "ReturnStatement",
            functionId,
            returnType,
            expression: this[returnType + 'Literal']()
        };
    },
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
    /** @type {({ value: boolean }) => LiteralNode} */
    BooleanLiteral: ({ value } = { value: false }) => ({
        type: "BooleanLiteral",
        value,
        dataType: "Boolean"
    }),
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.fileId - The id that refers back to the file metadata writable store
     * @param {Object} spec.objectFlowData
     * @returns {FunctionCallExpression}
     */
    "function": function({ fileId, objectFlowData }) {
        return {
            type: "FunctionCallExpression",
            fileId,
            arguments: [],
            dataType: objectFlowData.returnType
        };
    }
};

export default nodeTemplates;