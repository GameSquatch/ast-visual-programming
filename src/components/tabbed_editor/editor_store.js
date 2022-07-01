import { writable } from 'svelte/store';
import { apiCall } from '../../services/mock_api_call.js';

function createEditorStore(initialValue) {
	const { subscribe, set, update } = writable(initialValue);
	let rollingId = 3;
	let lastOpenedTab = 2;
	
	return {
		subscribe,
		set,
		update,
		addTab(title) {
			update((editor) => {
				lastOpenedTab = editor.activeTab;
				editor.activeTab = rollingId;
				editor.tabs.push(createTab({
					id: rollingId++,
					title,
					dataPromise: apiCall()
				}));
				
				return editor;
			});
		},
		openTab(id) {
			update((editor) => {
				lastOpenedTab = editor.activeTab;
				editor.activeTab = id;
				return editor;
			})
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
				
				if (editor.tabs.length === 0) {
					editor.activeTab = 0;
					lastOpenedTab = null;
				} else if (idOfClosedTab === editor.activeTab) {
					editor.activeTab = idOfClosedTab === lastOpenedTab ? editor.tabs[0].id : lastOpenedTab;
				}
				
				return editor;
			});
		}
	};
}

function createTab({ title, id, dataPromise }) {
	return {
		title,
		id,
		dataPromise
	};
}
// const editorStore = createEditorStore({
// 	activeTab: 0,
// 	tabs: []
// });
const editorStore = createEditorStore({
	activeTab: 2,
	tabs: [
		createTab({ title: 'File.js', id: 1, dataPromise: Promise.resolve(42) }),
		createTab({ title: 'Another.java', id: 2, dataPromise: Promise.resolve(56) })
	]
});

export { editorStore };