'use strict';

var chai = require('chai');
var uuid = require('uuid');

/** @type {TypeDefinitionWrapper} */
const typeDefs =  {
    "StringUtil": {
        "concat": {
            "args": [
                "String",
                "String"
            ],
            "infiniteArgs": true,
            "returns": "String"
        },
        "trim": {
            "args": [
                "String"
            ],
            "inifiniteArgs": false,
            "returns": "String"
        },
        "length": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "Integer"
        },
        "fromInt": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": false,
            "returns": "String"
        },
        "substring": {
            "args": [
                "Integer",
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        }
    },
    "String": {
        "concat": {
            "args": [
                "String"
            ],
            "infiniteArgs": true,
            "returns": "String"
        },
        "trim": {
            "args": [],
            "inifiniteArgs": false,
            "returns": "String"
        },
        "prepend": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        },
        "length": {
            "args": [],
            "infiniteArgs": false,
            "returns": "Integer"
        }
    },
    "Integer": {
        "parse": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "Integer"
        },
        "add": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returns": "Integer"
        },
        "subtract": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returns": "Integer"
        },
        "toString": {
            "args": [],
            "infiniteArgs": false,
            "returns": "String"
        }
    },
    "List": {
        "join": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        }
    }
};

/** @type {NodeTemplates} */
const nodeTemplates = {
    StringUtil: function(method = "concat") {
        const methodDefinition = typeDefs['StringUtil'][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: "StringUtil",
            utilityMethod: method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            returns: methodDefinition.returns
        };
    },
    varCallExpression: function({ method, returns, variable }) {
        const methodDefinition = typeDefs[variable.returns][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "VarCallExpression",
            variable: {...variable},
            method,
            arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
            returns
        };
    },
    expression: () => {
        const newUuid = uuid.v4();
        return {
            type: "ExpressionStatement",
            id: newUuid,
            expression: null
        };
    },
    variableAssignment: ({ refId, returns }) => ({
        type: "AssignmentExpression",
        left: {
            type: "VarIdentifier",
            refId,
            returns
        },
        right: null
    }),
    variableIdentifier: ({ refId, returns }) => ({
        type: "VarIdentifier",
        refId,
        returns
    }),
    // Capitalizing because it matches the 'type' field in the AST
    StringLiteral: ({ value = "" }) => ({
        type: "StringLiteral",
        value: value,
        returns: "String"
    }),
    // Capitalizing because it matches the 'type' field in the AST
    IntegerLiteral: ({ value = 0 }) => ({
        type: "IntegerLiteral",
        value,
        returns: "Integer"
    })
};

const getDragData = (event) => JSON.parse(event.dataTransfer.getData('text/json'));


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
};
const findStringUtilTypeMatch = findReturnTypeMatch("StringUtil");


const wrapWithExpression = (node) => {
    const expr = nodeTemplates.expression();
    expr.expression = node;
    return expr;
};


/**
 * @param {Object} dragData - The DragEvent data parsed into an object
 * @param {string} type - Data type
 * @returns {?Object.<string, *>} Returns either null or the ast node to be created from dropping this stringUtil
 */
const stringUtilFromTypedContext = (dragData, contextType) => {
    const methodName = findStringUtilTypeMatch(contextType);
    if (methodName === null) return null;
    return nodeTemplates.StringUtil(methodName);
};


/**
 * Creates an AST node for dropping a variable into a typed context
 * @param {{ name: string, refId: string, returns: string, value: string }} dragData 
 * @param {string} contextType Data type that is required by the variable's parent, a.k.a the contextual data type
 * @returns {Object}
 */
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
        flow: (dragData, contextType) => wrapWithExpression(nodeTemplates.variableAssignment(dragData.data)),
        expression: (dragData, contextType) => nodeTemplates.variableAssignment(dragData.data),
        assignment: variableFromTypedContext,
        argument: variableFromTypedContext
    },
    StringUtil: {
        flow: noNode,
        expression: noNode,
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
        flow: (dragData, contextType) => ({ moveData: dragData.node, currentIndex: dragData.currentIndex }),
        expression: (dragData, contextType) => ({ moveData: dragData.node, currentIndex: dragData.currentIndex }),
        assignment: noNode,
        argument: noNode
    }
};

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

/** @type {DragStartDataCreator} */
const doActionDataDrag = () => ({ dragType: "expression" });
/** @type {DragStartDataCreator} */
const stringUtilDataDrag = () => ({ dragType: "StringUtil" });

/** @type {MoveExpressionDragStartDataCreator} */
const moveExpressionDrag = (expressionNode, currentIndex) => ({ dragType: "moveExpression", node: expressionNode, currentIndex });

/** @type {VariableDragStartDataCreator} */
const variableDrag = (variableData) => ({ dragType: "variable", data: variableData });

function testVariableWithMismatchContext({
    nodeCreated,
    contextType,
    varType,
    typeDef,
    draggedRefId
}) {
    chai.assert.ownInclude(nodeCreated, {
        type: "VarCallExpression",
        returns: contextType
    }, "Created node has unexpected properties");
    chai.assert.notDeepEqual(nodeCreated.method, undefined, "Created node has undefined method prop");
    chai.assert.property(typeDef, nodeCreated.method, "Created node's method does not exist in type definitions");
    const typeDefMethod = typeDef[nodeCreated.method];
    chai.assert.notDeepEqual(nodeCreated.arguments, undefined, "Created node has undefined arguments prop");
    chai.assert.equal(nodeCreated.arguments.length, typeDefMethod.args.length, "Created node's argument count doesn't match type definition");

    for (let i = 0; i < typeDefMethod.args.length; ++i) {
        const nodeArg = nodeCreated.arguments[i];
        const typeDefArg = typeDefMethod.args[i];
        chai.assert.ownInclude(nodeArg, {
            type: typeDefArg + "Literal",
            returns: typeDefArg
        }, "Created node argument doesn't have correct properties");
        chai.assert.property(nodeArg, "value", "Created node argument doesn't have value prop");
    }
    chai.assert.notEqual(nodeCreated.variable, undefined, "Created node has undefined variable prop");
    chai.assert.ownInclude(nodeCreated.variable, {
        type: "VarIdentifier",
        returns: varType
    }, "Created node variable has unexpected properties");
    chai.assert.equal(nodeCreated.variable.refId, draggedRefId, "Created node variable refId doesn't match dragged variable's");
}


function isStringUtil({ node, method }) {
    const methodDefinition = typeDefs['StringUtil'][method];
    const definitionArgs = methodDefinition.args;

    chai.assert.notEqual(methodDefinition, undefined, "Created StringUtil method is not within the type definitions");
    chai.assert.ownInclude(node, {
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        returns: methodDefinition.returns
    }, "Node does not have correct properties for a StringUtil");

    chai.assert.notEqual(node.arguments, undefined, "Node does not have an arguments property");

    for (let i = 0; i < node.arguments.length; ++i) {
        const defArg = definitionArgs[i];
        const nodeArg = node.arguments[i];

        chai.assert.ownInclude(nodeArg, {
            type: defArg + "Literal",
            returns: defArg
        });
        chai.assert.property(nodeArg, "value", "Created node argument doesn't have value prop");
    }
}

suite('Variable drop handling', function() {

    test('Variable drag is dropped in assignment with matching type context', function() {
        const varType = "String";
        const draggedRefId = uuid.v4();

        
        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            contextType: varType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.ownInclude(nodeCreated, {
                    type: "VarIdentifier",
                    returns: varType
                }, "Created node has unexpected properties");
                chai.assert.equal(nodeCreated.refId, draggedRefId, "Created node has no ref id");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aStr",
                        value: "hello there",
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped in assignment with non-matching type context', function() {
        const varType = "String";
        const contextType = "Integer";
        const typeDef = typeDefs[varType];
        const draggedRefId = uuid.v4();

        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                testVariableWithMismatchContext({
                    nodeCreated,
                    typeDef,
                    contextType,
                    varType,
                    draggedRefId
                });
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aStr",
                        value: "hello there",
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped into a flow', function() {
        const varType = "Integer";
        const draggedRefId = uuid.v4();

        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.ownInclude(nodeCreated, {
                    type: "ExpressionStatement"
                }, "Created node is not an expression statement");
                chai.assert.notDeepEqual(nodeCreated.id, undefined, "Created node has undefined id prop");
                chai.assert.notDeepEqual(nodeCreated.expression, undefined, "Created node has undefined expression prop");
                const expression = nodeCreated.expression;
                chai.assert.ownInclude(expression, {
                    type: "AssignmentExpression",
                    right: null
                });
                chai.assert.notDeepEqual(expression.left, undefined, "Left of assign is undefined");
                const assignmentLeft = expression.left;
                chai.assert.ownInclude(assignmentLeft, {
                    type: "VarIdentifier",
                    returns: varType
                }, "Left of assign does not have var identifier properties");
                chai.assert.equal(assignmentLeft.refId, draggedRefId, "Left of assignment identifier does not have matching ref id to dragged");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aNum",
                        value: 0,
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped into an expression', function() {
        const varType = "Integer";
        const draggedRefId = uuid.v4();

        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.ownInclude(nodeCreated, {
                    type: "AssignmentExpression",
                    right: null
                });
                chai.assert.notDeepEqual(nodeCreated.left, undefined, "Left of assign is undefined");
                const assignmentLeft = nodeCreated.left;
                chai.assert.ownInclude(assignmentLeft, {
                    type: "VarIdentifier",
                    returns: varType
                }, "Left of assign does not have var identifier properties");
                chai.assert.equal(assignmentLeft.refId, draggedRefId, "Left of assignment identifier does not have matching ref id to dragged");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aNum",
                        value: 0,
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped into argument with matching-type context', function() {
        const varType = "String";
        const draggedRefId = uuid.v4();

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            contextType: varType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.ownInclude(nodeCreated, {
                    type: "VarIdentifier",
                    returns: varType
                }, "Created node has unexpected properties");
                chai.assert.equal(nodeCreated.refId, draggedRefId, "Created node variable refId doesn't match dragged variable's");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aStr",
                        value: "hello there",
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped into argument with non-matching-type context', function() {
        const varType = "String";
        const contextType = "Integer";
        const typeDef = typeDefs[varType];
        const draggedRefId = uuid.v4();

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                testVariableWithMismatchContext({
                    nodeCreated,
                    typeDef,
                    contextType,
                    varType,
                    draggedRefId
                });
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(variableDrag({
                        name: "aStr",
                        value: "hello there",
                        returns: varType,
                        refId: draggedRefId
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });
});



suite('StringUtil drop handling', function() {

    test('StringUtil dropped in a flow', function() {
        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "StringUtil dropped in a flow is not return null");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('StringUtil dropped in an expression', function() {
        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "StringUtil dropped in a flow is not return null");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('StringUtil dropped in assignment with existing-in-type-defs context', function() {
        const contextType = 'String';

        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(contextType, nodeCreated.returns, "Created StringUtility method does not return the same as its context");
                isStringUtil({ node: nodeCreated, method: nodeCreated.utilityMethod });
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('StringUtil dropped in assignment with non-existing-type-in-type-defs context', function() {
        const contextType = 'Imaginary';

        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "When types aren't possible to match, the drop is incorrectly not returning null");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('StringUtil dropped in argument with existing-in-type-defs context', function() {
        const contextType = 'String';

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(contextType, nodeCreated.returns, "Created StringUtility method does not return the same as its context");
                isStringUtil({ node: nodeCreated, method: nodeCreated.utilityMethod });
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('StringUtil dropped in argument with non-existing-type-in-type-defs context', function() {
        const contextType = 'Imaginary';

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            contextType: contextType,
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "When types aren't possible to match, the drop is incorrectly not returning null");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(stringUtilDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });

});


suite('Expression drop handling', function() {

    test('Expression is dropped into a flow', function() {
        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.ownInclude(nodeCreated, {
                    type: "ExpressionStatement",
                    expression: null
                }, "Created node is an invalid expression");
                chai.assert.notStrictEqual(nodeCreated.id, undefined, "Created expression has no id prop");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(doActionDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is dropped into another expression', function() {
        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(doActionDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is dropped into assignment', function() {
        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(doActionDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is dropped into argument', function() {
        const handlerFn = flowDropHandler({
            contextName: 'argument',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(doActionDataDrag());
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });

});


suite('Moving and dropping an existing expression', function() {

    test('Expression is moved to another place in a flow', function() {
        const mockExpressionNode = nodeTemplates.expression();
        mockExpressionNode.expression = nodeTemplates.variableAssignment({ refId: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.variableAssignment({ refId: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode, 0));

        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated.moveData.id, mockExpressionNode.id, "When moved, the expression changed ids");
                chai.assert.strictEqual(nodeCreated.moveData.type, mockExpressionNode.type, "Node type doesn't match after expression move");
                chai.assert.strictEqual(JSON.stringify(nodeCreated.moveData.expression), JSON.stringify(mockExpressionNode.expression), "Moved expression inners don't match anymore after move");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return dragData;
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is moved and dropped onto another expression', function() {
        const mockExpressionNode = nodeTemplates.expression();
        mockExpressionNode.expression = nodeTemplates.variableAssignment({ refId: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.variableAssignment({ refId: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.strictEqual(nodeCreated.moveData.id, mockExpressionNode.id, "When moved, the expression changed ids");
                chai.assert.strictEqual(nodeCreated.moveData.type, mockExpressionNode.type, "Node type doesn't match after expression move");
                chai.assert.strictEqual(JSON.stringify(nodeCreated.moveData.expression), JSON.stringify(mockExpressionNode.expression), "Moved expression inners don't match anymore after move");
            }
        });


        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return dragData;
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is moved and dropped onto assignment', function() {
        const mockExpressionNode = nodeTemplates.expression();
        mockExpressionNode.expression = nodeTemplates.variableAssignment({ name: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.variableAssignment({ name: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.isNull(nodeCreated, "Didn't return null for this invalid move type");
            }
        });


        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return dragData;
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Expression is moved and dropped onto argument', function() {
        const mockExpressionNode = nodeTemplates.expression();
        mockExpressionNode.expression = nodeTemplates.variableAssignment({ name: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.variableAssignment({ name: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            stateChangeCallback: function(nodeCreated) {
                chai.assert.isNull(nodeCreated, "Didn't return null for this invalid move type");
            }
        });


        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return dragData;
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });

});

suite('Creating flow nodes', function() {
    test('Creating default StringUtil', function() {
        const node = nodeTemplates.StringUtil();
        const methodDef = typeDefs.StringUtil.concat;

        chai.assert.ownInclude(node, {
            type: "UtilityCallExpression",
            utilityMethod: "concat",
            utilityName: "StringUtil",
            returns: methodDef.returns
        }, "Default StringUtil node has incorrect properties");
        chai.assert.equal(node.arguments.length, 2, "Default concat method of StringUtil did not create 2 arguments by default");

        for (let i = 0; i < node.arguments.length; ++i) {
            const nodeArg = node.arguments[i];

            chai.assert.ownInclude(nodeArg, {
                type: "StringLiteral",
                returns: "String",
                value: ""
            }, "Default arguments for default StringUtil are not the correct literals");
        }
    });


    test('Creating StringUtil with existing method', function() {
        const node = nodeTemplates.StringUtil("trim");
        const methodDef = typeDefs.StringUtil.trim;

        chai.assert.ownInclude(node, {
            type: "UtilityCallExpression",
            utilityMethod: "trim",
            utilityName: "StringUtil",
            returns: methodDef.returns
        }, "StringUtil node has incorrect properties");
        chai.assert.equal(node.arguments.length, 1, "Passed in method of StringUtil did not create 1 argument");

        for (let i = 0; i < node.arguments.length; ++i) {
            const nodeArg = node.arguments[i];

            chai.assert.ownInclude(nodeArg, {
                type: "StringLiteral",
                returns: "String",
                value: ""
            }, "Argument for StringUtil are not the correct literals");
        }
    });


    test('Creating StringUtil with non-existing method', function() {
        try {
            const node = nodeTemplates.StringUtil("imaginary");
            chai.assert.fail("Passing in a non-existing method to the StringUtil creator should throw undefined errors");
        } catch (e) {
            chai.assert(true);
        }
    });
});
