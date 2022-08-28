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
        },
        "equals": {
            "args": [
                "String",
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEquals": {
            "args": [
                "String",
                "String"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
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
        },
        "subtract": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "multiply": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "divide": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": true,
            "returnType": "Integer"
        },
        "equals": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "notEquals": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThan": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "greaterThanOrEqual": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThan": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        },
        "lessThanOrEqual": {
            "args": [
                "Integer",
                "Integer"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    },
    "BooleanUtil": {
        "and": {
            "args": [
                "Boolean",
                "Boolean"
            ],
            "infiniteArgs": true,
            "returnType": "Boolean"
        },
        "or": {
            "args": [
                "Boolean",
                "Boolean"
            ],
            "infiniteArgs": true,
            "returnType": "Boolean"
        },
        "not": {
            "args": [
                "Boolean"
            ],
            "infiniteArgs": false,
            "returnType": "Boolean"
        }
    }
};

export { utilDefs };