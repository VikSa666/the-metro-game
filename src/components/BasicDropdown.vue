<script lang="ts" setup>
const chosenOption = defineModel<string>({ required: true });
const props = defineProps<{ availableOptions: Array<string>; label: string }>();
</script>

<template>
  <div class="retro-dropdown">
    <label for="option">{{ label }}</label>
    <select id="option" v-model="chosenOption">
      <option v-for="option in props.availableOptions" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.retro-dropdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
  font-family: monospace;
  color: #29251b;
}

.retro-dropdown label {
  font-size: 12px;
  font-weight: bold;
}

.retro-dropdown select {
  appearance: none;
  width: 100%;
  padding: 12px;
  padding-right: 36px;
  border: var(--retro-border);
  border-radius: 0;
  background-color: var(--color-yellow);
  color: var(--color-ink);
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  box-shadow: var(--retro-shadow);

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M0 0h12L6 8z' fill='%2329251b'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.retro-dropdown select:hover {
  background-color: var(--color-yellow-hover);
}

.retro-dropdown select:focus-visible {
  outline: 3px dashed #29251b;
  outline-offset: 6px;
}

.retro-dropdown option {
  background: #e8c547;
  color: #29251b;
}
</style>
