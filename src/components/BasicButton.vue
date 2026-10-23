<script lang="ts" setup>
type Variant = "basic" | "alert" | "success" | "alt";
const props = withDefaults(
  defineProps<{
    variant?: Variant;
  }>(),
  {
    variant: "basic",
  }
);

function computeVariant(): string {
  switch (props.variant) {
    case "basic":
      return "win-button-basic";
    case "alert":
      return "win-button-alert";
    case "alt":
      return "win-button-alt";
    case "success":
      return "win-button-success";
    default:
      return "win-button-basic";
  }
}
</script>

<template>
  <button :class="['win-button', computeVariant()]"><slot /></button>
</template>

<style scoped>
/*
Source - https://stackoverflow.com/a/4375548
Posted by mingos, modified by community. See post 'Timeline' for change history
Retrieved 2026-10-16, License - CC BY-SA 3.0
*/

/*
Source - https://stackoverflow.com/a/4375548
Posted by mingos, modified by community. See post 'Timeline' for change history
Retrieved 2026-10-16, License - CC BY-SA 3.0
*/

.win-button {
  max-width: 200px;
  max-height: 38px;
  border: var(--retro-border);
  padding: 6px 8px;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--retro-shadow);
  transition: transform 0.05s, box-shadow 0.05s;
}

.win-button-basic {
  color: var(--color-ink);
  background: var(--color-yellow);
}

.win-button-basic:hover {
  color: var(--color-ink);
  background: var(--color-yellow-hover);
}

.win-button-alert {
  color: var(--color-ink-inverse);
  background: var(--color-red);
}

.win-button-alert:hover {
  color: var(--color-ink);
  background: var(--color-red-hover);
}

.win-button-success {
  color: var(--color-ink-inverse);
  background: var(--color-olive);
}

.win-button-success:hover {
  color: var(--color-ink);
  background: var(--color-olive-hover);
}

.win-button-alt {
  color: var(--color-ink-inverse);
  background: var(--color-brown);
}
.win-button-alt:hover {
  color: var(--color-ink);
  background: var(--color-brown-hover);
}

.win-button:focus {
  outline: 1px dotted black;
  outline-offset: -4px;
}

.win-button:disabled {
  background: silver;
  color: grey;
  text-shadow: 1px 1px 0 white;
  cursor: not-allowed;
}

.win-button:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #29251b;
}
</style>
