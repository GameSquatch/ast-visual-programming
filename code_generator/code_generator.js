const { codeWriter } = require('./code_writer');

/**
 * @param {Object} codeInfo
 * @param {string} codeInfo.entryFunction
 * @param {Object} codeInfo.codeData
 * @param {Object} codeInfo.fileMetadata
 * @returns {Promise<string>}
 */
function generateCode(codeInfo) {
    return new Promise((resolve, reject) => {
        try {
            const { entryFunction, codeData, fileMetadata } = codeInfo;
            let codeStr = [];

            for (let fileId of Object.keys(codeData)) {
                let parameterSet = "";
                let parameterInits = "";
                let i = 0;
                for (const paramId in fileMetadata[fileId].objectFlowData.parameters) {
                    const { name, defaultValue, dataType } = fileMetadata[fileId].objectFlowData.parameters[paramId];
                    const defaultStr = dataType === "String" ? `"${defaultValue}"` : `${defaultValue}`;
                    parameterInits += `    ${name} = ${name} ?? ${defaultStr};\n`;

                    if (i > 0) parameterSet += ', ';
                    parameterSet += name;
                    i += 1;
                }

                const currentFn = codeData[fileId];
                let variableInitBlock = "";
                for (const variable of Object.values(currentFn.info.variables)) {
                    variableInitBlock += `    let ${variable.name} = ${variable.dataType === "String" ? '"' + variable.defaultValue + '"' : variable.defaultValue};\n`;
                }
                variableInitBlock += "\n";

                let codeResult = "";
                for (const statement of currentFn.body) {
                    codeResult += codeWriter(statement, fileId, codeInfo);
                }
                codeStr.push(`function ${fileMetadata[fileId].title}(${parameterSet}) {\n${parameterInits}${variableInitBlock}${codeResult}}\n`);
            }

            codeStr.push(`${fileMetadata[entryFunction].title}();`);
            resolve(codeStr.join(''));
        } catch (e) {
            reject(e);
        }
    });
}

exports.generateCode = generateCode;