<script>
    import SideNav from './components/container_components/side_nav/SideNav.svelte';
    import FlowController from './components/container_components/FlowController.svelte';
    import Header from './components/Header.svelte';
    import TabbedEditor from './components/tabbed_editor/TabbedEditor.svelte';
</script>

<Header />
<div class="w100 content-wrapper">
    <SideNav />
    <!-- <FlowController /> -->
    <TabbedEditor />
</div>
    
<style>
    .content-wrapper {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
</style>