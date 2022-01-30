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

const dropModifyObjectHandler = (event) => {
    const dragData = getDragData(event);
    const replacingNode = dragData;

    return replacingNode;
};


const dropInsertAstCreation = (event) => {
    const dragData = getDragData(event);
    const expressionStatement = dropDataTemplates.expressionStatement();

    // Since we are creating a new object in a flow, we need to make sure that
    // we wrap the node we are creating in an Expression Statement
    if (dragData.type !== 'ExpressionStatement') {
        expressionStatement.expression = dragData;
    }

    return expressionStatement;
}

export { dragStartHandler, dropModifyObjectHandler, dropInsertAstCreation };