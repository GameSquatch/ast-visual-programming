/** @type {DragStartDataCreator} */
const doActionDataDrag = () => ({ dragType: "expression" });
/** @type {DragStartDataCreator} */
const stringUtilDataDrag = () => ({ dragType: "StringUtil" });

/** @type {MoveExpressionDragStartDataCreator} */
const moveExpressionDrag = (expressionNode, currentIndex) => ({ dragType: "moveExpression", node: expressionNode, currentIndex });

/** @type {VariableDragStartDataCreator} */
const functionRefObjectDrag = (variableData) => ({ dragType: "functionRef", data: variableData });


export { doActionDataDrag, stringUtilDataDrag, moveExpressionDrag, functionRefObjectDrag };