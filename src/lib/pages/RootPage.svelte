<script>
    import SideNav from '../components/side_nav/SideNav.svelte';
    import Header from '../components/Header.svelte';
    import TabbedEditor from '../components/tabbed_editor/TabbedEditor.svelte';
    import { contextMenuStore } from '../store/context_menu_store.js';
    import { fileMetadata } from '../components/side_nav/file_metadata.js';
    import { fileTreeStore } from '../components/side_nav/file_tree.js';
    import LoadingPage from './LoadingPage.svelte';
    // import { fileDataStore } from '../lib/js/file_data_store';
	// import { astMutators } from '../lib/js/ast_mutation_functions.js';
	// import { onMount, onDestroy } from 'svelte';
	// import { socketStore } from '../store/socket_store.js';
    // import { get } from 'svelte/store';

	// let socket;

    // onMount(() => {
	//  socket = socketStore.startConnection();

	// 	socket.on('mutate', ({ mutation, paramsObj }) => {
    //         const mutationResult = astMutators[mutation]({ treeRef: get(fileDataStore), ...paramsObj });
    //         if (mutationResult === null) return;
    //         fileDataStore.update((_) => mutationResult);
	// 	});
    // });

    // onDestroy(() => {
	// 	socketStore.disconnect();
    // });

    $: style = $contextMenuStore.showing ? `display:inline-block;top:${$contextMenuStore.y}px;left:${$contextMenuStore.x}px` : '';

    function hideDefocused() {
        contextMenuStore.update((state) => {
            state.showing = false;
            return state;
        });
    }

    const fileMetadataFetch = fetch('/api/file-metadata').then((data) => data.json());
    // const fileTreeFetch = fetch('/api/file-tree').then((data) => data.json());
    const loadAll = Promise.all([
        fileMetadataFetch,
        new Promise((res) => setTimeout(res, 2000)),
        // fileTreeFetch
    ]).then((data) => {
        // $fileMetadata = data[0];
        // $fileTreeStore = data[1];
    });
</script>

{#await loadAll}
    <LoadingPage />
{:then}
    <div on:click={hideDefocused} id="root">
        <Header />
        <SideNav />
        <TabbedEditor />

        <!-- {#if $contextMenuStore.showing} -->
        <div class="context-menu" style="{style}">
            {#each $contextMenuStore.menuItems as menuItemData, i (i)}
                <div on:click={menuItemData.onSelected} class="menu-item">{menuItemData.title}</div>
            {/each}
        </div>
        <!-- {/if} -->
    </div>
{/await}



<style>
    #root {
        position: relative;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-areas:
            'head head head'
            'nav main main'
            'foot foot foot';
        grid-template-rows: auto 1fr 25px;
        grid-template-columns: minmax(24%, 425px) 1fr 1fr;
        z-index: 0;
    }



    .context-menu {
        position: absolute;
        background: black;
        color: white;
        min-width: 300px;
        display: none;
        z-index: 5;
    }
    .menu-item {
        padding: 5px;
        cursor: pointer;
    }
    .menu-item:hover {
        background: white;
        color: black;
    }
</style>
