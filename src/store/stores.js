import { writable } from 'svelte/store';
import mockData from '../lib/js/data_json.js';

const openFunction = writable("abc");

let ast;
openFunction.subscribe((functionId) => {
    if (!ast) {
        ast = writable(mockData[functionId])
    }
    
    ast.set(mockData[functionId]);
});

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