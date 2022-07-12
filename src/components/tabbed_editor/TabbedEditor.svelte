<script>
	import { editorStore } from './editor_store.js';
	import TabBar from './TabBar.svelte';
	import TabView from './TabView.svelte';
	
	$: dataPromise = $editorStore.tabs.filter((tab) => tab.id === $editorStore.activeTab)[0]?.dataPromise;
</script>

<div class="editor-wrapper">
	<div>
		<TabBar tabData={$editorStore.tabs} />
	</div>
	<div class="tab-view-wrapper">
		{#if dataPromise}
			{#await dataPromise}
			<p>
				...loading
			</p>
			{:then tabViewData}
			<TabView {tabViewData} />
			{/await}
		{:else}
		<p>
			No data yet available; open a tab to view
		</p>
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.tab-view-wrapper {
		flex: 1;
		padding: 12px;
		overflow: hidden;
		z-index: 0;
		position: relative;
		background: #eee;
	}
</style>