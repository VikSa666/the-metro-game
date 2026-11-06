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
  <div class="mapViewport">
    <div class="metro-map" v-html="svg" />
  </div>
</template>

<style scoped>
.metro-map {
  width: 100%;
  border: var(--retro-border);
  box-shadow: var(--retro-shadow);
  background: white;
}

.mapViewport {
  width: 100%;
  min-width: 0;
  overflow: auto;
  border: 2px solid var(--color-brown);
}

/* Móvil */
@media (max-width: 600px) {
  .mapViewport {
    height: 55dvh;
    min-height: 280px;
    max-height: 500px;
    overflow: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .mapViewport :deep(.metro-map) {
    width: max-content;
    min-width: 0;
  }

  .mapViewport :deep(svg) {
    display: block;
    width: 1200px !important;
    height: auto !important;
    max-width: none !important;
  }
}
</style>
