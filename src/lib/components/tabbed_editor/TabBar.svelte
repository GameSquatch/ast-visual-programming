<script lang="ts">
    import { editorStore } from './editor_store.js';
    import { fileMetadata } from '../side_nav/file_metadata.js';

    export let tabFileIds;
</script>

<div class="tabs-wrapper">
    <div class="tabs-flex">
        {#each tabFileIds as fileId, i (fileId)}
            {@const fm = $fileMetadata[fileId]}
            <div
                on:click={(_) => editorStore.openTab(fileId)}
                class="tab {fm.fileType}"
                class:active={$editorStore.activeTab === fileId}>
                <span>{fm.title}</span>
                <div style="width: 18px" />
                <span class="close-x" on:click={(_) => editorStore.closeTab(fileId)}
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </span>
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
        padding: 4px 6px;
        min-width: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ccc;
        color: #666;
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
        width: 18px;
		height: 18px;
        border-radius: 4px;
        display: inline-block;
        visibility: hidden;
    }
    .close-x:hover {
        background: rgba(255, 255, 255, 0.2);
    }
</style>
