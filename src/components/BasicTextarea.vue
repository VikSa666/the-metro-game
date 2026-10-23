<script lang="ts" setup>
const text = defineModel<string>();
</script>

<template>
  <input type="text" v-model="text" />
</template>

<style scoped>
input {
  box-sizing: border-box;
  resize: vertical;
  min-width: 200px;

  background: transparent;
  color: var(--color-ink);
  border: var(--retro-border);
  border-radius: 0;
  padding: 6px 8px;

  font-size: 14px;
  font-weight: bold;
  line-height: 1.4;

  box-shadow: var(--retro-shadow);
  transition: transform 0.05s, box-shadow 0.05s;
}

input:hover {
  background: var(--color-yellow-hover);
}

input:focus-visible {
  outline: 2px dotted #29251b;
  outline-offset: -5px;
}

input:disabled {
  background: transparent;
  color: grey;
  text-shadow: 1px 1px 0 white;
  cursor: not-allowed;
}

input:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #29251b;
}
</style>
