import type { PrimitiveType } from './lib/js/node_templates.js';

interface FunctionRefData {
    name: string,
    dataType: PrimitiveType,
    defaultValue: string | number | boolean,
    refId: string,
    dragType: string,
    fnRefType?: string
}

interface FunctionParameterConfig {
    name: string,
    dataType: PrimitiveType,
    defaultValue: string | number | boolean
}

interface FileDragData {
    fileId: string,
    treePath: string,
    title: string,
    fileType: string,
    objectFlowData: {
        parameters: FunctionParameterConfig,
        dataType: PrimitiveType
    }
}

export type { FunctionRefData, FunctionParameterConfig, FileDragData }