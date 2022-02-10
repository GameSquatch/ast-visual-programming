import { writable } from 'svelte/store';
import mockData from '../data_json.js';

const ast = writable(
    mockData
);

export default ast;