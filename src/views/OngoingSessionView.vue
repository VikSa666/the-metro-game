<script setup lang="ts">
import { computed, ref } from "vue";
import { useSessionStore } from "../stores/session";
import { matchStation, type Line } from "../model";
import { formatTime } from "../helpers";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

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
  console.log(matchedStation);
  if (matchedStation) {
    matchMsg.value = "Match! " + matchedStation.name;
    session.session.guessedStations.push(matchedStation);
    guess.value = "";
  } else {
    matchMsg.value = "No match...";
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
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div>
      <button @click="end">end</button>
      <input type="text" v-model="guess" @keydown.enter="guessStation" />
      <button @click="guessStation">guess</button>
    </div>
    <div>
      <div v-if="session">
        <p>{{ formatTime(remaining) }}</p>
        <p>{{ matchMsg }}</p>
        <div v-for="item in guessedByLine" :key="item.line.id">
          <strong
            >{{ item.line.name }} ({{ Math.round(item.percentage) }}%)</strong
          >
          >>
          <span>
            {{ item.stations.map((s) => s!.name).join(", ") }}
          </span>
        </div>
      </div>
      <p v-else="">no session started</p>
    </div>
  </div>
</template>
