/**
 * @typedef {Object} FunctionDefinition
 * @property {string[]} args
 * @property {boolean} infiniteArgs
 * @property {string} returnType
 */
/**
 * @typedef {Object.<string, FunctionDefinition>} FunctionCollection
 */
/**
 * @type {Object.<string, FunctionCollection>}
 */
const typeDefs =  {
    "String": {
        "concat": {
            "args": [
                "String"
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
                "String"
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
        "equals": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEquals": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    },
    "Integer": {
        "add": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "subtract": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
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
                "Boolean"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "or": {
            "args": [
                "Boolean"
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
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        }
    }
};

export default typeDefs;