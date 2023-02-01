<script>
    export let treeLevel;
</script>

{#each new Array(treeLevel) as _, i}
    <div class="nest-pad" style="transition-delay:{i * 0.18}s"></div>
{/each}

<style>
    .nest-pad {
        display: inline-block;
        margin-left: 6px;
        width: 9px;
        height: 100%;
        border-left: 1px solid transparent;
        transition: border-color 0.2s ease-out;
    }
</style>