/**
 * @typedef {Object} ArgSpec
 * @property {string} name
 * @property {string} dataType
 */
/**
 * @typedef {Object} FunctionDefinition
 * @property {ArgSpec[]} args
 * @property {boolean} infiniteArgs
 * @property {string} returnType
 */
/**
 * @typedef {Object.<string, FunctionDefinition>} FunctionCollection
 */
/**
 * @type {Object.<string, FunctionCollection>}
 */
const utilDefs = {
    "LoggerUtil": {
        "logString": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Void"
        },
        "logNumber": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Void"
        }
    },
    "StringUtil": {
        "concat": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                },
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "String"
        },
        "trim": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "length": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Integer"
        },
        "fromInt": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "substring": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "equalTo": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                },
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEqualTo": {
            "args": [
                {
                    "dataType": "String",
                    "name": "todo"
                },
                {
                    "dataType": "String",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    },
    "IntegerUtil": {
        "toString": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "add": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "subtract": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "multiply": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "divide": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "equalTo": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEqualTo": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThan": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThanOrEqual": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThan": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThanOrEqual": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "todo"
                },
                {
                    "dataType": "Integer",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    },
    "BooleanUtil": {
        "and": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": "todo"
                },
                {
                    "dataType": "Boolean",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Boolean"
        },
        "or": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": "todo"
                },
                {
                    "dataType": "Boolean",
                    "name": "todo"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Boolean"
        },
        "not": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    }
};

export { utilDefs };