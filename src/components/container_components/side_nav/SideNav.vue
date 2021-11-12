<script setup>
import FlowObjectSourceVue from './FlowObjectSource.vue';

const doActionData = {
    prop1: "hello",
    type: "ExpressionStatement"
};
</script>
<template>
    <div class="side-nav-wrapper">
        <FlowObjectSourceVue :dragData="doActionData">Do Action</FlowObjectSourceVue>
    </div>
    
</template>

<style scoped>
.side-nav-wrapper {
    width: 33%;
    max-width: 500px;
    height: 100%;
    background: #ddd;
}
</style>