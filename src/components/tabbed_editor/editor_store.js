import { writable } from 'svelte/store';


/**
 * @typedef {object} EditorState
 * @property {string} activeTab
 * @property {Set<string>} openedTabIds
 * @property {Object.<string, { fileId: string, data: Promise<Object> }>} tabs
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
		 * @param {string} fileId
		 */
		openTab(fileId) {
			update((editor) => {
				editor.activeTab = fileId;
				if (!editor.tabs[fileId]) {
					editor.tabs[fileId] = {
						fileId,
						data: fetch(`/api/file/${fileId}`).then((data) => data.json())
					};
				}

				if (!editor.openedTabIds.has(fileId)) {
					editor.openedTabIds.add(fileId);
				}

				return editor;
			});
		},
		/**
		 * @param {string} id
		 */
		closeTab(id) {
			update((editor) => {
				editor.openedTabIds.delete(id);
				
				if (editor.openedTabIds.size === 0) {
					editor.activeTab = '';
				} else if (id === editor.activeTab) {
					editor.activeTab = editor.tabs[editor.openedTabIds.values().next().value].fileId;
				}
				
				return editor;
			});
		}
	};
}

const editorStore = createEditorStore({
	activeTab: '',
	openedTabIds: new Set(),
	tabs: {}
});


export { editorStore };