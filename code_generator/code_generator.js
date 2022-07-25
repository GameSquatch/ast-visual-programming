const { codeWriter, mockData, fileMetadata } = require('./code_writer');

for (let fileId of Object.keys(mockData)) {
    const currentFn = mockData[fileId];
    let variableInitBlock = "";
    for (const variable of Object.values(currentFn.main.info.variables)) {
        variableInitBlock += `    let ${variable.name} = ${variable.dataType === "String" ? '"' + variable.defaultValue + '"' : variable.defaultValue};\n`;
    }
    variableInitBlock += "\n";

    let parameterSet = "";
    let i = 0;
    for (const paramId in fileMetadata[fileId].objectFlowData.parameters) {
        const { name } = fileMetadata[fileId].objectFlowData.parameters[paramId];
        if (i > 0) parameterSet += ', ';
        parameterSet += name;
        i += 1;
    }

    let codeResult = "";
    for (const statement of currentFn.main.body) {
        codeResult += codeOutput(statement, fileId);
    }
    console.log(`function ${fileMetadata[fileId].title}(${parameterSet}) {\n${variableInitBlock}${codeResult}}\n`);
}

function codeOutput(node, fileId) {
    // write code for node.type to a file, but for now just log it
    return codeWriter[node.type](node, fileId);
}