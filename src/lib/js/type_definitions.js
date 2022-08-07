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
    "console": {
        "log": {
            "args": [
                "String"
            ],
            "infiniteArgs": true,
            "returnType": "String"
        }
    },
    "StringUtil": {
        "concat": {
            "args": [
                "String",
                "String"
            ],
            "infiniteArgs": true,
            "returnType": "String"
        },
        "trim": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "length": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "Integer"
        },
        "fromInt": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "substring": {
            "args": [
                "String",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        }
    },
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
        "length": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Integer"
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