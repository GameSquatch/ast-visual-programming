import { createStore } from 'vuex';
import mockData from '../data-json.js';

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
         * @param {string} param1.toLocation
         * @param {Object} param1.node
         */
        addNode(state, { toLocation, node }) {
            const parent = fetchParentUsingLocation(state.ast, toLocation);
            const placeInParent = getLastItemInLocation(toLocation);
            node.location = toLocation;
            parent[placeInParent] = node;
        },
        /**
         * 
         * @param {Object} state
         * @param {Object} param1 
         * @param {string} param1.insertAfterLocation
         * @param {Object} param1.newNode
         */
        insertNode(state, { insertAfterLocation, newNode }) {
            const parent = fetchParentUsingLocation(state.ast, insertAfterLocation);
            const insertAfterIndex = parseInt(getLastItemInLocation(insertAfterLocation));

            // Modify location properties before splicing in new element
            for (let i = insertAfterIndex + 1; i < parent.length; i += 1) {
                const node = parent[i];
                node.location = node.location.replace(/\..*$/, `.${i + 1}`);
            }

            // Add new node into the tree
            const parentLocation = insertAfterLocation.replace(/^(.*)\..*$/, "$1");
            newNode.location = `${parentLocation}.${insertAfterIndex + 1}`;
            parent.splice(insertAfterIndex + 1, 0, newNode);
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