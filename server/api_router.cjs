const express = require('express');
const { checkCookieToken } = require('./middleware.cjs');
const { generateCode } = require('../code_generator/code_generator.js');
const router = express.Router();
const uuidv4 =  require('uuid').v4;
const { astMutators } = require('../src/lib/js/ast_mutation_functions.cjs');

router.use(checkCookieToken, express.json());


/**
 * @typedef {Object} FunctionParameterConfig
 * @property {string} name
 * @property {string} dataType
 * @property {string|number|boolean} defaultValue
 */
/**
 * @typedef {Object} FileMetadataFlowData
 * @property {Object.<string, FunctionParameterConfig>} parameters
 * @property {string} returnType
 */
/**
 * @typedef {Object} FileMetadataEntry
 * @property {string} title
 * @property {string} fileType
 * @property {FileMetadataFlowData} objectFlowData
 */

/**
 * @type {Object.<string, FileMetadataEntry>} FileMetadata
 */
 const fm = {
    "factorial": {
        title: "factorial",
        fileType: "function",
        objectFlowData: {
            parameters: {
                "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5": {
                    name: "a",
                    dataType: "Integer",
                    defaultValue: 0
                }
            },
            returnType: "Integer"
        }
    },
    "abc": {
        title: "main",
        fileType: "function",
        objectFlowData: {
            parameters: {},
            returnType: "String"
        }
    }
};

router.get('/file-metadata', (req, res) => {
    res.status(200).json(fm);
});




const fileTree = {
    files: [
        {
            type: "file",
            id: "abc"
        },
        {
            type: "file",
            id: "factorial"
        }
    ],
    folders: [
        {
            title: 'folder',
            id: uuidv4(),
            type: 'folder',
            files: [],
            folders: []
        }
    ]
}

router.get('/file-tree', (req, res) => {
    res.status(200).json(fileTree);
});




let fileData = {
    "factorial": {
        "info": {
            "id": "factorial",
            "variables": {}
        },
        "body": [
            {
                "type": "IfStatement",
                "id": uuidv4(),
                "test": {
                    "type": "IdentifierRefCallExpression",
                    "method": "lessThan",
                    "dataType": "Boolean",
                    "arguments": [
                        {
                            "nodeData": {
                                "type": "IntegerLiteral",
                                "value": 2,
                                "dataType": "Integer"
                            },
                            "name": "a",
                            "description": "The number who's factorial you want to calculate",
                            "dataType": "Integer"
                        }
                    ],
                    "refData": {
                        "type": "RefIdentifier",
                        "fnRefType": "parameters",
                        "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                        "dataType": "Integer"
                    }
                },
                "consequent": {
                    "body": [
                        {
                            "type": "FlowStep",
                            "id": uuidv4(),
                            "expression": {
                                "type": "ReturnStatement",
                                "functionId": "factorial",
                                "returnType": "Integer",
                                "expression": {
                                    "type": "IntegerLiteral",
                                    "value": 1,
                                    "dataType": "Integer"
                                }
                            }
                        }
                    ]
                },
                "alternate": {
                    "body": [
                        {
                            "type": "FlowStep",
                            "id": uuidv4(),
                            "expression":
                            {
                                "type": "ReturnStatement",
                                "functionId": "factorial",
                                "returnType": "Integer",
                                "expression": {
                                    "type": "IdentifierRefCallExpression",
                                    "refData": {
                                        "type": "RefIdentifier",
                                        "fnRefType": "parameters",
                                        "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                                        "dataType": "Integer"
                                    },
                                    "dataType": "Integer",
                                    "method": "multiplyBy",
                                    "arguments": [
                                        {
                                            "nodeData": {
                                                "type": "FunctionCallExpression",
                                                "fileId": "factorial",
                                                "dataType": "Integer",
                                                "arguments": [
                                                    {
                                                        "nodeData": {
                                                            "type": "IdentifierRefCallExpression",
                                                            "dataType": "Integer",
                                                            "refData": {
                                                                "type": "RefIdentifier",
                                                                "fnRefType": "parameters",
                                                                "refId": "8c2f9aa2-0a80-4409-8e96-da2aabe1d1d5",
                                                                "dataType": "Integer"
                                                            },
                                                            "method": "subtract",
                                                            "arguments": [
                                                                {
                                                                    "nodeData": {
                                                                        "type": "IntegerLiteral",
                                                                        "value": 1,
                                                                        "dataType": "Integer"
                                                                    },
                                                                    "name": "a",
                                                                    "description": "Ref identifier argument 8c2",
                                                                    "dataType": "Integer"
                                                                }
                                                            ]
                                                        },
                                                        "name": "a",
                                                        "description": "",
                                                        "dataType": "Integer"
                                                    }
                                                ]
                                            },
                                            "name": "ok",
                                            "description": "To multiply by the caller",
                                            "dataType": "Integer"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    "abc": {
        "info": {
            "id": "abc",
            "variables": {}
        },
        "body": [
            {
                "type": "FlowStep",
                "id": uuidv4(),
                "expression": {
                    "type": "UtilityCallExpression",
                    "utilityName": "LoggerUtil",
                    "utilityMethod": "logNumber",
                    "dataType": "Void",
                    "arguments": [
                        {
                            "nodeData": {
                                "type": "FunctionCallExpression",
                                "fileId": "factorial",
                                "dataType": "Integer",
                                "arguments": [
                                    {
                                        "nodeData": {
                                            "type": "IntegerLiteral",
                                            "value": 5,
                                            "dataType": "Integer"
                                        },
                                        "name": "a",
                                        "description": "The number who's factorial you want to calculate",
                                        "dataType": "Integer"
                                    }
                                ]
                            },
                            "dataType": "Integer",
                            "name": null,
                            "description": "The thing to log"
                        }
                    ]
                }
            }
        ]
    }
};

router.get('/file/:fileId', (req, res) => {
    res.status(200).json(fileData[req.params.fileId]);
});


router.post('/generate-code', (req, res) => {
    res.set({
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
    });

    if (req.body.entryFunctionId === undefined) {
        res.status(400).send('Bad message; need entryFunctionId');
        return;
    }

    generateCode({ ...req.body, codeData: fileData })
        .then((generatedCode) => {
            res.status(200).send(generatedCode);
        })
        .catch((e) => {
            res.status(500).send('Something broke: ' + e.message);
        });
});

module.exports = {
    apiRouter: router,
    fileData
};