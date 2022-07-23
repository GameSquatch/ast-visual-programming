<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/mono-icons@latest/iconfont/icons.css" />
</svelte:head>

<script>
    import RootPage from './pages/RootPage.svelte';
    import RunPage from './pages/RunPage.svelte';
    import { routes } from './store/routes.js';
</script>


{#if $routes === '/'}
    <RootPage />
{:else if $routes == '/run'}
    <RunPage />
{:else}
    <RootPage />
{/if}

