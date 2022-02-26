import nodeTemplates from './node_templates.js';
import typeDefs from './type_definitions.js';
import { v4 as uuidv4 } from 'uuid';


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


const dragDataTypeMatchesContext = (dragData, contextType) => {
    if ((dragData.data?.returns ?? false) && contextType !== undefined) {
        if (dragData.data.returns !== contextType) {
            return false;
        }
        return true;
    }
};


// This finds a method for the string util that matches the context's type, if any,
// so the drop data template can be created with that method as the starting, selected method
const findReturnTypeMatch = (utilType) => (contextType) => {
    for (let methodName of Object.keys(typeDefs[utilType])) {
        const method = typeDefs[utilType][methodName];
        if (method.returns === contextType) {
            return methodName;
        }
    }
    return null;
}
const findStringUtilTypeMatch = findReturnTypeMatch("StringUtil");


const wrapWithExpression = (node) => {
    const expr = nodeTemplates.expression();
    expr.expression = node;
    return expr;
}


/**
 * @param {Object} dragData - The DragEvent data parsed into an object
 * @param {string} type - Data type
 * @returns {?Object.<string, *>} Returns either null or the ast node to be created from dropping this stringUtil
 */
const stringUtilFromTypedContext = (dragData, contextType) => {
    const methodName = findStringUtilTypeMatch(contextType);
    if (methodName === null) return null;
    return nodeTemplates.StringUtil(methodName, contextType);
};


const variableFromTypedContext = (dragData, contextType) => {
    const variableTypeMatchesContext = dragDataTypeMatchesContext(dragData, contextType);
    
    if (variableTypeMatchesContext) {
        return nodeTemplates.variableIdentifier(dragData.data);
    }

    const method = findReturnTypeMatch(dragData.data.returns)(contextType);
    if (method === null) alert("Types don't match and no methods exist to match the type");
    
    return method !== null
        ? nodeTemplates.varCallExpression({
            method: method,
            returns: contextType,
            variable: nodeTemplates.variableIdentifier({ refId: dragData.data.refId, returns: dragData.data.returns })
        })
        : null;
};

const noNode = (dragData, contextType) => null;


const dropContextMap = {
    // dragType
    variable: {
        // context name
        flow: (dragData, contextType) => wrapWithExpression(nodeTemplates.variableExpression(dragData.data)),
        expression: (dragData, contextType) => {console.log('dragdata', dragData); return nodeTemplates.variableExpression(dragData.data);},
        assignment: variableFromTypedContext,
        argument: variableFromTypedContext
    },
    StringUtil: {
        flow: (dragData, contextType) => wrapWithExpression(nodeTemplates.StringUtil()),
        expression: (dragData, contextType) => nodeTemplates.StringUtil(),
        assignment: stringUtilFromTypedContext,
        argument: stringUtilFromTypedContext
    },
    expression: {
        flow: (dragData, contextType) => nodeTemplates.expression(),
        expression: noNode,
        assignment: noNode,
        argument: noNode
    },
    moveExpression: {
        flow: (dragData, contextType) => {
            dragData.node.id = uuidv4();
            return dragData.node;
        },
        expression: (dragData, contextType) => dragData.node,
        assignment: noNode,
        argument: noNode
    }
}

/**
 * @callback stateChangeCallback
 * @param {Object.<string, *>} node - The ast node being created from the drop that occurred or null
 * if nothing should happen
 */
/**
 * @callback dragEventHandler
 * @param {DragEvent} dragEvent The DragEvent passed from the original event handler
 */
/**
 * @param {Object} dropConfig
 * @param {string} dropConfig.contextName The name of the component in which the drop event occurs. If I
 * drop in something into an assigment, the context would be 'assignment'. See the structure above
 * in 'drag_and_drop_handlers.js'
 * @param {string} [dropConfig.contextType] The data type of the context component
 * @param {stateChangeCallback} dropConfig.stateChangeCallback What gets called to modify state once the drop
 * has occurred and an ast node has been created and passed to this callback
 * @returns {dragEventHandler}
 */
const flowDropHandler = ({ contextName, contextType, stateChangeCallback }) => (dragEvent) => {
    const dragData = getDragData(dragEvent);

    const node = dropContextMap[dragData.dragType][contextName](dragData, contextType);
    
    stateChangeCallback(node);
};

export { dragStartHandler, flowDropHandler };