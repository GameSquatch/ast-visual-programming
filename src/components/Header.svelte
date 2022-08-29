<script>
    import { routes } from '../store/routes.js';

    const headerText = "Z-Flow";

    function logout() {
        fetch('/app/logout', {
            method: 'POST'
        })
            .finally(() => {
                window.location.reload();
            });
    }

    function handleRouteClick(route) {
        return (_) => {
            history.pushState({}, '', route);
            $routes = route;
        };
    }
</script>

<div class="header">
    <h3>{headerText}</h3>
    <div class="flex header-actions">
        <!-- <button class="light-bg-btn" on:click={handleRouteClick('/app/run')}>Run</button> -->
        <button class="light-bg-btn" on:click={handleRouteClick('/app/chat')}>Chat</button>
        <button class="light-bg-btn" on:click={(_) => logout()}>Log Out</button>
    </div>
</div>

<style>
    .header {
        grid-area: head;
        display: flex;
        justify-content: space-between;
        align-items: center;
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