const { codeWriter, mockData } = require('./code_writer');

for (let fileId of Object.keys(mockData)) {
    const currentFn = mockData[fileId];
    let variableInitBlock = "";
    for (let variable of Object.values(currentFn.main.info.variables)) {
        variableInitBlock += `let ${variable.name} = ${variable.dataType === "String" ? '"' + variable.defaultValue + '"' : variable.defaultValue};\n`;
    }
    variableInitBlock += "\n";

    let codeResult = "";
    for (let statement of currentFn.main.body) {
        codeResult += codeOutput(statement, fileId);
    }
    console.log(variableInitBlock + codeResult);
}

function codeOutput(node, fileId) {
    // write code for node.type to a file, but for now just log it
    return codeWriter[node.type](node, fileId);
}