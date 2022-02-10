const doActionDataDrag = () => ({ "dragType": "expression" });
const stringUtilDataDrag = () => ({ "dragType": "StringUtil" });

/**
 * Creates the drag start data for moving an ExpressionStatement within a flow
 * @param {Object.<string, *>} expressionNode The portion of the AST that represents the expression
 * and the subtree under it.
 * @returns {{ dragType: string, node: Object.<string, *> }}
 */
const moveExpressionDrag = (expressionNode) => ({ "dragType": "moveExpression", "node": expressionNode });


/**
 * @typedef {{ name: string, type: string, value: string|number }} VariableData
 */
/**
 * Creates the drag start data for dragging a variable from a function info tab
 * @param {VariableData}
 * @returns {{ dragType: string, data: VariableData }}
 */
const variableDrag = (variableData) => ({ "dragType": "variable", "data": variableData });


export { doActionDataDrag, stringUtilDataDrag, moveExpressionDrag, variableDrag };