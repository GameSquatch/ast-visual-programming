/** @typedef {() => DragStartConfig} DragStartDataCreator */
/**
 * @typedef {Object} FunctionRefData
 * @property {string} name
 * @property {string} returns
 * @property {string|number} value
 * @property {string} [fnRefType]
 */

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
 * @property {FunctionRefData} [data]
 */

/**
 * @callback VariableDragStartDataCreator Creates the drag start data for dragging a variable from a function info tab
 * @param {FunctionRefData} fnRefData
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
 * @typedef {Object} ExpressionNode
 * @property {string} type
 * @property {string} id uuid
 * @property {Object} [expression]
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