<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useSessionStore } from "../stores/session";
import { matchStation } from "../model";
import { formatTime } from "../helpers";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import MetroMap from "../components/MetroMap.vue";
import BasicTextarea from "../components/BasicTextarea.vue";
import BasicButton from "../components/BasicButton.vue";

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

// const guessedByLine = computed(() => {
//   if (!session.session) return;
//   return session.session.metro.lines
//     .map((line: Line) => {
//       const stations = line.stations
//         .map((id) => session.session!.guessedStations.find((s) => s.id === id))
//         .filter(Boolean);
//       return {
//         line,
//         stations,
//         percentage: (stations.length / line.stations.length) * 100,
//       };
//     })
//     .filter((line) => line.stations.length > 0);
// });

const remaining = ref(0);

let timer: number | undefined;
let startedAt = 0;

function startTimer() {
  if (!session.session) {
    router.replace("/");
    return;
  }
  remaining.value = session.session.duration;
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
  <div class="wrapper" v-if="session.session">
    <div class="toolbar">
      <div class="wrapperTextarea">
        <h1>ESCRIU L'ESTACIÓ I PRESSIONA ENTER PER ENDEVINAR</h1>
        <div class="guessTextarea">
          <BasicTextarea v-model="guess" @keydown.enter="guessStation" />
          <BasicButton @click="guessStation">Endevinar</BasicButton>
        </div>
        <p>{{ matchMsg }}</p>
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

      <BasicButton class="surrenderButton" :variant="'alert'" @click="end">
        Rendir-se
      </BasicButton>
    </div>

    <div class="mapViewport">
      <MetroMap :metro-system="session.session?.metro" />
    </div>
  </div>

  <p v-else>Sessió no iniciada</p>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(110px, 1fr) minmax(110px, 1fr) auto;
  gap: 16px;
  align-items: center;
  min-width: 0;
}

.wrapperTextarea {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-start;
  min-width: 0;

  h1 {
    font-size: 9px;
    color: dimgrey;
  }

  p {
    font-size: 10px;
    color: var(--color-brown);
    min-height: 12px;
    margin: 0;
  }
}

.guessTextarea {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;

  h1 {
    font-size: 9px;
    color: dimgrey;
    white-space: nowrap;
  }

  span {
    font-size: clamp(24px, 3vw, 40px);
  }

  .scoreLabel {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.score {
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

.mapViewport {
  width: 100%;
  min-width: 0;
}

/* middle size screen */
@media (max-width: 800px) {
  .toolbar {
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 12px;
  }

  .wrapperTextarea {
    grid-column: 1 / -1;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .wrapper {
    gap: 12px;
  }

  .toolbar {
    grid-template-columns: 1fr 1fr;
    gap: 10px 8px;
  }

  .wrapperTextarea {
    grid-column: 1 / -1;

    h1 {
      font-size: 9px;
    }
  }

  .guessTextarea {
    align-items: stretch;

    min-width: 0;
  }

  .score {
    padding: 4px 0;

    h1 {
      font-size: 8px;
    }

    span {
      font-size: clamp(24px, 8vw, 32px);
    }
  }

  .surrenderButton {
    grid-column: 1 / -1;
    justify-self: center;
  }
}
</style>
