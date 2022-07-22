import { writable } from 'svelte/store';

/**
 * @typedef {Object} NavState
 * @property {boolean} isShowingContext
 * @property {string|null} contextType
 * @property {() => void} onDoneCallback
 */

const { subscribe, set, update } = writable({
    isShowingContext: false,
    contextType: null,
    onDoneCallback: null
});

const navStore = {
    subscribe,
    set,
    update,
    toggleContext(type, onDoneCallback) {
        type = type || null;
        onDoneCallback = onDoneCallback || null;
        update((state) => {
            state.contextType = type;
            state.isShowingContext = !state.isShowingContext;
            state.onDoneCallback = onDoneCallback;
            return state;
        });
    }
};

export { navStore };