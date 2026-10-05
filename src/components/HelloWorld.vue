<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { startSession, type Session } from "../session";
import barcelona from "../assets/barcelona.json";
import { matchStation, type Line } from "../model";

function start() {
  session.value = startSession(barcelona, duration.value);
  startTimer();
}

function end() {
  // TODO: Route to page with results
  console.log("Session ended");
}

const session: Ref<Session | undefined> = ref(undefined);

const guess = ref("");
const matchMsg = ref("");
function guessStation() {
  if (!session.value) return;
  const matchedStation = matchStation(guess.value, session.value.metro);
  console.log(matchedStation);
  if (matchedStation) {
    matchMsg.value = "Match! " + matchedStation.name;
    session.value.guessedStations.push(matchedStation);
    guess.value = "";
  } else {
    matchMsg.value = "No match...";
  }
}

const guessedByLine = computed(() => {
  if (!session.value) return;
  return session.value.metro.lines
    .map((line: Line) => {
      const stations = line.stations
        .map((id) => session.value!.guessedStations.find((s) => s.id === id))
        .filter(Boolean);
      return {
        line,
        stations,
        percentage: (stations.length / line.stations.length) * 100,
      };
    })
    .filter((line) => line.stations.length > 0);
});

const duration = ref(60); // Seconds
const remaining = ref(duration.value);

let timer: number | undefined;
let startedAt = 0;

function startTimer() {
  startedAt = Date.now();

  timer = window.setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    remaining.value = Math.max(0, duration.value - elapsed);

    if (remaining.value === 0) {
      end();
      stopTimer();
    }
  }, 100);
}

function stopTimer() {
  if (timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div>
      <button @click="start">start</button>
      <button @click="end">end</button>
      <input type="number" v-model="duration" />
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
