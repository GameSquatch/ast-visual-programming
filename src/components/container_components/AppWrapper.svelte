<script>
    import SideNav from './side_nav/SideNav.svelte';
    import AppWindow from './AppWindow.svelte';
</script>
    
<div class="content-wrapper">
    <SideNav />
    <AppWindow />
</div>
    
<style>
    .content-wrapper {
        flex: 1;
        display: flex;
        height: 100%;
        overflow: hidden;
    }
</style>