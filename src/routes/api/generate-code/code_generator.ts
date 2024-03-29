import { codeWriter, outputLiteralValue } from './code_writer.js';

/**
 * @param {Object} codeInfo
 * @param {string} codeInfo.entryFunctionId
 * @param {Object} codeInfo.codeData
 * @param {Object} codeInfo.fileMetadata
 * @param {Array[]} codeInfo.inputs
 * @returns {Promise<string>}
 */
async function generateCode(codeInfo) {
    try {
        const { entryFunctionId, codeData, fileMetadata, inputs } = codeInfo;
        let codeStr = [];
        /** @type {Object.<string, boolean>} */
        let referencedFunctions = {};

        /** @type {{ body: Object.<string, Object>[], info: { id: string, dataType: string, variables: Object }}} */
        const currentFn = codeData[entryFunctionId];

        (function generateFunction({ body, info }) {
            let codeResult = "";
            const funcId = info.id;
            
            for (const flowStep of body) {
                findReferencedFunctions(flowStep, (fnId) => {
                    if (fnId === funcId) return;
                    referencedFunctions[fnId] = false
                });
                codeResult += `    executedSteps.push('${flowStep.id}');\n`;
                codeResult += codeWriter(flowStep, funcId, codeInfo);
            }

            let parameterSet = "";
            let parameterInits = "";
            let i = 0;
            for (const paramId in fileMetadata[funcId].objectFlowData.parameters) {
                const { name, defaultValue, dataType } = fileMetadata[funcId].objectFlowData.parameters[paramId];
                const defaultStr = outputLiteralValue(defaultValue, dataType);
                parameterInits += `    ${name} = ${name} ?? ${defaultStr};\n`;

                if (i > 0) parameterSet += ', ';
                parameterSet += name;
                i += 1;
            }

            let variableInitBlock = "";
            for (const variable of Object.values(info.variables)) {
                variableInitBlock += `    let ${variable.name} = ${outputLiteralValue(variable.defaultValue, variable.dataType)};\n`;
            }
            variableInitBlock += "\n";


            codeStr.push(`function ${fileMetadata[funcId].title}(${parameterSet}) {\n${parameterInits}${variableInitBlock}${codeResult}}\n`);

            // set generated flag for this function
            referencedFunctions[info.id] = true;
            const remainingFuncReferences = Object.entries(referencedFunctions).filter(([fnId, hasBeenGenerated]) => !hasBeenGenerated);
            if (remainingFuncReferences.length > 0) {
                // recursively call this function to generate the next referenced function
                generateFunction(codeData[remainingFuncReferences[0][0]]);
            }
        })(currentFn);

        const inputsAsCode = inputs.map((inPair) => outputLiteralValue(inPair[0], inPair[1]));

        codeStr.push(`${fileMetadata[entryFunctionId].title}(${inputsAsCode});`);
        return codeStr.join('');
    } catch (e) {
        throw new Error(e);
    }
}


function findReferencedFunctions(astNode, foundCallback) {
    if (astNode === null) {
        return;
    }

    switch (astNode.type) {
        case "FlowStep":
        case "ReturnStatement":
            findReferencedFunctions(astNode.expression, foundCallback);
            break;
        case "AssignmentExpression":
            findReferencedFunctions(astNode.left, foundCallback);
            findReferencedFunctions(astNode.right, foundCallback);
            break;
        case "IfStatement":
            findReferencedFunctions(astNode.test, foundCallback);
            astNode.consequent.body.forEach((step) => findReferencedFunctions(step, foundCallback));
            astNode.alternate.body.forEach((step) => findReferencedFunctions(step, foundCallback));
            break;
        case "FunctionCallExpression":
            foundCallback(astNode.fileId);
        case "IdentifierRefCallExpression":
        case "UtilityCallExpression":
            astNode.arguments.forEach((arg) => findReferencedFunctions(arg.nodeData, foundCallback));
            break;
        default:
            break;
    }
}


export { generateCode };