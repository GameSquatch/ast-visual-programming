<script>
    import SideNav from '../components/side_nav/SideNav.svelte';
    import Header from '../components/Header.svelte';
    import TabbedEditor from '../components/tabbed_editor/TabbedEditor.svelte';
</script>

<div id="root">
    <Header />
    <div class="w100 content-wrapper">
        <SideNav />
        
        <div class="flex-1">
            <TabbedEditor />
        </div>
    </div>
</div>

    
<style>
    #root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .content-wrapper {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
</style>