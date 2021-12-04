import store from './store/index.js';
import dropDataTemplates from './drop_data_templates.js';

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
/**
 * 
 * @param {String} stateCommitName 
 * @param {Object} stateCommitObj 
 * @returns {DragCallback}
 */
const dropNewObjectHandler = (stateCommitObj) => (event) => {
    const dragData = JSON.parse(event.dataTransfer.getData('text/json'));

    const expressionStatement = dropDataTemplates.expressionStatement();

    // Since we are creating a new object in a flow, we need to make sure that
    // we wrap the node we are creating in an Expression Statement
    if (dragData.type !== 'expressionStatement') {
        expressionStatement.expression = dropDataTemplates[dragData.type]();
    }

    stateCommitObj.node = expressionStatement;
    store.commit('insertNode', stateCommitObj);
};

const dropModifyObjectHandler = (stateCommitObj) => (event) => {
    const dragData = JSON.parse(event.dataTransfer.getData('text/json'));
    const dropTemplateObj = dropDataTemplates[dragData.type]();

    stateCommitObj.node = dropTemplateObj;
    store.commit('addNode', stateCommitObj);
};

export { dragStartHandler, dropNewObjectHandler, dropModifyObjectHandler };