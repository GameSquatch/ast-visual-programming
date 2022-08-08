/** @typedef {() => DragStartConfig} DragStartDataCreator */

/**
 * @typedef {Object} DragStartConfig
 * @property {string} dragType
 * @property {Object} [nodeData]
 * @property {string} [dragDataType="none"]
 * @property {Object} [dragData]
 */

/**
 * @typedef {Object} FlowStepNode
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
function doActionDataDrag() {
    return createDragObject({ dragType: "flowStep" });
}

function utilDataDrag({ utilDefName }) {
    return createDragObject({ dragType: "util", dragData: { utilDefName }});
}

/**
 * @callback MoveFlowStepDragStartDataCreator Creates the drag start data for moving an FlowStep within a flow
 * @param {FlowStepNode} flowStepNode The portion of the AST that represents the expression
 * and the subtree under it.
 * @param {number} [currentIndex] If the expression is within a list (most likely), it's current place within that list
 * @returns {DragStartConfig}
 */

/** @type {MoveFlowStepDragStartDataCreator} */
function moveFlowStepDrag(flowStepNode, currentIndex) {
    return createDragObject({ dragType: "moveFlowStep", nodeData: { ...flowStepNode }, dragData: { currentIndex } });
}

/**
 * @typedef {Object} FunctionRefData
 * @property {string} name
 * @property {string} dataType
 * @property {string|number} defaultValue
 * @property {string} refId
 * @property {string} dragType
 * @property {string} [fnRefType]
 */
/**
 * @callback VariableDragStartDataCreator Creates the drag start data for dragging a variable from a function info tab
 * @param {FunctionRefData} refData
 * @returns {DragStartConfig}
 */
/** @type {VariableDragStartDataCreator} */
function fnInfoRefObjectDrag(refData) {
    return createDragObject({ dragType: refData.dragType, dragDataType: refData.dataType, dragData: { ...refData } });
}


/**
 * @typedef {Object} FileDragData
 * @property {string} fileId
 * @property {string} treePath
 * @property {string} title
 * @property {string} fileType
 * @property {{ parameters: import("../../../components/side_nav/file_metadata").FunctionParameterConfig, dataType: string }} objectFlowData
 */

/**
 * @param {FileDragData} fileData
 * @returns {DragStartConfig}
 */
function navFileDrag(fileData) {
    return createDragObject({ dragType: 'file', dragData: { ...fileData } });
}


function navFolderDrag(folderData) {
    return createDragObject({ dragType: 'folder', dragData: { ...folderData } });
}


export { doActionDataDrag, moveFlowStepDrag, fnInfoRefObjectDrag, navFileDrag, navFolderDrag, utilDataDrag };