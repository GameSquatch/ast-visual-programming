import { writable } from 'svelte/store';

/**
 * @typedef {Object} NavState
 * @property {boolean} isShowingContext
 * @property {string|null} contextType
 * @property {((fileName: string, fileType: string) => void)|null} onDoneCallback
 */

/** @type {NavState} */
const initialVal = {
    isShowingContext: false,
    contextType: null,
    onDoneCallback: () => {}
};

const { subscribe, set, update } = writable(initialVal);

const navStore = {
    subscribe,
    set,
    update,
    /** @type {(type?: Object, onDoneCallback?: (fileName: string, fileType: string) => void) => void} */
    toggleContext(type, onDoneCallback) {
        type = type || null;
        const defaultOnDoneCallback = onDoneCallback ?? null;
        update((state) => {
            state.contextType = type;
            state.isShowingContext = !state.isShowingContext;
            state.onDoneCallback = defaultOnDoneCallback;
            return state;
        });
    }
};

export { navStore };