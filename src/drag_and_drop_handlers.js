import dropDataTemplates from './drop_data_templates.js';


const getDragData = (event) => JSON.parse(event.dataTransfer.getData('text/json'));
/**
 * @callback DragCallback
 * @param {DragEvent} event
 */

/**
 * @param {Object} dragData 
 * @returns {DragCallback}
 */
const dragStartHandler = (dragData) => (event) => {
    event.dataTransfer.setData('text/json', JSON.stringify(dragData));
    event.dataTransfer.dropEffect = 'copy';
};


const wrapWithExpression = (node) => {
    const expr = dropDataTemplates.expression();
    expr.expression = node;
    return expr;
}


const dropContextMap = {
    // dragType
    variable: {
        // context
        flow: (dragData) => wrapWithExpression(dropDataTemplates.variableExpression(dragData.data)),
        expression: (dragData) => dropDataTemplates.variableExpression(dragData.data),
        assignment: (dragData) => dropDataTemplates.variableValue(dragData.data),
        argument: (dragData) => dropDataTemplates.variableValue(dragData.data)
    },
    stringUtil: {
        flow: (dragData) => wrapWithExpression(dropDataTemplates.stringUtil()),
        expression: (dragData) => dropDataTemplates.stringUtil(),
        assignment: (dragData) => dropDataTemplates.stringUtil(),
        argument: (dragData) => dropDataTemplates.stringUtil()
    },
    expression: {
        flow: (dragData) => dropDataTemplates.expression(),
        expression: (dragData) => null,
        assignment: (dragData) => null,
        argument: (dragData) => null
    }
}


const createDropNodeFromContext = (context, dragEvent, type) => {
    const dragData = getDragData(dragEvent);

    // Type checking
    if ((dragData.data?.type ?? false) && type !== undefined) {
        if (dragData.data.type !== type) {
            return null;
        }
    }

    let node = dropContextMap[dragData.dragType][context](dragData);

    return node;
};

export { dragStartHandler, createDropNodeFromContext };