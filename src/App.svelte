<script>
    import RootPage from './pages/RootPage.svelte';
    import RunPage from './pages/RunPage.svelte';
    import ChatPage from './pages/ChatPage.svelte';
    import { routes } from './store/routes.js';

    window.onpopstate = (_) => {
        const { pathname } = window.location;
        $routes = pathname.replace(/\/$/, '');
    };
    
    const pathname = window.location.pathname.replace(/\/$/, '');

    switch (pathname) {
        case '/app':
        case '/app/run':
        case '/app/chat':
            $routes = pathname;
            break;
        default:
            $routes = '/app';
            break;
    }
</script>


{#if $routes === '/app'}
    <RootPage />
{:else if $routes === '/app/run'}
    <RunPage />
{:else if $routes === '/app/chat'}
    <ChatPage />
{:else}
    <RootPage />
{/if}

