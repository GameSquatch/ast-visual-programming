
/**
 * @typedef {Object} ArgSpec
 * @property {string} name
 * @property {string} dataType
 */
/**
 * @typedef {Object} FunctionDefinition
 * @property {Array<ArgSpec>} args
 * @property {boolean} infiniteArgs
 * @property {string} returnType
 */
/**
 * @typedef {Object.<string, FunctionDefinition>} FunctionCollection
 */
/**
 * @type {Object.<string, FunctionCollection>}
 */
const typeDefs = {
    "String": {
        "concat": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "String"
                }
            ],
            "infiniteArgs": true,
            "returnType": "String"
        },
        "trim": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "prepend": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "String"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "len": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Integer"
        },
        "isEmpty": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "isNotEmpty": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "equalTo": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "String"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEqualTo": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "String"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    },
    "Integer": {
        "add": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "subtract": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "multiplyBy": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "divideBy": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "equalTo": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEqualTo": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThan": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThanOrEqual": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThan": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThanOrEqual": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Integer"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "toString": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String"
        }
    },
    "Boolean": {
        "and": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Boolean"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "or": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "Boolean"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "not": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "toString": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String"
        }
    },
    "List": {
        "join": {
            "args": [
                {
                    "name": "todo",
                    "dataType": "String"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String"
        }
    }
};

export default typeDefs;