/** @typedef {() => DragStartConfig} DragStartDataCreator */
/** @typedef {{ name: string, type: string, value: string|number }} VariableData */

/**
 * @callback MoveExpressionDragStartDataCreator Creates the drag start data for moving an ExpressionStatement within a flow
 * @param {ExpressionNode} expressionNode The portion of the AST that represents the expression
 * and the subtree under it.
 * @param {number} [currentIndex] If the expression is within a list (most likely), it's current place within that list
 * @returns {DragStartConfig}
 */

/**
 * @typedef {Object} DragStartConfig
 * @property {string} dragType
 * @property {ExpressionNode} [node]
 * @property {number} [currentIndex]
 * @property {VariableData} [data]
 */

/**
 * @callback VariableDragStartDataCreator Creates the drag start data for dragging a variable from a function info tab
 * @param {VariableData}
 * @returns {DragStartConfig}
 */


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

/**
 * @typedef {Object} VarIdentifier
 * @property {string} type
 * @property {string} refId
 * @property {string} returns
 */

/**
 * @typedef {Object} ExpressionNode
 * @property {string} type
 * @property {string} id uuid
 * @property {Object} [expression]
 */

/**
 * @typedef {Object} AssignmentExpression
 * @property {string} type
 * @property {VarIdentifier} left
 * @property {VarIdentifier|VarCallExpression|UtilityCallExpression} right
 */

/**
 * @typedef {Object} VarCallExpression
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
 * @property {(options: {method: string, returns: string, variable: Literal}) => VarCallExpression} varCallExpression
 * @property {() => ExpressionNode} expression
 * @property {(options: {refId: string, returns: string}) => AssignmentExpression} variableAssignment
 * @property {(options: {refId: string, returns: string}) => VariableIdentifier} variableIdentifier
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