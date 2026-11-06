<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { generateMetroSvg } from "../mapCreator/main";
import { useSessionStore } from "../stores/session";

const session = useSessionStore();

const props = withDefaults(defineProps<{ endedSession?: boolean }>(), {
  endedSession: false,
});

const svgData = computed(() => {
  if (!session.session) return null;

  return generateMetroSvg(session.session.metro, {
    revealedStationIds: new Set(
      session.session.guessedStations.map((s) => s.id)
    ),
    endedSession: props.endedSession,
  });
});

const viewport = ref<HTMLElement | null>(null);
const fitZoom = ref(1);
const userZoom = ref(1);

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

const actualZoom = computed(() => fitZoom.value * userZoom.value);

function updateFitZoom() {
  if (!viewport.value || !svgData.value) return;

  const { clientWidth, clientHeight } = viewport.value;

  fitZoom.value = Math.max(
    clientWidth / svgData.value.width,
    clientHeight / svgData.value.height
  );
}

let resizeObserver: ResizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(updateFitZoom);
  resizeObserver.observe(viewport.value!);
  updateFitZoom();
});

onUnmounted(() => resizeObserver.disconnect());

// Desktop zoom
function handleWheel(event: WheelEvent) {
  if (!event.ctrlKey && !event.metaKey) return;

  event.preventDefault();

  const factor = Math.exp(-event.deltaY * 0.01);

  userZoom.value = Math.min(
    MAX_ZOOM,
    Math.max(MIN_ZOOM, userZoom.value * factor)
  );
}

// Mobile pinch zoom
let pinchStartDistance = 0;
let pinchStartZoom = 1;

function getTouchDistance(touches: TouchList) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length !== 2) return;

  pinchStartDistance = getTouchDistance(event.touches);
  pinchStartZoom = userZoom.value;
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length !== 2) return;

  event.preventDefault();

  userZoom.value = Math.min(
    MAX_ZOOM,
    Math.max(
      MIN_ZOOM,
      (pinchStartZoom * getTouchDistance(event.touches)) / pinchStartDistance
    )
  );
}

function handleTouchEnd(event: TouchEvent) {
  if (event.touches.length < 2) pinchStartDistance = 0;
}
</script>

<template>
  <div
    ref="viewport"
    class="mapViewport"
    @wheel="handleWheel"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div
      v-if="svgData"
      class="metro-map"
      :style="{
        width: `${svgData.width}px`,
        height: `${svgData.height}px`,
        zoom: actualZoom,
      }"
      v-html="svgData.svg"
    />
  </div>
</template>

<style scoped>
.mapViewport {
  width: 100%;
  height: 70dvh;
  min-height: 280px;
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  border: 2px solid var(--color-brown);
  touch-action: pan-x pan-y;
}

.metro-map {
  background: white;
}

.metro-map :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
