<script>
	import { editorStore } from './editor_store.js';
	
	export let tabData;
</script>

<div class="tabs-wrapper">
	<div class="tabs-flex">
		{#each tabData as tab, i (tab.id)}
		<div on:click={(_) => editorStore.openTab({ id: tab.id })} class="tab {tab.fileType}" class:active={$editorStore.activeTab === tab.id}>
			<span>{tab.title}</span>
			<div style="width: 18px"></div>
			<span class="close-x" on:click={(_) => editorStore.closeTab(tab.id, i)}><i class="mi-close" /></span>
		</div>
		{/each}
	</div>
</div>

<style>
	.tabs-wrapper {
		background: #ccc;
	}
	
	.tabs-flex {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
	
	.tab {
		padding: 6px;
		min-width: 90px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #ccc;
		color: black;
		cursor: pointer;
		border: 2px solid #c8c8c8;
	}
	.tab.function {
		border-bottom: 4px solid var(--function-color);
	}
	
	.tab.active {
		color: black;
		background: #b8b8b8;
	}
	.tab:hover .close-x {
		visibility: visible;
	}
	
	.close-x {
		font-size: 10pt;
		padding: 0 2px;
		border-radius: 4px;
		display: inline-block;
		visibility: hidden;
	}
	.close-x:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>