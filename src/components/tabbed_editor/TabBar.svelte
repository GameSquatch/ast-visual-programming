<script>
	import { editorStore } from './editor_store.js';
	
	export let tabData;
	
	function addTab() {
		editorStore.addTab('I am a new tab');
	}
	
	function openTab(id) {
		editorStore.openTab(id);
	}
	
	function closeTab(id) {
		editorStore.closeTab(id);
	}
</script>

<div class="tabs-wrapper">
	<div class="tabs-flex">
		{#each tabData as tab (tab.id)}
		<div on:click={(_) => openTab(tab.id)} class="tab" class:active={$editorStore.activeTab === tab.id}>
			{tab.title}
			<span class="close-x" on:click={(_) => closeTab(tab.id)}>X</span>
		</div>
		{/each}
		<div class="tab add-tab" on:click={addTab}>
			+
		</div>
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
		background: #f8f8f8;
		color: #9e9e9e;
		cursor: pointer;
	}
	
	.tab.active {
		color: black;
		background: #f0f0f0
	}
	
	.add-tab {
		width: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
	}
	.tab:hover {
		background: #dfdfdf;
	}
	
	.close-x {
		font-size: 8pt;
		padding: 2px 4px;
		border-radius: 4px;
		display: inline-block;
	}
	.close-x:hover {
		background: red;
		color: white;
	}
</style>