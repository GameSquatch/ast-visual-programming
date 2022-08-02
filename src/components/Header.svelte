<script>
    import { routes } from '../store/routes.js';

    const headerText = "Z-Flow";

    function logout() {
        fetch('/logout', {
            method: 'POST'
        })
            .finally(() => {
                window.location.reload();
            });
    }
</script>

<div class="header">
    <h1>{headerText}</h1>
    <div class="flex">
        <button on:click={(_) => $routes = '/run'}>Run</button>
        <button on:click={(_) => logout()}>Log Out</button>
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
    }
</style>