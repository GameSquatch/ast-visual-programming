<script>
    import SideNav from '../components/side_nav/SideNav.svelte';
    import Header from '../components/Header.svelte';
    import TabbedEditor from '../components/tabbed_editor/TabbedEditor.svelte';
</script>

<div id="root">
    <Header />
    <SideNav />
    <TabbedEditor />
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
</style>
