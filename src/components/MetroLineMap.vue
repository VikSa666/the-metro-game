<script setup lang="ts">
import { computed } from "vue";
import { generateLineSvg } from "../mapCreator/lineMapCreator";
import { useSessionStore } from "../stores/session";

const session = useSessionStore();

const props = defineProps<{
  lineId: string;
  endedSession?: boolean;
}>();

const line = computed(() =>
  session.session?.metro.lines.find((line) => line.id === props.lineId)
);

const generatedSvg = computed(() => {
  if (!line.value || !session.session) return null;
  const stationById = new Map(
    session.session?.metro.stations.map((station) => [station.id, station])
  );
  return generateLineSvg(line.value, stationById, session.session.metro, {
    revealedStationIds: new Set(
      session.session.guessedStations.map((s) => s.id)
    ),
    endedSession: props.endedSession,
    labelAngle: 60,
  });
});
</script>

<template>
  <div v-if="generatedSvg" class="line-map">
    <div
      v-html="generatedSvg.svg"
      class="line-map-content"
      :style="{
        width: `${generatedSvg.width}px`,
        height: `${generatedSvg.height}px`,
      }"
    />
  </div>
</template>

<style scoped>
.line-map {
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 12px 0;
  box-sizing: border-box;
  background-color: white;
}

.line-map-content {
  flex-shrink: 0;
}

.line-map-content :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
}
</style>
