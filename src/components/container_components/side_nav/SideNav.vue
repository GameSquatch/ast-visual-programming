<script setup>
import FlowObjectSource from './FlowObjectSource.vue';
import UtilityObject from '../../utilities/UtilityObject.vue';

const doActionData = {
    prop1: "hello",
    type: "ExpressionStatement"
};

const stringUtilData = {
    type: "CallExpression",
    callee: {
        type: "MemberExpression",
        object: {
            type: "Identifier",
            name: "StringUtil"
        },
        property: {
            type: "Identifier",
            name: "concat"
        }
    },
    arguments: []
}
</script>
<template>
    <div class="side-nav-wrapper">
        <div class="project-structure-pane">
            <FlowObjectSource :dragData="doActionData">Drag Me Tester</FlowObjectSource>
        </div>

        <div class="utility-pane">
            <UtilityObject :dragData="stringUtilData">String Util</UtilityObject>
        </div>
    </div>
    
</template>

<style scoped>
.side-nav-wrapper {
    width: 33%;
    max-width: 500px;
    height: 100%;
    background: #ddd;
    display: flex;
    flex-direction: column;
}

.project-structure-pane {
    flex: 1;
}

.utility-pane {
    min-height: 200px;
    overflow: auto;
    border-top: 2px solid #888;
}
</style>