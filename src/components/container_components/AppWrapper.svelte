<script>
    import SideNav from './side_nav/SideNav.svelte';
    import FlowController from './FlowController.svelte';
</script>
    
<div class="content-wrapper">
    <SideNav />
    <FlowController />
</div>
    
<style>
    .content-wrapper {
        flex: 1;
        display: flex;
        height: 100%;
        overflow: hidden;
    }
</style>