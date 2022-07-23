<script>
	import { editorStore } from './editor_store.js';
	
	export let tabData;
</script>

<div class="tabs-wrapper">
	<div class="tabs-flex">
		{#each tabData as tab, i (tab.id)}
		<div on:click={(_) => editorStore.openTab(tab.id)} class="tab {tab.fileType}" class:active={$editorStore.activeTab === tab.id}>
			<span>{tab.title}</span>
			<div style="width: 18px"></div>
			<span class="close-x" on:click={(_) => editorStore.closeTab(tab.id, i)}><i class="mi-close" /></span>
		</div>
		{/each}
	</div>
</div>

<style>
	.tabs-wrapper {
		background: #fdfdfd;
	}
	
	.tabs-flex {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
	
	.tab {
		padding: 6px;
		margin: 2px;
		min-width: 90px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8f8f8;
		color: #9e9e9e;
		cursor: pointer;
		border-bottom: 4px solid black;
	}
	.tab.function {
		border-color: var(--function-color);
	}
	
	.tab.active {
		color: black;
		background: #f0f0f0
	}
	.tab:hover {
		background: #dfdfdf;
	}
	
	.close-x {
		font-size: 10pt;
		padding: 2px 4px;
		border-radius: 4px;
		display: inline-block;
	}
	.close-x:hover {
		color: red;
	}
</style>