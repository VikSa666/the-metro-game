<script lang="ts" setup></script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  margin: 24px;
  background-color: var(--color-paper);
  border: var(--retro-border);
  box-shadow: var(--retro-shadow);
}
</style>
