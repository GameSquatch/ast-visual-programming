
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
        "split": {
            "args": [
                "String"
            ],
            "infiniteArgs": false,
            "returns": "List<String>"
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