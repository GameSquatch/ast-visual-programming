
interface ArgSpec {
    name: string | null,
    dataType: string,
    description: string
}

interface FunctionDefinition {
    args: ArgSpec[],
    infiniteArgs: boolean,
    returnType: string,
    description: string
}

type FunctionCollection = Record<string, FunctionDefinition>;

const utilDefs: Record<string, FunctionCollection> = {
    "LoggerUtil": {
        "logString": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "The string you want to be logged"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Void",
            "description": "Logs the string expression to the console"
        },
        "logNumber": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number you want to be logged"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Void",
            "description": "Logs the number expression to the console"
        }
    },
    "StringUtil": {
        "concat": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "A string that will be combined with the other arguments"
                },
                {
                    "dataType": "String",
                    "name": null,
                    "description": "A string that will be combined with the other arguments"
                }
            ],
            "infiniteArgs": true,
            "returnType": "String",
            "description": "Combines the string arguments into a single string in the order they are passed"
        },
        "trim": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "A string that you want to be trimmed"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Removes whitespace characters from the beginning and end of the argument and returns a new string"
        },
        "length": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "A string you want the length of"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Integer",
            "description": "Returns the length of a string expression"
        },
        "fromInt": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number you want to be changed into a string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts a number into a string"
        },
        "substring": {
            "args": [
                {
                    "dataType": "String",
                    "name": "base string",
                    "description": "The string you want to use as the base"
                },
                {
                    "dataType": "Integer",
                    "name": "start index",
                    "description": "The starting point index within the base string"
                },
                {
                    "dataType": "Integer",
                    "name": "num characters",
                    "description": "The number of characters you want to extract"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Takes a part of a specified string and returns it"
        },
        "equalTo": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "The string that will be compared to"
                },
                {
                    "dataType": "String",
                    "name": null,
                    "description": "The string to be compared to the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Compares two strings against each other and returns true or false"
        },
        "notEqualTo": {
            "args": [
                {
                    "dataType": "String",
                    "name": null,
                    "description": "The string that will be compared to"
                },
                {
                    "dataType": "String",
                    "name": null,
                    "description": "The string to be compared to the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Compares two strings against each other and returns true or false"
        },
        "charAt": {
            "args": [
                {
                    "dataType": "String",
                    "name": "base string",
                    "description": "The string you are indexing"
                },
                {
                    "dataType": "Integer",
                    "name": "index",
                    "description": "The index within the string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Returns the character at the specified position"
        }
    },
    "IntegerUtil": {
        "toString": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number that you want to be a string"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts a number into a string"
        },
        "add": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to be added to the other arguments"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to be added to the other arguments"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Adds any amount of numbers together in the order they are passed"
        },
        "subtract": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "base number",
                    "description": "The base, starting number"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to be subtracted from the result of the previous arguments"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Subtracts any amount of numbers from the base number in the order they are passed"
        },
        "multiply": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to multiply the other arguments by"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to multiply the other arguments by"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Multiplies any amount of numbers together in the order they are passed"
        },
        "divide": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": "base number",
                    "description": "The base number to be divided by the following arguments"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number by which to divide the result from previous arguments"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Integer",
            "description": "Divides the base number by any amount of numbers in the order they are passed"
        },
        "equalTo": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to compare against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to compare against"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Compares two numbers against each other and returns true or false"
        },
        "notEqualTo": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to compare against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "A number to compare against"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Compares two numbers against each other and returns true or false"
        },
        "greaterThan": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being compared against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being checked as greater than the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks the second argument as being greater than the first argument and returns true or false"
        },
        "greaterThanOrEqual": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being compared against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being checked as greater than or equal to the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks the second argument as being greater than or equal to the first argument and returns true or false"
        },
        "lessThan": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being compared against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number be checked as less than the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks the second argument as being less than the first argument and returns true or false"
        },
        "lessThanOrEqual": {
            "args": [
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number being compared against"
                },
                {
                    "dataType": "Integer",
                    "name": null,
                    "description": "The number be checked as less than or equal to the first argument"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Checks the second argument as being less than or equal to the first argument and returns true or false"
        }
    },
    "BooleanUtil": {
        "and": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "Checking for true with all the other arguments"
                },
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "Checking for true with all the other arguments"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Boolean",
            "description": "Checks that all arguments evaluate to true and return true, otherwise false"
        },
        "or": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "Checking for one of these arguments to be true"
                },
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "Checking for one of these arguments to be true"
                }
            ],
            "infiniteArgs": true,
            "returnType": "Boolean",
            "description": "Checks that at least one argument evaluates to true and returns true, otherwise false"
        },
        "not": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "The boolean expression you want to invert"
                }
            ],
            "infiniteArgs": false,
            "returnType": "Boolean",
            "description": "Inverts a true to false and a false to true"
        },
        "toString": {
            "args": [
                {
                    "dataType": "Boolean",
                    "name": null,
                    "description": "The bool you want to convert"
                }
            ],
            "infiniteArgs": false,
            "returnType": "String",
            "description": "Converts a boolean to a string"
        }
    }
};

export { utilDefs };