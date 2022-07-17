/** @typedef {() => DragStartConfig} DragStartDataCreator */

/**
 * @typedef {Object} DragStartConfig
 * @property {string} dragType
 * @property {Object} [nodeData]
 * @property {string} [dragDataType="none"]
 * @property {Object} [dragData]
 */

/**
 * @typedef {Object} ExpressionNode
 * @property {string} type
 * @property {string} id uuid
 * @property {Object} [expression]
 */

/**
 * 
 * @param {DragStartConfig} dragStartConfig
 * @returns {DragStartConfig}
 */
function createDragObject({ dragType, dragDataType = "none", nodeData, dragData }) {
    const dragObj = {
        dragType,
        dragDataType
    };

    if (nodeData) {
        dragObj.nodeData = nodeData;
    }

    if (dragData) {
        dragObj.dragData = dragData
    }

    return dragObj;
}

/** @type {DragStartDataCreator} */
const doActionDataDrag = () => createDragObject({ dragType: "expression" });
/** @type {DragStartDataCreator} */
const stringUtilDataDrag = () => createDragObject({ dragType: "stringUtil" });

/**
 * @callback MoveExpressionDragStartDataCreator Creates the drag start data for moving an ExpressionStatement within a flow
 * @param {ExpressionNode} expressionNode The portion of the AST that represents the expression
 * and the subtree under it.
 * @param {number} [currentIndex] If the expression is within a list (most likely), it's current place within that list
 * @returns {DragStartConfig}
 */

/** @type {MoveExpressionDragStartDataCreator} */
const moveExpressionDrag = (expressionNode, currentIndex) => createDragObject({ dragType: "moveExpression", nodeData: { ...expressionNode }, dragData: { currentIndex } });

/**
 * @typedef {Object} FunctionRefData
 * @property {string} name
 * @property {string} returns
 * @property {string|number} defaultValue
 * @property {string} refId
 * @property {string} [fnRefType]
 */
/**
 * @callback VariableDragStartDataCreator Creates the drag start data for dragging a variable from a function info tab
 * @param {FunctionRefData} varRefData
 * @returns {DragStartConfig}
 */
/** @type {VariableDragStartDataCreator} */
const variableRefObjectDrag = (varRefData) => createDragObject({ dragType: "variableRef", dragDataType: varRefData.returns, dragData: { ...varRefData } });


/**
 * @param {{ metadataId: string }} functionData
 * @returns {DragStartConfig}
 */
const navFunctionDrag = (functionData) => createDragObject({ dragType: "function", dragData: { ...functionData } });


export { doActionDataDrag, stringUtilDataDrag, moveExpressionDrag, variableRefObjectDrag, navFunctionDrag };