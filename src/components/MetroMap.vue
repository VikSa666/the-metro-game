<script lang="ts" setup>
import { computed } from "vue";
import { generateMetroSvg } from "../mapCreator/main";
import { useSessionStore } from "../stores/session";

const session = useSessionStore();

const props = withDefaults(defineProps<{ endedSession?: boolean }>(), {
  endedSession: false,
});

const svg = computed(() => {
  if (session.session)
    return generateMetroSvg(session.session.metro, {
      revealedStationIds: new Set(
        session.session.guessedStations.map((s) => s.id)
      ),
      endedSession: props.endedSession ?? false,
    });
});
</script>

<template>
  <div class="metro-map" v-html="svg" />
</template>

<style scoped>
.metro-map {
  width: 100%;
  border: var(--retro-border);
  box-shadow: var(--retro-shadow);
  background: white;
}
</style>
