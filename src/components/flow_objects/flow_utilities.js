 import typeDefs from '../../lib/js/type_definitions.js';
 import { utilDefs } from '../../lib/js/util_definitions.js';
 
 /**
  * !contextType is when things don't have a type in their parent context
  * @function
  * @param {{ methodName: string, typeDefinitionName: string, contextDataType: string }} param0 
  * @returns {string[]}
  */
 function methodNamesThatMatchContextDataType({ typeDefinitionName, contextDataType }) {
    const typeSection = typeDefs[typeDefinitionName];
    return Object.keys(typeSection).filter((methodName) => !contextDataType || typeSection[methodName].returnType === contextDataType);
}


 /**
  * !contextType is when things don't have a type in their parent context
  * @function
  * @param {{ methodName: string, utilDefinitionName: string, contextDataType: string }} param0 
  * @returns {string[]}
  */
  function utilNamesThatMatchContextDataType({ utilDefinitionName, contextDataType }) {
    const typeSection = utilDefs[utilDefinitionName];
    return Object.keys(typeSection).filter((methodName) => (!contextDataType || typeSection[methodName].returnType === contextDataType || typeSection[methodName].returnType === 'Void') );
}


export { methodNamesThatMatchContextDataType, utilNamesThatMatchContextDataType };