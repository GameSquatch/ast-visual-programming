<script setup>
import FlowObjectSource from './FlowObjectSource.vue';

const doActionData = {
    prop1: "hello",
    type: "ExpressionStatement"
};
</script>
<template>
    <div class="side-nav-wrapper">
        <FlowObjectSource :dragData="doActionData">Do Action</FlowObjectSource>
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