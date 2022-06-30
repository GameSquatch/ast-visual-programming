import { writable, readable } from 'svelte/store';
import mockData from '../lib/js/data_json.js';
import { fileTree as tree } from '../components/container_components/side_nav/file_tree.js';

const openFunction = writable("abc");

let ast;
openFunction.subscribe((functionId) => {
    if (!ast) {
        ast = writable(mockData[functionId])
    }
    
    ast.set(mockData[functionId]);
});

const fileTree = readable(tree.items);

/*
// Messing with async ideas
const ast = {
    const { update, subscribe, set } = writable({});

    return {
        update,
        subscribe,
        set,
        init() async {
            const resp = await fetch('https://z-flow.com/fn/1');

            if (resp.ok) {
                const fn = await resp.json();
                set(fn);
            }
        }
    };
}
*/

export { ast, openFunction, fileTree };