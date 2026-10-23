<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { useSessionStore } from "../stores/session";
import { matchStation, type Line } from "../model";
import { formatTime } from "../helpers";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import MetroMap from "../components/MetroMap.vue";
import BasicTextarea from "../components/BasicTextarea.vue";
import BasicButton from "../components/BasicButton.vue";
import BasicDropdown from "../components/BasicDropdown.vue";

const router = useRouter();
const session = useSessionStore();

function end() {
  console.log("Session ended, redirecting to results page...");
  stopTimer();
  session.time = remaining.value ?? 0;
  router.push("/results");
}

const guess = ref("");
const matchMsg = ref("");
function guessStation() {
  if (!session.session) return;
  const matchedStation = matchStation(guess.value, session.session.metro);
  if (matchedStation) {
    if (
      session.session.guessedStations.find((s) => s.id === matchedStation.id)
    ) {
      matchMsg.value =
        "L'estació " + matchedStation.name + " ja ha estat endevinada";
      return;
    }
    matchMsg.value = "Estació endevinada! " + matchedStation.name;
    session.session.guessedStations.push(matchedStation);
    guess.value = "";
    totalPercentage.value =
      (session.session!.guessedStations.length * 100) /
      session.session!.metro.stations.length;
    console.log(totalPercentage.value);
  } else {
    matchMsg.value = "Estació inexistent...";
  }
}

const guessedByLine = computed(() => {
  if (!session.session) return;
  return session.session.metro.lines
    .map((line: Line) => {
      const stations = line.stations
        .map((id) => session.session!.guessedStations.find((s) => s.id === id))
        .filter(Boolean);
      return {
        line,
        stations,
        percentage: (stations.length / line.stations.length) * 100,
      };
    })
    .filter((line) => line.stations.length > 0);
});

const remaining = ref(session.session?.duration);

let timer: number | undefined;
let startedAt = 0;

function startTimer() {
  if (!session.session) return;
  startedAt = Date.now();

  timer = window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    remaining.value = Math.max(0, session.session!.duration - elapsed);

    if (remaining.value === 0) {
      end();
    }
  }, 100);
}

onMounted(() => startTimer());

function stopTimer() {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}

const totalPercentage = ref(0);
const scoreMode: Ref<"number" | "percentage"> = ref("number");
</script>

<template>
  <div class="wrapper" v-if="session">
    <div class="toolbar">
      <div class="wrapperTextarea">
        <div class="score guessTextarea">
          <h1>ESCRIU L'ESTACIÓ I PRESSIONA ENTER PER ENDEVINAR</h1>
          <BasicTextarea v-model="guess" @keydown.enter="guessStation" />
        </div>
        <BasicButton @click="guessStation">Endevinar</BasicButton>
      </div>
      <div class="score">
        <h1>TEMPORITZADOR</h1>
        <span>{{ formatTime(remaining) }}</span>
      </div>
      <div class="score">
        <div class="scoreLabel">
          <h1>PUNTUACIÓ</h1>
          <div class="downArrow">
            <span>▼</span>
            <select v-model="scoreMode">
              <option value="number">Número</option>
              <option value="percentage">Percentatge</option>
            </select>
          </div>
        </div>
        <span v-if="scoreMode === 'number'">
          {{ session.session!.guessedStations.length }}/{{
            session.session!.metro.stations.length
          }}
        </span>
        <span v-else>{{ Math.round(totalPercentage) }}%</span>
      </div>
      <BasicButton :variant="'alert'" @click="end">Rendir-se</BasicButton>
    </div>
    <MetroMap :metro-system="session.session?.metro"></MetroMap>
  </div>
  <p v-else="">Sessió no iniciada</p>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.toolbar {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
}

.msg {
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
}

.wrapperTextarea {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-end;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 8px;
    color: dimgrey;
  }
  span {
    font-size: 40px;
  }

  .scoreLabel {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;

    .downArrow {
      position: relative;
      display: flex;
      color: #29251b;
      justify-content: center;
      align-content: center;
      border: solid 1px #29251b;
      height: 10px;
      width: 10px;
      box-shadow: 1px 1px 0 #29251b;

      span {
        font-size: 9px;
      }

      select {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        appearance: none;
      }
    }
  }
}

.guessTextarea {
  align-items: stretch;
}
</style>
