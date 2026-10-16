<script lang="ts" setup>
import { computed } from "vue";
import { generateMetroSvg } from "../mapCreator/main";
import { useSessionStore } from "../stores/session";

const session = useSessionStore();

const svg = computed(() => {
  if (session.session)
    return generateMetroSvg(session.session.metro, {
      revealedStationIds: new Set(
        session.session.guessedStations.map((s) => s.id)
      ),
    });
});
</script>

<template>
  <div class="metro-map" v-html="svg" />
</template>

<style scoped>
.metro-map {
  width: 100%;
  height: 600px;
}
</style>
