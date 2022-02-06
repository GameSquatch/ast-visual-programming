
exports.codeWriter = {
    "ExpressionStatement": function(node) {
        return this[node.expression.type](node.expression) + ";\n";
    },
    "UtilityCallExpression": function(node) {
        let utility = `${node.utilityName}.${node.utilityMethod}`;
        let arguments = "";

        node.arguments.forEach((arg, i) => {
            if (i > 0) {
                arguments += ", ";
            }
            arguments += this[arg.type](arg);
        });

        return `${utility}(${arguments})`;
    },
    "AssignmentExpression": function(node) {
        const left = this[node.left.type](node.left);
        const right = this[node.right.type](node.right);

        return `${left} = ${right}`;
    },
    "Identifier": function(node) {
        return node.name;
    },
    "StringLiteral": function(node) {
        return `"${node.value}"`;
    },
    "IntegerLiteral": function(node) {
        return node.value.toString();
    }
};