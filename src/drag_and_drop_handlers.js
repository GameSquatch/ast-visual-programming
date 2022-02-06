import dropDataTemplates from './drop_data_templates.js';
import typeDefs from './utility_definitions.js';


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


const findReturnTypeMatch = (utilType) => (type) => {
    for (let methodName of Object.keys(typeDefs[utilType])) {
        const method = typeDefs[utilType][methodName];
        if (method.returns === type) {
            return methodName;
        }
    }
    return null;
}
const findStringUtilTypeMatch = findReturnTypeMatch("StringUtil");


const wrapWithExpression = (node) => {
    const expr = dropDataTemplates.expression();
    expr.expression = node;
    return expr;
}


const dropContextMap = {
    // dragType
    variable: {
        // context
        flow: (dragData, _) => wrapWithExpression(dropDataTemplates.variableExpression(dragData.data)),
        expression: (dragData, _) => dropDataTemplates.variableExpression(dragData.data),
        assignment: (dragData, _) => dropDataTemplates.variableValue(dragData.data),
        argument: (dragData, _) => dropDataTemplates.variableValue(dragData.data)
    },
    stringUtil: {
        flow: (_, type) => wrapWithExpression(dropDataTemplates.stringUtil()),
        expression: (_, type) => dropDataTemplates.stringUtil(),
        assignment: (_, type) => {
            const methodName = findStringUtilTypeMatch(type);
            if (methodName === null) return null;
            return dropDataTemplates.stringUtil(methodName, type);
        },
        argument: (_, type) => {
            const methodName = findStringUtilTypeMatch(type);
            if (methodName === null) return null;
            return dropDataTemplates.stringUtil(methodName, type);
        }
    },
    expression: {
        flow: (dragData) => dropDataTemplates.expression(),
        expression: (dragData) => null,
        assignment: (dragData) => null,
        argument: (dragData) => null
    },
    moveExpression: {
        flow: (dragData, _) => dragData.node,
        expression: (dragData, _) => dragData.node,
        assignment: (dragData, _) => null,
        argument: (dragData, _) => null
    }
}


const createDropNodeFromContext = (context, dragEvent, type) => {
    const dragData = getDragData(dragEvent);

    // Drag type checking
    if ((dragData.data?.type ?? false) && type !== undefined) {
        if (dragData.data.type !== type) {
            return null;
        }
    }

    let node = dropContextMap[dragData.dragType][context](dragData, type);

    return node;
};

export { dragStartHandler, createDropNodeFromContext };