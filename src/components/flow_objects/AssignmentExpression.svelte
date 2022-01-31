<script>
    import constructors from '../../constructors.js';
    import dropDataTemplates from '../../drop_data_templates.js';
    import { createDropNodeFromContext } from '../../drag_and_drop_handlers.js';

    export let parentRef;
    export let accessor;

    $: self = parentRef[accessor];

    const handleDrop = (event) => {
        const nNode = createDropNodeFromContext('assignment', event, self.left.returns);

        parentRef[accessor].right = nNode;
    ;}
</script>

<p>Assign <strong>{self.left.name}: {self.left.returns}</strong> to</p>
<div class="assign-right-block" on:dragover={()=>{}} on:drop|stopPropagation={handleDrop}>
{#if self.right === null}
    Drag an expression here
{:else}
    <svelte:component this={constructors[self.right.type]} bind:parentRef={self} accessor={"right"} />
{/if}
</div>


<style>
    .assign-right-block {
        padding: 10px;
        border: 1px solid black;
    }
</style>