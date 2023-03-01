let blockLevel = 1;

class CodeWriter {
    fileId: string;
    codeData: any;
    fileMetadata: any;
    [nodeType: string]: any;

    constructor(fileId: string, { codeData, fileMetadata }: { codeData: any, fileMetadata: any}) {
        this.fileId = fileId;
        this.codeData = codeData;
        this.fileMetadata = fileMetadata;
    }

    FlowStep(node: any) {
        const blockSpaces = ' '.repeat(blockLevel * 4);

        const codeStr = this[node.expression.type](node.expression);
        return node.expression === null ? '' : `${blockSpaces}${codeStr};\n`;
    }

    IfStatement(node: any) {
        const test = this[node.test.type](node.test);
        const blockSpaces = ' '.repeat(blockLevel * 4);
        blockLevel += 1;
        const consequent = node.consequent.body.map((step: any) => this[step.type](step)).join('');
        const alternate = node.alternate.body.map((step: any) => this[step.type](step)).join('');
        
        const ifStr = `${blockSpaces}if (${test}) {\n${consequent}${blockSpaces}} else {\n${alternate}${blockSpaces}}\n`;
        blockLevel -= 1;
        return ifStr;
    }

    UtilityCallExpression(node: any) {
        const utility = `${node.utilityName}.${node.utilityMethod}`;
        let args = node.arguments.reduce((acc: string, arg: any, i: number) => this.argStringBuilder(acc, arg, i, this.fileId, this.codeData, this.fileMetadata), "");

        return `${utility}(${args})`;
    }

    FunctionCallExpression(node: any) {
        const title = this.fileMetadata[node.fileId].title;
        let args = node.arguments.reduce((acc: string, arg: any, i: number) => this.argStringBuilder(acc, arg, i, this.fileId, this.codeData, this.fileMetadata), "");

        return `${title}(${args})`;
    }

    IdentifierRefCallExpression(node: any) {
        const varCall = `${this.RefIdentifier(node.refData)}.${node.method}`;
        let args = node.arguments.reduce((acc: string, arg: any, i: number) => this.argStringBuilder(acc, arg, i, this.fileId, this.codeData, this.fileMetadata), "");

        return `${varCall}(${args})`;
    }

    AssignmentExpression(node: any) {
        const left = this[node.left.type](node.left);
        if (node.right === null) return left;
        const right = this[node.right.type](node.right);

        return `${left} = ${right}`;
    }

    RefIdentifier(node: any) {
        let variableRef;
        if (node.fnRefType === 'variables') {
            variableRef = this.codeData[this.fileId].info.variables[node.refId];
        } else {
            variableRef = this.fileMetadata[this.fileId].objectFlowData.parameters[node.refId];
        }

        return variableRef.name;
    }

    ReturnStatement(node: any) {
        const expr = node.expression === null
            ? ''
            : ` ${this[node.expression.type](node.expression)}`;
        return `return${expr}`;
    }

    StringLiteral(node: any) {
        return outputLiteralValue(node.value, "String");
    }

    IntegerLiteral(node: any) {
        return node.value.toString();
    }

    BooleanLiteral(node: any) {
        return node.value.toString();
    }

    argStringBuilder(acc: string, arg: any, index: number, fileId: string, codeData: any, fileMetadata: any) {
        return acc += index > 0
            ? `, ${this[arg.nodeData.type](arg.nodeData, fileId, { codeData, fileMetadata })}`
            : this[arg.nodeData.type](arg.nodeData, fileId, { codeData, fileMetadata });
    }
};
export {
    codeWriter,
    outputLiteralValue
};

function codeWriter(statement: any, fileId: string, codeInfo: { codeData: any, fileMetadata: any}) {
    blockLevel = 1;
    return new CodeWriter(fileId, codeInfo)[statement.type](statement, fileId, codeInfo);
};

function outputLiteralValue(value: string|number|boolean, dataType: string): string {
    // @ts-ignore
    return dataType === "String" ? `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"` : `${value}`;
}

