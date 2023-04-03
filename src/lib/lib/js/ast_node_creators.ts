import typeDefs from './type_definitions.js';
import { utilDefs, type ArgSpec } from './util_definitions.js';

type PrimitiveType = "String" | "Integer" | "Boolean";
type FileType = "func";

type IFlowStep = IUtilityCallExpression
    | ILiteralNode
    | IVariableRefCallExpression
    | IFlowStepExpression
    | IRefIdentifier
    | IRefAssignment
    | IFunctionCallExpression
    | IIdentiferRefCallExpression
    | IAssignmentExpression
    | IIfStatement
    | IReturnStatement;
    
type ArgumentNode = {
    nodeData: ILiteralNode | IIdentiferRefCallExpression | IUtilityCallExpression | IRefIdentifier | IVariableRefCallExpression | IFunctionCallExpression
} & ArgSpec;

interface IUtilityCallExpression {
    type: "UtilityCallExpression";
    utilityName: string;
    utilityMethod: string;
    arguments: ArgumentNode[];
    dataType: string;
}

type ILiteralNode = IStringLiteral
    | IIntegerLiteral
    | IBooleanLiteral;


interface IStringLiteral {
    type: "StringLiteral";
    value: string;
    dataType: "String";
}

interface IIntegerLiteral {
    type: "IntegerLiteral";
    value: number;
    dataType: "Integer";
}

interface IBooleanLiteral {
    type: "BooleanLiteral";
    value: boolean;
    dataType: "Boolean";
}

interface IVariableRefCallExpression {
    type: "VariableRefCallExpression";
    refData: any;
    method: string;
    arguments: ArgumentNode[];
    dataType: PrimitiveType;
}

interface IFlowStepExpression {
    type: "FlowStep";
    id: string;
    expression: any | null;
}

interface IRefIdentifier {
    type: "RefIdentifier";
    refId: string;
    dataType: PrimitiveType;
    fnRefType: string;
}

interface IRefAssignment {
    type: "RefAssignment";
    left: IRefIdentifier;
    right: IUtilityCallExpression | IVariableRefCallExpression | ILiteralNode;
}

interface IAssignmentExpression {
    type: "AssignmentExpression";
    left: IRefIdentifier;
    right: IUtilityCallExpression | IVariableRefCallExpression | ILiteralNode
}

interface IFunctionCallExpression {
    type: "FunctionCallExpression";
    fileId: string;
    dataType: PrimitiveType;
    arguments: ArgumentNode[];
}

interface IIdentiferRefCallExpression {
    type: "IdentifierRefCallExpression";
    refData: any;
    method: string;
    arguments: ArgumentNode[];
    dataType: PrimitiveType;
}

interface IIfStatement {
    type: "IfStatement";
    id: string;
    test: IFlowStep | null;
    consequent: {
        body: IFlowStep[]
    };
    alternate: {
        body: IFlowStep[]
    };
}

interface IReturnStatement {
    type: "ReturnStatement";
    functionId: string;
    returnType: PrimitiveType;
    expression: IFlowStep;
}


type RefIdentifierParams = { refId: string; dataType: PrimitiveType; fnRefType: string };


class AstNodeCreators {
    static util({ utilDefName, methodName }: { utilDefName: string, methodName: string }): IUtilityCallExpression {
        const methodDefinition = utilDefs[utilDefName][methodName];
        const definitionArgs = methodDefinition.args;

        return {
            type: "UtilityCallExpression",
            utilityName: utilDefName,
            utilityMethod: methodName,
            arguments: definitionArgs.map((argType: ArgSpec): ArgumentNode => {
                const argNodeData = AstNodeCreators.literalFromDataType(argType.dataType);
                return {
                    nodeData: argNodeData,
                    ...argType
                };
            }),
            dataType: methodDefinition.returnType
        };
    }

    static identifierRefCallExpression({ method, dataType, refData }: { method: string, dataType: PrimitiveType, refData: any }): IIdentiferRefCallExpression {
        const methodDefinition = typeDefs[refData.dataType][method];
        const definitionArgs = methodDefinition.args;

        return {
            type: "IdentifierRefCallExpression",
            refData: {...refData},
            method,
            arguments: definitionArgs.map((argType: ArgSpec): ArgumentNode => {
                const argNodeData = AstNodeCreators.literalFromDataType(argType.dataType);
                return {
                    nodeData: argNodeData,
                    ...argType
                };
            }),
            dataType
        };
    }

    static flowStep(): IFlowStep {
        const newUuid = crypto.randomUUID();
        return {
            type: "FlowStep",
            id: newUuid,
            expression: null
        };
    }
    
    static ifStatement({ testData } = { testData: null}): IIfStatement {
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
    }
    
    static variableRefAssignment({ refId, dataType, fnRefType }: RefIdentifierParams): IAssignmentExpression {
        return {
            type: "AssignmentExpression",
            left: {
                type: "RefIdentifier",
                refId,
                dataType,
                fnRefType
            },
            right: AstNodeCreators.literalFromDataType(dataType)
        };
    }
    
    static variableRefIdentifer({ refId, dataType, fnRefType }: RefIdentifierParams): IRefIdentifier {
        return {
            type: "RefIdentifier",
            refId,
            dataType,
            fnRefType
        };
    }

    static returnStatement({ functionId, returnType }: { functionId: string; returnType: PrimitiveType }): IReturnStatement {
        return {
            type: "ReturnStatement",
            functionId,
            returnType,
            expression: AstNodeCreators.literalFromDataType(returnType)
        };
    }

    static fromFileType(fileType: FileType, fileData: any) {
        switch (fileType) {
            case 'func':
                return AstNodeCreators.func(fileData);
        }
    }
    
    static func({ fileId, objectFlowData: { returnType } }: { fileId: string; objectFlowData: { returnType: PrimitiveType }}): IFunctionCallExpression {
        return {
            type: "FunctionCallExpression",
            fileId,
            arguments: [],
            dataType: returnType
        };
    }


    static literalFromDataType(dataType: PrimitiveType): ILiteralNode {
        switch (dataType) {
            case "String":
                return AstNodeCreators.stringLiteral();
            case "Boolean":
                return AstNodeCreators.booleanLiteral();
            case "Integer":
                return AstNodeCreators.integerLiteral();
        }
    }

    static stringLiteral(startingValue = ""): IStringLiteral {
        return {
            type: "StringLiteral",
            value: startingValue,
            dataType: "String"
        };
    }
    
    static integerLiteral(startingValue = 0): IIntegerLiteral {
        return {
            type: "IntegerLiteral",
            value: startingValue,
            dataType: "Integer"
        };
    }

    static booleanLiteral(startingValue = false): IBooleanLiteral {
        return {
            type: "BooleanLiteral",
            value: startingValue,
            dataType: "Boolean"
        };
    }
}

export {
    AstNodeCreators,
    type IAssignmentExpression,
    type IFunctionCallExpression,
    type PrimitiveType,
    type IIdentiferRefCallExpression,
    type IReturnStatement,
    type IUtilityCallExpression
};