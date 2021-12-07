import store from './store/index.js';
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

const dropModifyObjectHandler = (stateCommitObj) => (event) => {
    const dragData = getDragData(event);
    const dropTemplateObj = dropDataTemplates[dragData.type]();

    stateCommitObj.node = dropTemplateObj;
    store.commit('addNode', stateCommitObj);
};

const dropInsertHandler = (commitConfig) => (event) => {
    const dragData = getDragData(event);
    const expressionStatement = dropDataTemplates.expressionStatement();

    // Since we are creating a new object in a flow, we need to make sure that
    // we wrap the node we are creating in an Expression Statement
    if (dragData.type !== 'expressionStatement') {
        expressionStatement.expression = dropDataTemplates[dragData.type]();
    }

    commitConfig.node = expressionStatement;
    store.commit('insertNode', commitConfig);
};

export { dragStartHandler, dropModifyObjectHandler, dropInsertHandler };