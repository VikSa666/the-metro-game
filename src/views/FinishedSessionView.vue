<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSessionStore } from "../stores/session";
import { formatTime } from "../helpers";
import MetroMap from "../components/MetroMap.vue";
import BasicCard from "../components/BasicCard.vue";
import BasicButton from "../components/BasicButton.vue";
import MetroLineMap from "../components/MetroLineMap.vue";

const router = useRouter();
const session = useSessionStore();
function backToMenu() {
  router.push("/");
}
</script>

<template>
  <div class="main" v-if="session.session">
    <h1>S'ha acabat!</h1>
    <span>Aquests són els resultats</span>
    <BasicCard>
      <div class="results">
        <div class="resultItem">
          <span>Temps utilitzat</span>
          <span>{{ formatTime(session.session.duration - session.time) }}</span>
        </div>
        <div class="resultItem">
          <span>Estacions endevinades</span>
          <span
            >{{ session.session.guessedStations.length }}/{{
              session.session.metro.stations.length
            }}</span
          >
        </div>
        <div class="resultItem">
          <span>Percentatge total</span>
          <span>{{ Math.round(session.totalPercentage) }}%</span>
        </div>
        <BasicButton @click="backToMenu">Tornar a l'inici</BasicButton>
      </div>
    </BasicCard>
    <BasicCard>
      <div class="results">
        <MetroLineMap
          v-for="line in session.session.metro.lines"
          :line-id="line.id"
          :ended-session="true"
        />
      </div>
    </BasicCard>
    <MetroMap :metro-system="session.session?.metro" :ended-session="true" />
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.results {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 24px;
  align-items: stretch;

  .resultItem {
    display: flex;
    flex-direction: row;
    gap: 24px;
    justify-content: space-between;
  }
}
</style>
