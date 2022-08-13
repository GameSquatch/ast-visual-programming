<script>
    import Flow from '../Flow.svelte';
    import FunctionInfoTab from '../FunctionInfoTab.svelte';
	import QuickAccessDraggables from '../QuickAccessDraggables.svelte';

    export let tabViewData;
</script>

<FunctionInfoTab bind:info={tabViewData.info} />
<QuickAccessDraggables functionInfo={tabViewData.info} />
<Flow flowData={tabViewData} />
