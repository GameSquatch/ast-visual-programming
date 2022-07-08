import { writable } from 'svelte/store';
import { apiCall } from '../../services/mock_api.js';
import mockData from '../../lib/js/data_json.js';

function createEditorStore(initialValue) {
	const { subscribe, set, update } = writable(initialValue);
	
	return {
		subscribe,
		set,
		update,
		openTab(id, title) {
			update((editor) => {
				editor.activeTab = id;
				if (!editor.openedTabIds[id]) {
					editor.tabs.push({ title, id, dataPromise: Promise.resolve(mockData[id].main) });
					editor.openedTabIds[id] = true;
				}

				return editor;
			});
		},
		closeTab(id) {
			update((editor) => {
				let indexOfClosedTab = -1;
				for (let i = 0; i < editor.tabs.length; ++i) {
					if (editor.tabs[i].id === id) {
						indexOfClosedTab = i;
						break;
					}
				}
				
				const idOfClosedTab = editor.tabs[indexOfClosedTab].id;
				editor.tabs.splice(indexOfClosedTab, 1);
				delete editor.openedTabIds[id];
				
				if (editor.tabs.length === 0) {
					editor.activeTab = '';
				} else if (idOfClosedTab === editor.activeTab) {
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