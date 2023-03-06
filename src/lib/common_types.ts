

interface FunctionRefData {
    name: string,
    dataType: string,
    defaultValue: string | number | boolean,
    refId: string,
    dragType: string,
    fnRefType?: string
}

interface FunctionParameterConfig {
    name: string,
    dataType: string,
    defaultValue: string | number | boolean
}

interface FileDragData {
    fileId: string,
    treePath: string,
    title: string,
    fileType: string,
    objectFlowData: {
        parameters: FunctionParameterConfig,
        dataType: string
    }
}

export type { FunctionRefData, FunctionParameterConfig, FileDragData }