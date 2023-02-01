import { writable } from 'svelte/store';

/**
 * @callback ContextDoneCallback
 * @param {string} fileName
 * @param {string} fileType
 */
/**
 * @typedef {Object} NavState
 * @property {boolean} isShowingContext
 * @property {boolean} utilDrawerIsOpen
 * @property {string|null} contextType
 * @property {ContextDoneCallback} onDoneCallback
 */



/** @type {NavState} */
const initialVal = {
    isShowingContext: false,
    utilDrawerIsOpen: false,
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
        this.update((state) => {
            state.isShowingContext = false;
            return state;
        });
    },
    toggleUtilDrawer() {
        this.update((state) => {
            state.utilDrawerIsOpen = !state.utilDrawerIsOpen;
            return state;
        });
    }
};

export { navStore };