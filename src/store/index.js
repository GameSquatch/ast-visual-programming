import { createStore } from 'vuex';
import mockData from '../data-json.js';
import dropDataTemplates from '../drop_data_templates.js'

const store = createStore({
    state: {
        ast: mockData
    },
    mutations: {
        swapNodes(state, { fromLocation, toLocation }) {
            const parent = fetchParentUsingLocation(state.ast, fromLocation);
            const fromPaths = fromLocation.split('.');
            const toPaths = toLocation.split('.');
            const fromEnd = fromPaths[fromPaths.length - 1];
            const toEnd = toPaths[toPaths.length - 1];

            const tempRef = parent[toEnd];
            parent[toEnd] = parent[fromEnd];
            parent[fromEnd] = tempRef;
            parent[toEnd].location = toLocation;
            parent[fromEnd].location = fromLocation;
        },
        /**
         * 
         * @param {Object} state 
         * @param {Object} param1
         * @param {string} param1.location
         * @param {Object} param1.node
         */
        addNode(state, { location, node }) {
            const parent = fetchParentUsingLocation(state.ast, location);
            const placeInParent = getLastItemInLocation(location);
            // Expression statements are always the outer wrappers to other expressions. I.e.
            // you will never find and expression statement inside another at any level.
            if (node.type == "ExpressionStatement" && parent.type == "ExpressionStatement") {
                return;
            }
            node.location = location;
            parent[placeInParent] = node;
        },
        /**
         * 
         * @param {Object} state
         * @param {Object} param1 
         * @param {string} param1.refObj
         * @param {String|Number} param1.accessor
         * @param {Object} node
         */
        insertNode(state, { refObj, accessor, node }) {
            refObj = [...refObj.splice(parseInt(accessor) + 1, 0, node)];
        },

        changeMethod(state, { refObj, accessor, methodName, objectName }) {
            console.log(refObj);
            refObj[accessor] = dropDataTemplates.stringUtil(methodName);
            // state.ast.main.body[2].expression = {
            //     type: "CallExpression",
            //     callee: {
            //         type: "MemberExpression",
            //         object: {
            //             type: "Identifier",
            //             name: "StringUtil"
            //         },
            //         property: {
            //             type: "Identifier",
            //             name: methodName
            //         }
            //     },
            //     arguments: []
            // };
            //console.log(state);
        }
    }
});

/**
 * Traverses the tree using the given location and returns the
 * parent of the node at given location
 * @param {Object} ast - Root of the JSON syntax tree
 * @param {string} location - Dot-delimited path to a node in the tree
 * @returns {Object}
 */
function fetchParentUsingLocation(ast, location) {
    const nodePaths = location.split('.');

    let currentNode = ast.main;
    let i = 0;
    for (i; i < nodePaths.length - 1; ++i) {
        currentNode = currentNode[nodePaths[i]];
    }

    return currentNode;
}

/**
 * 
 * @param {string} location 
 * @returns {string}
 */
function getLastItemInLocation(location) {
    const locations = location.split('.');
    return locations[locations.length - 1];
}

export default store;