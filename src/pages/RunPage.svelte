<script>
    import { routes } from '../store/routes.js';
</script>

<div class="run-header">
    <h1>Run Page</h1>
    <button on:click={(_) => $routes = '/'}>Flow</button>
</div>

<style>
    .run-header {
        display: flex;
        justify-content: space-between;
    }
</style>