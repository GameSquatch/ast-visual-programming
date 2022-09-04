let blockLevel = 1;

/**
 * @typedef {(ASTNode) => string} CodeGenerator
 */

/**
 * @typedef {Object.<string, CodeGenerator>} CodeWriterConfig
 */
const codeWritersMap = {
    FlowStep: function (node, fileId, { codeData, fileMetadata }) {
        const blockSpaces = ' '.repeat(blockLevel * 4);

        const codeStr = this[node.expression.type](node.expression, fileId, { codeData, fileMetadata });
        return node.expression === null ? '' : `${blockSpaces}${codeStr};\n`;
    },
    IfStatement: function (node, fileId, { codeData, fileMetadata }) {
        const test = this[node.test.type](node.test, fileId, { codeData, fileMetadata });
        const blockSpaces = ' '.repeat(blockLevel * 4);
        blockLevel += 1;
        const consequent = node.consequent.body.map((step) => this[step.type](step, fileId, { codeData, fileMetadata })).join('');
        const alternate = node.alternate.body.map((step) => this[step.type](step, fileId, { codeData, fileMetadata })).join('');
        
        const ifStr = `${blockSpaces}if (${test}) {\n${consequent}${blockSpaces}} else {\n${alternate}${blockSpaces}}\n`;
        blockLevel -= 1;
        return ifStr;
    },
    UtilityCallExpression: function (node, fileId, { codeData, fileMetadata }) {
        const utility = `${node.utilityName}.${node.utilityMethod}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, { codeData, fileMetadata }), "");

        return `${utility}(${arguments})`;
    },
    FunctionCallExpression: function (node, fileId, { codeData, fileMetadata }) {
        const title = fileMetadata[node.fileId].title;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, { codeData, fileMetadata }), "");

        return `${title}(${arguments})`;
    },
    IdentifierRefCallExpression: function (node, fileId, { codeData, fileMetadata }) {
        const varCall = `${this.RefIdentifier(node.refData, fileId, { codeData, fileMetadata })}.${node.method}`;
        let arguments = node.arguments.reduce((acc, arg, i) => argStringBuilder.call(this, acc, arg, i, fileId, { codeData, fileMetadata }), "");

        return `${varCall}(${arguments})`;
    },
    AssignmentExpression: function (node, fileId, { codeData, fileMetadata }) {
        const left = this[node.left.type](node.left, fileId, { codeData, fileMetadata });
        if (node.right === null) return left;
        const right = this[node.right.type](node.right, fileId, { codeData, fileMetadata });

        return `${left} = ${right}`;
    },
    RefIdentifier: function (node, fileId, { codeData, fileMetadata }) {
        let variableRef;
        if (node.fnRefType === 'variables') {
            variableRef = codeData[fileId].info.variables[node.refId];
        } else {
            variableRef = fileMetadata[fileId].objectFlowData.parameters[node.refId];
        }

        return variableRef.name;
    },
    ReturnStatement: function(node, fileId, { codeData, fileMetadata }) {
        const expr = node.expression === null
            ? ''
            : ` ${this[node.expression.type](node.expression, fileId, { codeData, fileMetadata })}`;
        return `return${expr}`;
    },
    StringLiteral: function (node, fileId, { codeData, fileMetadata }) {
        return outputLiteralValue(node.value, "String");
    },
    IntegerLiteral: function (node, fileId, { codeData, fileMetadata }) {
        return node.value.toString();
    },
    BooleanLiteral: function (node, fileId, { codeData, fileMetadata }) {
        return node.value.toString();
    }
};

exports.codeWriter = function (statement, fileId, codeInfo) {
    blockLevel = 1;
    return codeWritersMap[statement.type](statement, fileId, codeInfo);
};
exports.outputLiteralValue = outputLiteralValue;

/**
* @param {string|number|boolean} value - value of the literal
* @param {string} dataType - data type of the literal value
* @returns {string}
*/
function outputLiteralValue(value, dataType) {
    // @ts-ignore
    return dataType === "String" ? `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"` : `${value}`;
}

function argStringBuilder(acc, arg, index, fileId, { codeData, fileMetadata }) {
    return acc += index > 0
        ? `, ${this[arg.nodeData.type](arg.nodeData, fileId, { codeData, fileMetadata })}`
        : this[arg.nodeData.type](arg.nodeData, fileId, { codeData, fileMetadata });
}