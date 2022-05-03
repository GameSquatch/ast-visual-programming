import { assert } from 'chai';
import typeDefs from '../src/type_definitions.js';

function testVariableWithMismatchContext({
    nodeCreated,
    contextType,
    varType,
    typeDef,
    draggedRefId
}) {
    assert.ownInclude(nodeCreated, {
        type: "FunctionRefCallExpression",
        returns: contextType
    }, "Created node has unexpected properties");
    assert.notDeepEqual(nodeCreated.method, undefined, "Created node has undefined method prop");
    assert.property(typeDef, nodeCreated.method, "Created node's method does not exist in type definitions");
    const typeDefMethod = typeDef[nodeCreated.method];
    assert.notDeepEqual(nodeCreated.arguments, undefined, "Created node has undefined arguments prop");
    assert.equal(nodeCreated.arguments.length, typeDefMethod.args.length, "Created node's argument count doesn't match type definition");

    for (let i = 0; i < typeDefMethod.args.length; ++i) {
        const nodeArg = nodeCreated.arguments[i];
        const typeDefArg = typeDefMethod.args[i];
        assert.ownInclude(nodeArg, {
            type: typeDefArg + "Literal",
            returns: typeDefArg
        }, "Created node argument doesn't have correct properties");
        assert.property(nodeArg, "value", "Created node argument doesn't have value prop");
    }
    assert.notEqual(nodeCreated.refData, undefined, "Created node has undefined variable prop");
    assert.ownInclude(nodeCreated.refData, {
        type: "FunctionRefIdentifier",
        returns: varType
    }, "Created node variable has unexpected properties");
    assert.equal(nodeCreated.refData.refId, draggedRefId, "Created node variable refId doesn't match dragged variable's");
}


function isStringUtil({ node, method }) {
    const methodDefinition = typeDefs['StringUtil'][method];
    const definitionArgs = methodDefinition.args;

    assert.notEqual(methodDefinition, undefined, "Created StringUtil method is not within the type definitions");
    assert.ownInclude(node, {
        type: "UtilityCallExpression",
        utilityName: "StringUtil",
        utilityMethod: method,
        returns: methodDefinition.returns
    }, "Node does not have correct properties for a StringUtil");

    assert.notEqual(node.arguments, undefined, "Node does not have an arguments property");

    for (let i = 0; i < node.arguments.length; ++i) {
        const defArg = definitionArgs[i];
        const nodeArg = node.arguments[i];

        assert.ownInclude(nodeArg, {
            type: defArg + "Literal",
            returns: defArg
        });
        assert.property(nodeArg, "value", "Created node argument doesn't have value prop");
    }
}


export { testVariableWithMismatchContext, isStringUtil };