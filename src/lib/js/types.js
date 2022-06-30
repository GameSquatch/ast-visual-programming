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

/** @typedef {Identifier|FunctionRefIdentifier|ExpressionNode|AssignmentExpression|FunctionRefCallExpression|UtilityCallExpression|Literal} ASTNode */

/**
 * @typedef {Object} Identifier
 * @property {string} type
 * @property {string} name
 */

/**
 * @typedef {Object} FunctionRefIdentifier
 * @property {string} type
 * @property {string} refId
 * @property {string} returns
 * @property {string} fnRefType
 */



/**
 * @typedef {Object} AssignmentExpression
 * @property {string} type
 * @property {FunctionRefIdentifier} left
 * @property {FunctionRefIdentifier|FunctionRefCallExpression|UtilityCallExpression} right
 */

/**
 * @typedef {Object} FunctionRefCallExpression
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
 * @property {(options: {method: string, returns: string, refData: FunctionRefData, fnRefType: string }) => FunctionRefCallExpression} functionRefCallExpression
 * @property {() => ExpressionNode} expression
 * @property {(options: {refId: string, returns: string}) => AssignmentExpression} functionRefAssignment
 * @property {(options: {refId: string, returns: string}) => VariableIdentifier} functionRefIdentifer
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