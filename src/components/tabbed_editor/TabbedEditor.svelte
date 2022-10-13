<script>
	import { editorStore } from './editor_store.js';
	import { fileDataStore } from '../../lib/js/file_data_store.js';
	import { astMutators } from '../../lib/js/ast_mutation_functions.js';
	import TabBar from './TabBar.svelte';
	import TabView from './TabView.svelte';
	import { onMount, onDestroy } from 'svelte';
    import { connectToChat } from '../../../server/socket/chat_sock.js';

	let socket;

    onMount(() => {
        socket = connectToChat();

		socket.on('mutate', ({ mutation, paramsObj }) => {
			fileDataStore.update((fileData) => {
				return astMutators[mutation]({ treeRef: fileData, ...paramsObj });
			})
		});
    });

    onDestroy(() => {
        socket?.disconnect();
    });
</script>

<div class="editor-wrapper">
	<div>
		<TabBar tabFileIds={[ ...$editorStore.openedTabIds ]} />
	</div>
	<div class="tab-view-wrapper">
		{#if $editorStore.activeTab !== ''}
			{#await $editorStore.tabs[$editorStore.activeTab].data}
			<p>
				...loading
			</p>
			{:then}
				<TabView tabViewData={$fileDataStore[$editorStore.activeTab]} />
			{/await}
		{:else}
		<p>
			Nothing to see here - open a file to start working!
		</p>
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		grid-area: main;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.tab-view-wrapper {
		flex: 1;
		padding: 12px;
		overflow: hidden;
		z-index: 0;
		position: relative;
		background: #ddd;
	}
</style>