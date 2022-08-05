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
    <div class="flex header-actions">
        <button class="light-bg-btn" on:click={(_) => $routes = '/run'}>Run</button>
        <button class="light-bg-btn" on:click={(_) => $routes = '/chat'}>Chat</button>
        <button class="light-bg-btn" on:click={(_) => logout()}>Log Out</button>
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
    }

    .header-actions {
        align-items: center;
    }

    .header-actions button {
        margin-right: 8px;
        padding: 8px;
        font-weight: bold;
        font-size: 12pt;
    }
</style>