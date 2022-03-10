import { writable } from 'svelte/store';
import mockData from '../data_json.js';

const ast = writable(
    mockData
);

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

export default ast;