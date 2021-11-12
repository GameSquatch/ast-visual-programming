<script setup>
import SideNav from './side_nav/SideNav.vue';
import AppWindow from './AppWindow.vue';
</script>

<template>
    <div class="content-wrapper">
        <SideNav />
        <AppWindow />
    </div>
</template>

<style scoped>
.content-wrapper {
    flex: 1;
    display: flex;
    height: 100%;
    overflow: hidden;
}
</style>