<script>
    import { routes } from '../store/routes.js';

    const headerText = "Z-Flow";
</script>

<div class="header">
    <h1>{headerText}</h1>
    <button on:click={(_) => $routes = '/run'}>Run</button>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
    }
</style>