<script setup>
import commonProps from '../../common_ast_props';
import MemberExpression from './MemberExpression.vue';
import Identifier from './Identifier.vue';
import StringLiteral from './StringLiteral.vue';

const props = defineProps({
    ...commonProps,
    callee: Object,
    arguments: Array
});
</script>

<template>
    <p style="padding-left: 10px">
        <span>
            <component :accessor="'callee'" :parent-ref="parentRef[accessor]" :is="callee.type" v-bind="callee"></component>
            (
                <div class="arg-box" v-for="(argument, i) of arguments">
                    <!-- <input v-if="argument.type == 'StringLiteral'" :value="argument.value" /> -->
                    <component :accessor="i.toString()" :parent-ref="arguments" :is="argument.type" v-bind="argument" :is-argument="true"></component>
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