
/**
 * @typedef {(ASTNode) => string} CodeGenerator
 */

/**
 * @typedef {Object.<string, CodeGenerator>} CodeWriterConfig
 */
const codeWritersMap = {
    FlowStep: function(node, fileId, { codeData, fileMetadata }) {
        return node.expression === null ? "" : `    ${this[node.expression.type](node.expression, fileId, { codeData, fileMetadata })};\n`;
    },
    UtilityCallExpression: function(node, fileId, { codeData, fileMetadata }) {
        const utility = `${node.utilityName}.${node.utilityMethod}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, { codeData, fileMetadata }), "");

        return `${utility}(${arguments})`;
    },
    FunctionCallExpression: function(node, fileId, { codeData, fileMetadata }) {
        const title = fileMetadata[node.fileId].title;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, fileId, { codeData, fileMetadata }), "");

        return `${title}(${arguments})`;
    },
    IdentifierRefCallExpression: function(node, fileId, { codeData, fileMetadata }) {
        const varCall = `${this.RefIdentifier(node.refData, fileId, { codeData, fileMetadata })}.${node.method}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, { codeData, fileMetadata }), "");

        return `${varCall}(${arguments})`;
    },
    AssignmentExpression: function(node, fileId, { codeData, fileMetadata }) {
        const left = this[node.left.type](node.left, fileId, { codeData, fileMetadata });
        if (node.right === null) return left;
        const right = this[node.right.type](node.right, fileId, { codeData, fileMetadata });

        return `${left} = ${right}`;
    },
    RefIdentifier: function(node, fileId, { codeData, fileMetadata }) {
        let variableRef;
        if (node.fnRefType === 'variables') {
            variableRef = codeData[fileId].main.info.variables[node.refId];
        } else {
            variableRef = fileMetadata[fileId].objectFlowData.parameters[node.refId];
        }

        return variableRef.name;
    },
    StringLiteral: function(node, fileId, { codeData, fileMetadata }) {
        return `"${node.value}"`;
    },
    IntegerLiteral: function(node, fileId, { codeData, fileMetadata }) {
        return node.value.toString();
    }
};

exports.codeWriter = function(statement, fileId, codeInfo) {
    return codeWritersMap[statement.type](statement, fileId, codeInfo);
}

function argStringBuilder(acc, arg, index, fileId, { codeData, fileMetadata }) {
    //console.log(`inside reduce argtype: ${arg.type}`);
    return acc += index > 0 ? `, ${this[arg.type](arg, fileId, { codeData, fileMetadata })}` : this[arg.type](arg, fileId, { codeData, fileMetadata });
}