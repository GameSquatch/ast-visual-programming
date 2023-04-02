
/**
 * @typedef {Object} ArgSpec
 * @property {string?} name
 * @property {string} dataType
 * @property {string} description
 */
/**
 * @typedef {Object} FunctionDefinition
 * @property {Array<ArgSpec>} args
 * @property {boolean} infiniteArgs
 * @property {string} returnType
 * @property {string} description
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
                    "dataType": "String",
                    "name": null,
                    "description": "A string you want to append to the caller"
                }
            ],
            "infiniteArgs": true,
            "returnType": "String",
            "description": "Appends any number of strings onto the caller"
        },
        "trim": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Removes whitespace from calling string"
        },
        "prepend": {
            "args": [
                {
                    "name": null,
                    "dataType": "String",
                    "description": "A string you want to prepend to the caller"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Prepends a string onto the calling string"
        },
        "len": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Integer",
            "description": "Returns the length of the string"
        },
        "isEmpty": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks if calling string is empty"
        },
        "isNotEmpty": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "A string you want to append to the caller"
        },
        "equalTo": {
            "args": [
                {
                    "name": null,
                    "dataType": "String",
                    "description": "Compares equality against calling string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks equality of strings"
        },
        "notEqualTo": {
            "args": [
                {
                    "name": null,
                    "dataType": "String",
                    "description": "Compared against calling string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks for non-equality of strings"
        },
        "charAt": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "index",
                    "description": "The index within the string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Returns the character at the specified position"
        },
        "includes": {
            "args": [
                {
                    "dataType": "String",
                    "name": "needle",
                    "description": "A string to search within the calling string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "If the calling string contains needle, return true, otherwise false"
        },
        "indexOf": {
            "args": [
                {
                    "dataType": "String",
                    "name": "needle",
                    "description": "A string to search within the calling string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Integer",
            "description": "If the calling string contains needle, return index of first char, otherwise -1"
        },
        "repeat": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "count",
                    "description": "The number of times to repeat the calling string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Repeats the calling string count times and returns that as a new string"
        },
        "replace": {
            "args": [
                {
                    "dataType": "String",
                    "name": "pattern",
                    "description": "A string to search within the calling string"
                },
                {
                    "dataType": "String",
                    "name": "replacement",
                    "description": "The value to replace the pattern with"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Replaces a pattern with something and returns a new string"
        },
        "replaceAll": {
            "args": [
                {
                    "dataType": "String",
                    "name": "pattern",
                    "description": "A string to search within the calling string"
                },
                {
                    "dataType": "String",
                    "name": "replacement",
                    "description": "The value to replace the pattern with"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Replaces all occurrances of a pattern with something and returns a new string"
        },
        "toUpperCase": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts string to upper case"
        },
        "toLowerCase": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts string to lower case"
        }
    },
    "Integer": {
        "add": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "Adds to the calling number"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Adds any amount of numbers to the calling number"
        },
        "subtract": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "Subtracted from calling number"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Subtracts any amount of numbers from the base number in the order they are passed"
        },
        "multiplyBy": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to multiply the calling number by"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Multiplies any amount of numbers together in the order they are passed"
        },
        "divideBy": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number by which to divide the calling number"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Divides the base number by any amount of numbers in the order they are passed"
        },
        "equalTo": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare against the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks calling number equality to argument"
        },
        "notEqualTo": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare againts the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Compares the calling number against the argument for non-euality"
        },
        "greaterThan": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare against the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks that the argument is greater than the calling number"
        },
        "greaterThanOrEqual": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare against the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks that the argument is greater than or equal to the calling number"
        },
        "lessThan": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare against the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks that the argument is less than the calling number"
        },
        "lessThanOrEqual": {
            "args": [
                {
                    "name": null,
                    "dataType": "Integer",
                    "description": "A number to compare against the calling number"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks that the argument is less than or equal to the calling number"
        },
        "asString": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts the calling number to a string"
        }
    },
    "Boolean": {
        "and": {
            "args": [
                {
                    "name": null,
                    "dataType": "Boolean",
                    "description": "A boolean expression checked for truthiness"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Returns true only if both the calling boolean and the argument are true"
        },
        "or": {
            "args": [
                {
                    "name": null,
                    "dataType": "Boolean",
                    "description": "A boolean expression checked for truthiness"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Returns true if either the calling boolean or the argument are true"
        },
        "not": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Inverts the calling boolean"
        },
        "asString": {
            "args": [],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts the calling boolean to a string"
        }
    },
    "List": {
        "join": {
            "args": [
                {
                    "name": null,
                    "dataType": "String",
                    "description": "todo"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "todo"
        }
    }
};

export default typeDefs;