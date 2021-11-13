
exports.codeWriter = {
    "ExpressionStatement": function(node) {
        return this[node.expression.type](node.expression) + ";\n";
    },
    "CallExpression": function(node) {
        let callee = this[node.callee.type](node.callee);
        let arguments = "";

        node.arguments.forEach((arg, i) => {
            if (i > 0) {
                arguments += ", ";
            }
            arguments += this[arg.type](arg);
        });

        return `${callee}(${arguments})`;
    },
    "MemberExpression": function(node) {
        const obj = this[node.object.type](node.object);
        const property = this[node.property.type](node.property);

        return `${obj}.${property}`;
    },
    "Identifier": function(node) {
        return node.name;
    },
    "StringLiteral": function(node) {
        return `"${node.value}"`;
    }
};