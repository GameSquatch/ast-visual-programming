<script>
    import { createEventDispatcher } from 'svelte';

    export let argLevel;
    export let onClear = () => {};
    export let returnType;

    let argLevelClass = "level-1n";
    if (argLevel % 3 === 0) {
        argLevelClass = "level-3n";
    } else if (argLevel % 3 === 2) {
        argLevelClass = "level-2n";
    }

    const dispatch = createEventDispatcher();
</script>


<div class="flex wrapper">
    <p class="gt-symbol" on:click={onClear}><span class="small-text">{returnType}</span> &gt; </p>
    <div on:drop|stopPropagation={(event) => dispatch('innerDrop', event)}
        on:dragover={() => {}}
        class="flex-1  argument-container {argLevelClass}">

        <slot></slot>
    </div>
</div>


<style>
    .wrapper {
        margin-bottom: 8px;
    }

    .gt-symbol {
        padding: 4px 8px 2px 0;
        cursor: pointer;
    }

    .argument-container {
        position: relative;
        padding: 4px;
    }
    .argument-container::after {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        height: 100%;
        width: 10px;
        border-style: solid;
        border-color: black;
        --border-width: 2px;
        border-left-width: var(--border-width);
        border-top-width: var(--border-width);
        border-bottom-width: var(--border-width);
        border-right-width: 0;
    }

    .level-1n::after {
        border-color: rgb(0, 153, 173);
    }
    .level-2n::after {
        border-color: red;
    }
    .level-3n::after {
        border-color: green;
    }
</style>