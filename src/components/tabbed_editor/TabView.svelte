<script>
	import Flow from '../container_components/Flow.svelte';
	import FunctionInfoTab from '../FunctionInfoTab.svelte';

	export let tabViewData;
</script>

<FunctionInfoTab bind:info={tabViewData.info} />
<Flow flowData={tabViewData} />