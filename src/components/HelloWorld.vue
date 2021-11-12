<script setup>

const props = defineProps({
  innerObj: Object
});

</script>

<template>
  <p>{{ JSON.stringify(innerObj) }}</p>
</template>

