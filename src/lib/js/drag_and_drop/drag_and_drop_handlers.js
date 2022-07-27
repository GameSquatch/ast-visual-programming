import nodeTemplates from '../node_templates.js';
import typeDefs from '../type_definitions.js';
import DropObject from './drop_object.js';


/**
 * @typedef {Object} DragObject
 * @property {{ name: string, refId: string, dataType: string, defaultValue: string, fnRefType: string }} dragData
 */

/**
 * @function
 * @param {DragEvent} event 
 * @returns {Object}
 */
function getDragData(event) {
    return JSON.parse(event.dataTransfer?.getData('text/json') ?? '{}');
}
/**
 * @callback DragCallback
 * @param {DragEvent} event
 */

/**
 * @function
 * @param {Object} dragData 
 * @returns {DragCallback}
 */
function dragStartHandler(dragData) {
    return (event) => {
        if (event.dataTransfer !== null) {
            event.dataTransfer.setData('text/json', JSON.stringify(dragData));
            event.dataTransfer.dropEffect = 'copy';
        }
    };
}


function dragDataTypeMatchesContext(dragObject, contextType) {
    if (dragObject.dragData === undefined || contextType === undefined) {
        return false;
    }

    if (dragObject.dragData.dataType === contextType) {
        return true;
    }

    return false;
}


// This finds a method for the string util that matches the context's type, if any,
// so the drop data template can be created with that method as the starting, selected method
const findReturnTypeMatch = (utilType) => (contextType) => {
    for (let methodName of Object.keys(typeDefs[utilType])) {
        const method = typeDefs[utilType][methodName];
        if (method.returnType === contextType) {
            return methodName;
        }
    }
    return null;
}
const findStringUtilTypeMatch = findReturnTypeMatch("StringUtil");


function wrapWithFlowStep(node) {
    const expr = nodeTemplates.flowStep();
    expr.expression = node;
    return expr;
}


/**
 * @function
 * @param {Object} dragObject - The DragEvent data parsed into an object
 * @param {string} contextType - Data type
 * @returns {?Object.<string, *>} Returns either null or the ast node to be created from dropping this stringUtil
 */
function stringUtilFromTypedContext(dragObject, contextType) {
    const methodName = findStringUtilTypeMatch(contextType);
    if (methodName === null) return null;
    return nodeTemplates.StringUtil(methodName);
}


/**
 * Creates an AST node for dropping a variable into a typed context
 * @function
 * @param {DragObject} dragObject
 * @param {string} contextType Data type that is required by the variable's parent, a.k.a the contextual data type
 * @returns {Object}
 */
function variableRefFromTypedContext(dragObject, contextType) {
    const variableTypeMatchesContext = dragDataTypeMatchesContext(dragObject, contextType);
    
    if (variableTypeMatchesContext) {
        return nodeTemplates.variableRefIdentifer(dragObject.dragData);
    }

    const method = findReturnTypeMatch(dragObject.dragData.dataType)(contextType);
    if (method === null) alert("Types don't match and no methods exist to match the type");
    
    return method !== null
        ? nodeTemplates.identifierRefCallExpression({
            method: method,
            dataType: contextType,
            refData: nodeTemplates.variableRefIdentifer(dragObject.dragData)
        })
        : null;
}

/**
 * Creates an AST node for dropping a variable into a typed context
 * @function
 * @param {DragObject} dragObject
 * @param {string} contextType Data type that is required by the variable's parent, a.k.a the contextual data type
 * @returns {Object}
 */
 function parameterRefFromTypedContext(dragObject, contextType) {
    const parameterTypeMatchesContext = dragDataTypeMatchesContext(dragObject, contextType);
    
    if (parameterTypeMatchesContext) {
        return nodeTemplates.parameterRefIdentifier(dragObject.dragData);
    }

    const method = findReturnTypeMatch(dragObject.dragData.dataType)(contextType);
    if (method === null) alert("Types don't match and no methods exist to match the type");
    
    return method !== null
        ? nodeTemplates.identifierRefCallExpression({
            method: method,
            dataType: contextType,
            refData: nodeTemplates.parameterRefIdentifier(dragObject.dragData)
        })
        : null;
}


function noNode(dragObject, _) {
    return new DropObject({ dragObject });
}

/**
 * @callback FunctionContextCallback
 * @param {import('./drag_start_data_creators.js').DragStartConfig} dragObject
 * @param {import('./drag_start_data_creators.js').FileDragData} dragObject.dragData
 * @param {string} dragType
 * @returns {DropObject}
 */


/**
 * @typedef {Object.<string, Function>} ContextMapper
 */

/**
 * @type {Object.<string, ContextMapper>}
 */
const dropContextMap = {
    // dragType
    variableRef: {
        // context name
        flow: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: wrapWithFlowStep(nodeTemplates.variableRefAssignment(dragObject.dragData))
        }),
        flowStep: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: nodeTemplates.variableRefAssignment(dragObject.dragData)
        }),
        assignment: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: variableRefFromTypedContext(dragObject, contextType),
        }),
        argument: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: variableRefFromTypedContext(dragObject, contextType)
        })
    },
    parameterRef: {
        flow: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: wrapWithFlowStep(nodeTemplates.parameterRefAssignment(dragObject.dragData))
        }),
        flowStep: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: nodeTemplates.parameterRefAssignment(dragObject.dragData)
        }),
        assignment: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: parameterRefFromTypedContext(dragObject, contextType),
        }),
        argument: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: parameterRefFromTypedContext(dragObject, contextType)
        })
    },
    stringUtil: {
        flow: noNode,
        flowStep: noNode,
        assignment: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: stringUtilFromTypedContext(dragObject, contextType),
        }),
        argument: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: stringUtilFromTypedContext(dragObject, contextType),
        }),
    },
    flowStep: {
        flow: (dragObject, contextType) => new DropObject({
            dragObject,
            newNode: nodeTemplates.flowStep()
        }),
        flowStep: noNode,
        assignment: noNode,
        argument: noNode
    },
    moveFlowStep: {
        flow: (dragObject, contextType) => new DropObject({ dragObject, newNode: dragObject }),
        flowStep: (dragObject, contextType) => new DropObject({ dragObject, newNode: dragObject }),
        assignment: noNode,
        argument: noNode
    },
    /** @type {Object.<string, FunctionContextCallback>} */
    "file": {
        flow: (dragObject, contextType) => new DropObject({ dragObject, newNode: wrapWithFlowStep(nodeTemplates[dragObject.dragData.fileType](dragObject.dragData)) }),
        flowStep: (dragObject, contextType) => new DropObject({ dragObject, newNode: nodeTemplates[dragObject.dragData.fileType](dragObject.dragData) }),
        assignment: noNode,//(dragObject, contextType) => new DropObject({ dragObject, newNode: nodeTemplates['function'](dragObject.dragData) }),
        argument: noNode//(dragObject, contextType) => new DropObject({ dragObject, newNode: nodeTemplates['function'](dragObject.dragData) }),
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
 * @param {string} dropConfig.contextType The data type of the context component
 * @param {stateChangeCallback} dropConfig.stateChangeCallback What gets called to modify state once the drop
 * has occurred and an ast node has been created and passed to this callback
 * @returns {dragEventHandler}
 */
const flowDropHandler = ({ contextName, contextType, stateChangeCallback }) => async (dragEvent) => {
    const dragObject = getDragData(dragEvent);
    
    const dropObject = dropContextMap[dragObject.dragType][contextName](dragObject, contextType);
    
    stateChangeCallback(dropObject.newNode);
};

export { dragStartHandler, flowDropHandler, getDragData };
