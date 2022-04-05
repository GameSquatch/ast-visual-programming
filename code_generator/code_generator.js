const { codeWriter, mockData } = require('./code_writer');

let variableInitBlock = "";
for (let variable of Object.values(mockData.main.info.variables)) {
    variableInitBlock += `let ${variable.name} = ${variable.returns === "String" ? '"' + variable.value + '"' : variable.value};\n`;
}
variableInitBlock += "\n";

let codeResult = "";
for (let statement of mockData.main.body) {
    codeResult += codeOutput(statement);
}
console.log(variableInitBlock + codeResult);

function codeOutput(node) {
    // write code for node.type to a file, but for now just log it
    return codeWriter[node.type](node);
}