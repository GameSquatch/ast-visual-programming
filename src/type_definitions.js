/** @type {TypeDefinitionWrapper} */
const typeDefs =  {
    "StringUtil": {
        "concat": {
            "args": [
                "String",
                "String"
            ],
            "infiniteArgs": true,
            "returns": "String"
        },
        "trim": {
            "args": [
                "String"
            ],
            "inifiniteArgs": false,
            "returns": "String"
        },
        "length": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "Integer"
        },
        "fromInt": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": false,
            "returns": "String"
        },
        "substring": {
            "args": [
                "Integer",
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        }
    },
    "String": {
        "concat": {
            "args": [
                "String"
            ],
            "infiniteArgs": true,
            "returns": "String"
        },
        "trim": {
            "args": [],
            "inifiniteArgs": false,
            "returns": "String"
        },
        "prepend": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        },
        "length": {
            "args": [],
            "infiniteArgs": false,
            "returns": "Integer"
        }
    },
    "Integer": {
        "parse": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "Integer"
        },
        "add": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returns": "Integer"
        },
        "subtract": {
            "args": [
                "Integer"
            ],
            "infiniteArgs": true,
            "returns": "Integer"
        },
        "toString": {
            "args": [],
            "infiniteArgs": false,
            "returns": "String"
        }
    },
    "List": {
        "join": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "String"
        }
    }
};

export default typeDefs;