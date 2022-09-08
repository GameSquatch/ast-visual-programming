import { writable } from 'svelte/store';


/**
 * @typedef {object} EditorState
 * @property {string} activeTab
 * @property {Object.<string, boolean>} openedTabIds
 * @property {string[]} tabs
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
		 * @function
		 * @param {Object} spec
		 * @param {string} spec.fileId 
		 * @param {string} [spec.title]
		 * @param {string} [spec.fileType]
		 */
		openTab({ fileId }) {
			update((editor) => {
				editor.activeTab = fileId;
				if (!editor.openedTabIds[fileId]) {
					editor.tabs.push(fileId);
					editor.openedTabIds[fileId] = true;
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
					editor.activeTab = editor.tabs[0];
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


export { editorStore };