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
const utilDefs = {
    "LoggerUtil": {
        "logString": {
            "args": [
                "String"
            ],
            "infiniteArgs": true,
            "returnType": "Void"
        },
        "logNumber": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Void"
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
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        }
    },
    "IntegerUtil": {
        "toString": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "String"
        },
        "add": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        }
    }
};

export { utilDefs };