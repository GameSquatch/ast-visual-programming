import { assert } from 'chai';
import { flowDropHandler } from '../src/drag_and_drop_handlers.js';
import { functionRefObjectDrag, stringUtilDataDrag, doActionDataDrag, moveExpressionDrag } from '../src/drag_start_data_creators.js';
import typeDefs from '../src/type_definitions.js';
import nodeTemplates from '../src/node_templates.js';
import { v4 as uuidv4 } from 'uuid';
import { testVariableWithMismatchContext, isStringUtil } from './common_helpers.js';

suite('Variable drop handling', function() {

    test('Variable drag is dropped in assignment with matching type context', function() {
        const varType = "String";
        const draggedRefId = uuidv4();

        
        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            contextType: varType,
            stateChangeCallback: function(nodeCreated) {
                assert.ownInclude(nodeCreated, {
                    type: "FunctionRefIdentifier",
                    returns: varType
                }, "Created node has unexpected properties");
                assert.equal(nodeCreated.refId, draggedRefId, "Created node has no ref id");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(functionRefObjectDrag({
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
        const draggedRefId = uuidv4();

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
                    return JSON.stringify(functionRefObjectDrag({
                        name: "aStr",
                        value: "hello there",
                        returns: varType,
                        refId: draggedRefId,
                        fnRefType: "variables"
                    }));
                }
            }
        };

        handlerFn(mockVariableDragEvent);
    });


    test('Variable drag is dropped into a flow', function() {
        const varType = "Integer";
        const draggedRefId = uuidv4();

        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                assert.ownInclude(nodeCreated, {
                    type: "ExpressionStatement"
                }, "Created node is not an expression statement");
                assert.notDeepEqual(nodeCreated.id, undefined, "Created node has undefined id prop");
                assert.notDeepEqual(nodeCreated.expression, undefined, "Created node has undefined expression prop");
                const expression = nodeCreated.expression;
                assert.ownInclude(expression, {
                    type: "AssignmentExpression",
                    right: null
                });
                assert.notDeepEqual(expression.left, undefined, "Left of assign is undefined");
                const assignmentLeft = expression.left;
                assert.ownInclude(assignmentLeft, {
                    type: "FunctionRefIdentifier",
                    returns: varType
                }, "Left of assign does not have var identifier properties");
                assert.equal(assignmentLeft.refId, draggedRefId, "Left of assignment identifier does not have matching ref id to dragged");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(functionRefObjectDrag({
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
        const draggedRefId = uuidv4();

        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                assert.ownInclude(nodeCreated, {
                    type: "AssignmentExpression",
                    right: null
                });
                assert.notDeepEqual(nodeCreated.left, undefined, "Left of assign is undefined");
                const assignmentLeft = nodeCreated.left;
                assert.ownInclude(assignmentLeft, {
                    type: "FunctionRefIdentifier",
                    returns: varType
                }, "Left of assign does not have var identifier properties");
                assert.equal(assignmentLeft.refId, draggedRefId, "Left of assignment identifier does not have matching ref id to dragged");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(functionRefObjectDrag({
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
        const draggedRefId = uuidv4();

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            contextType: varType,
            stateChangeCallback: function(nodeCreated) {
                assert.ownInclude(nodeCreated, {
                    type: "FunctionRefIdentifier",
                    returns: varType
                }, "Created node has unexpected properties");
                assert.equal(nodeCreated.refId, draggedRefId, "Created node variable refId doesn't match dragged variable's");
            }
        });

        const mockVariableDragEvent = {
            dataTransfer: {
                getData(_) {
                    return JSON.stringify(functionRefObjectDrag({
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
        const draggedRefId = uuidv4();

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
                    return JSON.stringify(functionRefObjectDrag({
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
                assert.strictEqual(nodeCreated, null, "StringUtil dropped in a flow is not return null");
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
                assert.strictEqual(nodeCreated, null, "StringUtil dropped in a flow is not return null");
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
                assert.strictEqual(contextType, nodeCreated.returns, "Created StringUtility method does not return the same as its context");
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
                assert.strictEqual(nodeCreated, null, "When types aren't possible to match, the drop is incorrectly not returning null");
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
                assert.strictEqual(contextType, nodeCreated.returns, "Created StringUtility method does not return the same as its context");
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
                assert.strictEqual(nodeCreated, null, "When types aren't possible to match, the drop is incorrectly not returning null");
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
                assert.ownInclude(nodeCreated, {
                    type: "ExpressionStatement",
                    expression: null
                }, "Created node is an invalid expression");
                assert.notStrictEqual(nodeCreated.id, undefined, "Created expression has no id prop");
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
                assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
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
                assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
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
                assert.strictEqual(nodeCreated, null, "Node creation didn't result in null return");
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
        mockExpressionNode.expression = nodeTemplates.functionRefAssignment({ refId: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.functionRefAssignment({ refId: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode, 0));

        const handlerFn = flowDropHandler({
            contextName: 'flow',
            stateChangeCallback: function(nodeCreated) {
                assert.strictEqual(nodeCreated.moveData.id, mockExpressionNode.id, "When moved, the expression changed ids");
                assert.strictEqual(nodeCreated.moveData.type, mockExpressionNode.type, "Node type doesn't match after expression move");
                assert.strictEqual(JSON.stringify(nodeCreated.moveData.expression), JSON.stringify(mockExpressionNode.expression), "Moved expression inners don't match anymore after move");
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
        mockExpressionNode.expression = nodeTemplates.functionRefAssignment({ refId: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.functionRefAssignment({ refId: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'expression',
            stateChangeCallback: function(nodeCreated) {
                assert.strictEqual(nodeCreated.moveData.id, mockExpressionNode.id, "When moved, the expression changed ids");
                assert.strictEqual(nodeCreated.moveData.type, mockExpressionNode.type, "Node type doesn't match after expression move");
                assert.strictEqual(JSON.stringify(nodeCreated.moveData.expression), JSON.stringify(mockExpressionNode.expression), "Moved expression inners don't match anymore after move");
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
        mockExpressionNode.expression = nodeTemplates.functionRefAssignment({ name: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.functionRefAssignment({ name: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'assignment',
            stateChangeCallback: function(nodeCreated) {
                assert.isNull(nodeCreated, "Didn't return null for this invalid move type")
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
        mockExpressionNode.expression = nodeTemplates.functionRefAssignment({ name: "myVar", returns: "String "});
        mockExpressionNode.expression.right = nodeTemplates.functionRefAssignment({ name: "otherVar", returns: "String" });
        const dragData = JSON.stringify(moveExpressionDrag(mockExpressionNode));

        const handlerFn = flowDropHandler({
            contextName: 'argument',
            stateChangeCallback: function(nodeCreated) {
                assert.isNull(nodeCreated, "Didn't return null for this invalid move type")
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