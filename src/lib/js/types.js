/**
 * @callback DragHandler
 * @param {DragEvent} event
 */


/**
 * @typedef {Object} Literal
 * @property {string} type
 * @property {*} value
 * @property {string} returns
 */

/** @typedef {Identifier|VariableRefIdentifier|ExpressionNode|AssignmentExpression|VariableRefCallExpression|UtilityCallExpression|Literal} ASTNode */

/**
 * @typedef {Object} Identifier
 * @property {string} type
 * @property {string} name
 */

/**
 * @typedef {Object} VariableRefIdentifier
 * @property {string} type
 * @property {string} refId
 * @property {string} returns
 * @property {string} fnRefType
 */



/**
 * @typedef {Object} AssignmentExpression
 * @property {string} type
 * @property {VariableRefIdentifier} left
 * @property {VariableRefIdentifier|VariableRefCallExpression|UtilityCallExpression} right
 */

/**
 * @typedef {Object} VariableRefCallExpression
 * @property {string} type
 * @property {Literal} variable
 * @property {string} method
 * @property {Literal[]} arguments
 * @property {string} returns
 */

/**
 * @typedef {Object} UtilityCallExpression
 * @property {string} type
 * @property {string} utilityName
 * @property {string} utilityMethod
 * @property {Literal[]} arguments
 * @property {string} returns
 */

/**
 * @typedef NodeTemplates
 * @property {(method: string) => UtilityCallExpression} StringUtil
 * @property {(options: {method: string, returns: string, refData: FunctionRefData, fnRefType: string }) => VariableRefCallExpression} variableRefCallExpression
 * @property {() => ExpressionNode} expression
 * @property {(options: {refId: string, returns: string}) => AssignmentExpression} variableRefAssignment
 * @property {(options: {refId: string, returns: string}) => VariableIdentifier} variableRefIdentifer
 * @property {(options: {value: string}) => Literal} StringLiteral
 * @property {(options: {value: number}) => Literal} IntegerLiteral
 */


/**
 * @typedef {Object} TypeMethod
 * @property {string[]} args
 * @property {boolean} infiniteArgs
 * @property {string} returns
 */
/**
 * @typedef {{method: TypeMethod}} TypeDefinition
 */
/**
 * @typedef {{type: TypeDefinition}} TypeDefinitionWrapper
 */