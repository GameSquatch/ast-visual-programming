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
        addNode(state, { toLocation, node }) {
            const parent = fetchParentUsingLocation(state.ast, toLocation);
            const placeInParent = getLastItemInLocation(toLocation);
            parent[placeInParent] = node;
            console.log(toLocation);
        }
    }
});

function fetchParentUsingLocation(ast, location) {
    const nodePaths = location.split('.');

    let currentNode = ast.main;
    let i = 0;
    for (i; i < nodePaths.length - 1; ++i) {
        currentNode = currentNode[nodePaths[i]];
    }

    return currentNode;
}

function getLastItemInLocation(location) {
    const locations = location.split('.');
    return locations[locations.length - 1];
}

export default store;