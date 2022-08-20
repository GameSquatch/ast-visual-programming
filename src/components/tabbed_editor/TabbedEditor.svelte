<script>
	import { editorStore } from './editor_store.js';
	import { mockData } from '../../lib/js/data_json.js';
	import TabBar from './TabBar.svelte';
	import TabView from './TabView.svelte';
	
	//$: dataPromise = $editorStore.tabs.filter((tab) => tab.id === $editorStore.activeTab)[0]?.dataPromise;
	let dataPromise = Promise.resolve("haha");
</script>

<div class="editor-wrapper">
	<div>
		<TabBar tabData={$editorStore.tabs} />
	</div>
	<div class="tab-view-wrapper">
		{#if $editorStore.activeTab !== ''}
			{#await dataPromise}
			<p>
				...loading
			</p>
			{:then prom}
			<TabView tabViewData={$mockData[$editorStore.activeTab]} />
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