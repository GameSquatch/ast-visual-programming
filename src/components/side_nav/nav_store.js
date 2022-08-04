import { writable } from 'svelte/store';

/**
 * @callback ContextDoneCallback
 * @param {string} fileName
 * @param {string} fileType
 */
/**
 * @typedef {Object} NavState
 * @property {boolean} isShowingContext
 * @property {string|null} contextType
 * @property {ContextDoneCallback} onDoneCallback
 */



/** @type {NavState} */
const initialVal = {
    isShowingContext: false,
    contextType: null,
    onDoneCallback: (_, __) => {}
};

const { subscribe, set, update } = writable({ ...initialVal });

const navStore = {
    subscribe,
    set,
    update,
    /**
     * @function
     * @param {Object} contextType
     * @param {ContextDoneCallback} onDoneCallback
     */
    showContext(contextType, onDoneCallback) {
        this.update((state) => {
            if (!state.isShowingContext) {
                state.isShowingContext = true;
            }
            state.contextType = contextType;
            state.onDoneCallback = onDoneCallback;
            return state;
        });
    },
    closeContext() {
        this.set({ ...initialVal });
    }
};

export { navStore };