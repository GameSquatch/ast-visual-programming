<script setup>
import commonProps from '../../common_ast_props';
import MemberExpression from './MemberExpression.vue';
import Identifier from './Identifier.vue';
import StringLiteral from './StringLiteral.vue';
import UtilityDefinitions from '../../utility_definitions.js';
import { useStore } from 'vuex';
import { computed, onUpdated } from 'vue';

const props = defineProps({
    ...commonProps,
    callee: Object,
    arguments: Array
});

const parent = computed(() => props.parentRef);
const currentRef = computed(() => parent.value[props.accessor]);

let defArgNumber = () => UtilityDefinitions[currentRef.value.callee.object.name][currentRef.value.callee.property.name].args;

let isEmptyCall = () => {
    if (props.callee.type == "MemberExpression") {
        if (props.arguments.length == 0) {
            return true;
        }
    }
    return false;
};

const store = useStore();
const onMethodChange = (payloadObj) => {
    // TODO: commit change to the store using the parentRef from here
    store.commit('changeMethod', { refObj: parent.value, accessor: props.accessor, ...payloadObj });
};

//onUpdated(() => console.log(`updated ${defArgNumber()} ${currentRef.value.callee.property.name}`));
</script>

<template>
    <p style="padding-left: 10px">
        <span>
            <component @change-method="onMethodChange" is-callee :accessor="'callee'" :parent-ref="parent[accessor]" :is="callee.type" v-bind="callee"></component>
            (
                <div class="arg-box" v-if="!isEmptyCall()" v-for="(argument, i) of arguments">
                    <component :accessor="i.toString()" :parent-ref="arguments" :is="argument.type" v-bind="argument" is-argument></component>
                </div>
                <div class="arg-box" v-if="isEmptyCall()" v-for="i in defArgNumber()" >
                    <StringLiteral :accessor="i.toString()" :parent-ref="arguments" :type="'StringLiteral'" :value="''" is-argument />
                </div>
            )
        </span>
    </p>
</template>

<script>
export default {
    name: "CallExpression",
    components: {
        MemberExpression,
        Identifier,
        StringLiteral
    }
};
</script>

<style scoped>
.arg-box {
    margin-left: 10px;
    padding: 2px;
    border: 1px solid black;
}
</style>