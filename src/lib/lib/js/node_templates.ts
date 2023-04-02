import typeDefs from './type_definitions.js';
import { utilDefs } from './util_definitions.js';


type IFlowStep = IUtilityCallExpression
    | ILiteralNode
    | IVariableRefCallExpression
    | IFlowStepExpression
    | IRefIdentifier
    | IRefAssignment
    | IFunctionCallExpression
    | IIdentiferRefCallExpression;
    
type ArgumentNodes = ILiteralNode
    | IUtilityCallExpression
    | IRefIdentifier
    | IFunctionCallExpression
    | IIdentiferRefCallExpression;

interface IUtilityCallExpression {
    type: "UtilityCallExpression";
    utilityName: string;
    utilityMethod: string;
    arguments: ArgumentNodes[];
    dataType: string;
}

interface ILiteralNode {
    type: "StringLiteral" | "IntegerLiteral" | "BooleanLiteral";
    value: string | number | boolean;
    dataType: string;
}


interface IVariableRefCallExpression {
    type: "VariableRefCallExpression";
    refData: any;
    method: string;
    arguments: ArgumentNodes[];
    dataType: string;
}

interface IFlowStepExpression {
    type: "FlowStep";
    id: string;
    expression: any | null;
}

interface IRefIdentifier {
    type: "RefIdentifier";
    refId: string;
    dataType: string;
    fnRefType: string;
}

interface IRefAssignment {
    type: "RefAssignment";
    left: IRefIdentifier;
    right: IUtilityCallExpression | IVariableRefCallExpression | ILiteralNode;
}

interface IFunctionCallExpression {
    type: "FunctionCallExpression";
    fileId: string;
    dataType: string;
    arguments: IFlowStep[];
}

interface IIdentiferRefCallExpression {
    type: "IdentifierRefCallExpression";
    refData: any;
    method: string;
    arguments: ArgumentNodes[];
    dataType: string;
}


const nodeTemplates = {
    util: function({ utilDefName, methodName }: { utilDefName: string, methodName: string }): IUtilityCallExpression {
        const methodDefinition = utilDefs[utilDefName][methodName];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: utilDefName,
            utilityMethod: methodName,
            arguments: definitionArgs.map((arg) => {
                const argTypeAdj = arg.dataType + 'Literal' as ("StringLiteral" | "IntegerLiteral" | "BooleanLiteral");
                const argNodeData = literalTemplates[argTypeAdj]();
                return {
                    nodeData: argNodeData,
                    ...arg
                }
            }),
            dataType: methodDefinition.returnType
        };
    },
    identifierRefCallExpression: function({ method, dataType, refData }: { method: string, dataType: string, refData: any }): IIdentiferRefCallExpression {
        const methodDefinition = typeDefs[refData.dataType][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "IdentifierRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType) => {
                const argNodeData = this[argType.dataType + "Literal"]();
                return {
                    nodeData: argNodeData,
                    ...argType
                };
            }),
            dataType
        };
    },
    /** @type {() => FlowStep} */
    flowStep: () => {
        const newUuid = crypto.randomUUID();
        return {
            type: "FlowStep",
            id: newUuid,
            expression: null
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {Object} [spec.testData] 
     * @returns {Object}
     */
    ifStatement: ({ testData } = { testData: null}) => {
        return {
            type: "IfStatement",
            id: crypto.randomUUID(),
            test: testData,
            consequent: {
                body: []
            },
            alternate: {
                body: []
            }
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.refId
     * @param {string} spec.dataType
     * @param {string} spec.fnRefType
     * @returns {RefAssignment}
     */
    variableRefAssignment: function({ refId, dataType, fnRefType }) {
        return {
            type: "AssignmentExpression",
            left: {
                type: "RefIdentifier",
                refId,
                dataType,
                fnRefType
            },
            right: this[dataType + 'Literal']()
        };
    },
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.refId
     * @param {string} spec.dataType
     * @param {string} spec.fnRefType
     * @returns {RefIdentifier}
     */
    variableRefIdentifer: ({ refId, dataType, fnRefType }) => ({
        type: "RefIdentifier",
        refId,
        dataType,
        fnRefType
    }),

    returnStatement: function ({ functionId, returnType }) {
        return {
            type: "ReturnStatement",
            functionId,
            returnType,
            expression: literalTemplates[returnType + 'Literal']()
        };
    },
    
    /**
     * @function
     * @param {Object} spec
     * @param {string} spec.fileId - The id that refers back to the file metadata writable store
     * @param {Object} spec.objectFlowData
     * @returns {FunctionCallExpression}
     */
    "function": function({ fileId, objectFlowData }) {
        return {
            type: "FunctionCallExpression",
            fileId,
            arguments: [],
            dataType: objectFlowData.returnType
        };
    }
};

const literalTemplates: Record<"StringLiteral"|"IntegerLiteral"|"BooleanLiteral", (a?: any) => ILiteralNode> = {
    StringLiteral: ({ value } = { value: "" }) => ({
        type: "StringLiteral",
        value: value,
        dataType: "String"
    }),
    IntegerLiteral: ({ value } = { value: 0 }) => ({
        type: "IntegerLiteral",
        value,
        dataType: "Integer"
    }),
    BooleanLiteral: ({ value } = { value: false }) => ({
        type: "BooleanLiteral",
        value,
        dataType: "Boolean"
    }),
}

export default nodeTemplates;