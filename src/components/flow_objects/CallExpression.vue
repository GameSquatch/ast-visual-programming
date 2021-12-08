<script setup>
import commonProps from '../../common_ast_props';
import MemberExpression from './MemberExpression.vue';
import Identifier from './Identifier.vue';
import StringLiteral from './StringLiteral.vue';
import UtilityDefinitions from '../../utility_definitions.js';

const props = defineProps({
    ...commonProps,
    callee: Object,
    arguments: Array
});

let isEmptyCall = false;
if (props.callee.type == "MemberExpression") {
    if (props.arguments.length == 0) {
        isEmptyCall = true;
    }
}
const iter = 2;
</script>

<template>
    <p style="padding-left: 10px">
        <span>
            <component :is-callee="true" :accessor="'callee'" :parent-ref="parentRef[accessor]" :is="callee.type" v-bind="callee"></component>
            (
                <div class="arg-box" v-if="arguments.length > 0" v-for="(argument, i) of arguments">
                    <component :accessor="i.toString()" :parent-ref="arguments" :is="argument.type" v-bind="argument" :is-argument="true"></component>
                </div>
                <div class="arg-box" v-if="isEmptyCall" v-for="i in UtilityDefinitions[callee.object.name][callee.property.name].args" >
                    <StringLiteral :accessor="i.toString()" :parent-ref="arguments" :type="'StringLiteral'" :value="''" :is-argument="true" />
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