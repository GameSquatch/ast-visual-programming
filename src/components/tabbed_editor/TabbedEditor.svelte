<script>
	import { editorStore } from './editor_store.js';
	import TabBar from './TabBar.svelte';
	import TabView from './TabView.svelte';
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
			{:then fileData}
				<TabView tabViewData={fileData} />
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