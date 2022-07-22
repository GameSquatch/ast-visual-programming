import { writable } from 'svelte/store';
import { apiCall } from '../../services/mock_api.js';
import mockData from '../../lib/js/data_json.js';

/**
 * @typedef {object} EditorState
 * @property {string} activeTab
 * @property {Object.<string, boolean>} openedTabIds
 * @property {Object[]} tabs
 */

/**
 * @param {EditorState} initialValue
 */
function createEditorStore(initialValue) {
	const { subscribe, set, update } = writable(initialValue);
	
	return {
		subscribe,
		set,
		update,
		/**
		 * @param {string} id 
		 * @param {string} title 
		 * @param {string} objectType 
		 */
		openTab(id, title, objectType) {
			update((editor) => {
				editor.activeTab = id;
				if (!editor.openedTabIds[id]) {
					editor.tabs.push({ title, id, objectType, dataPromise: Promise.resolve(mockData[id].main) });
					editor.openedTabIds[id] = true;
				}

				return editor;
			});
		},
		/**
		 * @param {string} id 
		 * @param {number} index 
		 */
		closeTab(id, index) {
			update((editor) => {
				editor.tabs.splice(index, 1);
				delete editor.openedTabIds[id];
				
				if (editor.tabs.length === 0) {
					editor.activeTab = '';
				} else if (id === editor.activeTab) {
					editor.activeTab = editor.tabs[0].id;
				}
				
				return editor;
			});
		}
	};
}

const editorStore = createEditorStore({
	activeTab: '',
	openedTabIds: {},
	tabs: []
});

const currentFlowData = writable({});

export { editorStore, currentFlowData };