<script>
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { variableDrag } from '../drag_types.js';

    export let info;

    let isDisplaying = false;
    let reShowTimer = null;

    function tabToggle(event) {
        isDisplaying = !isDisplaying;
    }

    /**
     * @param {DragEvent} event
     */
    const dragStart = (variableDragged) => (event) => {
        const dragData = variableDrag(variableDragged);
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        isDisplaying = false;
        // Will auto-drop the menu after you've dropped a variable or parameter
        // document.addEventListener('drop', functionInfoDrop, true);
    };

    function functionInfoDrop(event) {
        isDisplaying = true;
        document.removeEventListener('drop', functionInfoDrop, true);
        reShowTimer = setTimeout(tabToggle, 1200);
    }

    function addVariable(event) {
        info.variables = [...info.variables, {
            "name": "newVar",
            "type": "String",
            "value": ""
        }];
    }

    function addParameter(event) {
        info.parameters = [...info.parameters, {
            "name": "newParam",
            "type": "String"
        }];
    }

    function stopTimer(event) {
        if (reShowTimer) {
            clearTimeout(reShowTimer);
            reShowTimer = null;
        }
    }
</script>

<div on:mouseenter={stopTimer} class="absolute w100 tab-floater">
    {#if isDisplaying}
    <div transition:slide="{{ duration: 300, easing: quintOut }}" class="flex tab-content">
        <div class="flex-1 var-section">
            <h4>Variables</h4>
            <div class="flex w100 space-between var-container">
                <div class="flex-1">Name</div>
                <div class="flex-1">Type</div>
                <div class="flex-1">Default Value</div>
            </div>

            {#each info.variables as variable, i}
                <div on:dragstart={dragStart(variable)} class="flex w100 space-between var-container">
                    <div class="var-name flex-1" draggable="true">{variable.name}: </div>
                    <div class="flex-1"><select value="{variable.type}"><option value="String">String</option><option value="Integer">Integer</option></select></div>
                    <div class="flex-1"><input type="text" bind:value="{variable.value}"></div>
                </div>
            {/each}
            <div class="add-var-btn">
                <button on:click={addVariable}>Add Variable</button>
            </div>
        </div>
        <div class="flex-1 param-section">
            <h4>Parameters</h4>
            {#each info.parameters as parameter, i}
            <div draggable="true" on:dragstart={dragStart} class="flex w100 space-between var-container">
                <span>{parameter.name}: </span>
                <select value="{parameter.type}"><option value="String">String</option><option value="Integer">Integer</option></select>
            </div>
            {/each}
            <div class="add-var-btn">
                <button on:click={addParameter}>Add Variable</button>
            </div>
        </div>
    </div>
    {/if}


    <div class="flex justify-center">
        <div class:isDisplaying class="tab-toggle" on:click={tabToggle}>Function Info</div>
    </div>
</div>


<style>
    .tab-floater {
        --function-info-bg: #444;
        z-index: 2;
        left: 0;
        top: 0;
    }

    .tab-toggle {
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        display: inline-block;
        padding: 4px 10px;
        border-right: 2px solid black;
        border-bottom: 2px solid black;
        border-left: 2px solid black;
        border-radius: 0 0 10px 10px;
        cursor: pointer;
        z-index: 4;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
    }
    .tab-toggle.isDisplaying {
        background: #555;
        color: white;
    }

    .tab-content {
        height: 200px;
        overflow: auto;
        background: var(--function-info-bg);
        color: white;
        box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.45);
        z-index: 3;
    }
    .tab-content > div {
        padding: 12px;
    }

    .var-name {
        user-select: none;
        -webkit-user-select: none;
        cursor: move;
        background: var(--function-info-bg)
    }
</style>