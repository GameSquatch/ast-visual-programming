/**
 * @callback DragHandler
 * @param {DragEvent} event
 */


/**
 * @typedef {Object} Literal
 * @property {string} type
 * @property {*} value
 * @property {string} dataType
 */

/** @typedef {Identifier|RefIdentifier|ExpressionNode|AssignmentExpression|IdentifierRefCallExpression|UtilityCallExpression|Literal} ASTNode */

/**
 * @typedef {Object} Identifier
 * @property {string} type
 * @property {string} name
 */

/**
 * @typedef {Object} RefIdentifier
 * @property {string} type
 * @property {string} refId
 * @property {string} dataType
 * @property {string} fnRefType
 */



/**
 * @typedef {Object} IdentifierRefCallExpression
 * @property {string} type
 * @property {Literal} variable
 * @property {string} method
 * @property {Literal[]} arguments
 * @property {string} dataType
 */

/**
 * @typedef {Object} UtilityCallExpression
 * @property {string} type
 * @property {string} utilityName
 * @property {string} utilityMethod
 * @property {Literal[]} arguments
 * @property {string} dataType
 */

/**
 * @typedef NodeTemplates
 * @property {(method: string) => UtilityCallExpression} StringUtil
 * @property {(options: {method: string, dataType: string, refData: FunctionRefData, fnRefType: string }) => IdentifierRefCallExpression} identifierRefCallExpression
 * @property {() => ExpressionNode} expression
 * @property {(options: {refId: string, dataType: string}) => AssignmentExpression} variableRefAssignment
 * @property {(options: {refId: string, dataType: string}) => VariableIdentifier} variableRefIdentifer
 * @property {(options: {value: string}) => Literal} StringLiteral
 * @property {(options: {value: number}) => Literal} IntegerLiteral
 */


/**
 * @typedef {Object} TypeMethod
 * @property {string[]} args
 * @property {boolean} infiniteArgs
 * @property {string} dataType
 */
/**
 * @typedef {{method: TypeMethod}} TypeDefinition
 */
/**
 * @typedef {{type: TypeDefinition}} TypeDefinitionWrapper
 */