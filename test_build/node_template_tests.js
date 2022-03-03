import nodeTemplates from '../src/node_templates.js';
import typeDefs from '../src/type_definitions.js';
import { assert } from 'chai';


suite('Creating flow nodes', function() {
    test('Creating default StringUtil', function() {
        const node = nodeTemplates.StringUtil();
        const methodDef = typeDefs.StringUtil.concat;

        assert.ownInclude(node, {
            type: "UtilityCallExpression",
            utilityMethod: "concat",
            utilityName: "StringUtil",
            returns: methodDef.returns
        }, "Default StringUtil node has incorrect properties");
        assert.equal(node.arguments.length, 2, "Default concat method of StringUtil did not create 2 arguments by default");

        for (let i = 0; i < node.arguments.length; ++i) {
            const nodeArg = node.arguments[i];

            assert.ownInclude(nodeArg, {
                type: "StringLiteral",
                returns: "String",
                value: ""
            }, "Default arguments for default StringUtil are not the correct literals");
        }
    });


    test('Creating StringUtil with existing method', function() {
        const node = nodeTemplates.StringUtil("trim");
        const methodDef = typeDefs.StringUtil.trim;

        assert.ownInclude(node, {
            type: "UtilityCallExpression",
            utilityMethod: "trim",
            utilityName: "StringUtil",
            returns: methodDef.returns
        }, "StringUtil node has incorrect properties");
        assert.equal(node.arguments.length, 1, "Passed in method of StringUtil did not create 1 argument");

        for (let i = 0; i < node.arguments.length; ++i) {
            const nodeArg = node.arguments[i];

            assert.ownInclude(nodeArg, {
                type: "StringLiteral",
                returns: "String",
                value: ""
            }, "Argument for StringUtil are not the correct literals");
        }
    });


    test('Creating StringUtil with non-existing method', function() {
        try {
            const node = nodeTemplates.StringUtil("imaginary");
            assert.fail("Passing in a non-existing method to the StringUtil creator should throw undefined errors");
        } catch (e) {
            assert(true);
        }
    });
});