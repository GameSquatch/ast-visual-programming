import type { FileDragData, FunctionRefData } from "../../../common_types.js";

interface DragStartConfig {
    dragType: string,
    nodeData?: Object,
    dragDataType?: "none" | string,
    dragData?: Object
}

interface FlowStepNode {
    type: string,
    id: string,
    expression?: Object
}

function createDragObject({ dragType, dragDataType = "none", nodeData, dragData }: DragStartConfig): DragStartConfig {
    const dragObj: DragStartConfig = {
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

function doActionDataDrag(): DragStartConfig {
    return createDragObject({ dragType: "flowStep" });
}

function utilDataDrag({ utilDefName }: { utilDefName: string }): DragStartConfig {
    return createDragObject({ dragType: "util", dragData: { utilDefName } });
}


function moveFlowStepDrag({ flowStepFromPath, flowStepData }: { flowStepFromPath: string, flowStepData: FlowStepNode }): DragStartConfig {
    return createDragObject({ dragType: "moveFlowStep", nodeData: flowStepData, dragData: { flowStepFromPath } });
}


function fnInfoRefObjectDrag(refData: FunctionRefData): DragStartConfig {
    return createDragObject({ dragType: refData.dragType, dragDataType: refData.dataType, dragData: { ...refData } });
}


function navFileDrag(fileData: FileDragData): DragStartConfig {
    return createDragObject({ dragType: 'file', dragData: { ...fileData } });
}


function navFolderDrag(folderData) {
    return createDragObject({ dragType: 'folder', dragData: { ...folderData } });
}


function returnStatementDrag(functionData) {
    return createDragObject({ dragType: 'return', dragData: { ...functionData } });
}


export {
    doActionDataDrag,
    moveFlowStepDrag,
    fnInfoRefObjectDrag,
    navFileDrag,
    navFolderDrag,
    utilDataDrag,
    returnStatementDrag
};