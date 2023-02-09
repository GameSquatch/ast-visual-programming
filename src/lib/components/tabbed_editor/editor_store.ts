import { writable } from 'svelte/store';
import { fileDataStore } from '../../lib/js/file_data_store.js';


interface EditorState {
	activeTab: string,
	openedTabIds: Set<string>,
	tabs: Record<string, TabData>
}

interface TabData {
	fileId: string,
	data: Promise<Object>
}

function createEditorStore(initialValue: EditorState) {
	const { subscribe, set, update } = writable(initialValue);
	
	return {
		subscribe,
		set,
		update,
		openTab(fileId: string) {
			update((editor) => {
				editor.activeTab = fileId;
				if (!editor.tabs[fileId]) {
					const filePromise = fetch(`/api/file/${fileId}`).then((data) => data.json());
					filePromise.then((data) => fileDataStore.setFile(data));
					editor.tabs[fileId] = {
						fileId,
						data: filePromise
					};
				}

				if (!editor.openedTabIds.has(fileId)) {
					editor.openedTabIds.add(fileId);
				}

				return editor;
			});
		},
		closeTab(id: string) {
			update((editor) => {
				editor.openedTabIds.delete(id);
				delete editor.tabs[id];
				fileDataStore.removeFile(id);
				
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