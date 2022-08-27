<script>
    import SideNav from '../components/side_nav/SideNav.svelte';
    import Header from '../components/Header.svelte';
    import TabbedEditor from '../components/tabbed_editor/TabbedEditor.svelte';
    import { contextMenuStore } from '../store/context_menu_store.js';

    $: style = $contextMenuStore.showing ? `display:inline-block;top:${$contextMenuStore.y}px;left:${$contextMenuStore.x}px` : '';

    function hideDefocused() {
        contextMenuStore.update((state) => {
            state.showing = false;
            return state;
        });
    }
</script>

<div on:click={hideDefocused} id="root">
    <Header />
    <SideNav />
    <TabbedEditor />

    <div class="context-menu" style="{style}">
        {#each $contextMenuStore.menuItems as menuItemData, i (i)}
            <div on:click={menuItemData.onSelected} class="menu-item">{menuItemData.title}</div>
        {/each}
    </div>
</div>

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
