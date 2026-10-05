<script lang="ts" setup>
import { ref } from "vue";
import barcelona from "../assets/barcelona.json";
import type { MetroSystem } from "../model";
import { useSessionStore } from "../stores/session.ts";
import { useRouter } from "vue-router";

const router = useRouter();

const session = useSessionStore();

// TODO: Improve selector of metro options
const metroOptions: Array<{ id: string; metro: MetroSystem }> = [
  { id: "barcelona", metro: barcelona },
];

const metro = ref<{ id: string; metro: MetroSystem } | undefined>(undefined);
const duration = ref(60);
function start() {
  if (!metro.value || !duration.value) {
    console.error("Can't start");
    return;
  }
  setTimeout(() => {
    session.startSession(metro.value!.metro, duration.value);
    router.push("/game");
  }, 1000);
}
</script>

<template>
  <div>
    <label for="metroSystems">metro systems:</label>
    <select id="metroSystems" v-model="metro">
      <option v-for="metro in metroOptions" :value="metro">
        {{ metro.id }}
      </option>
    </select>
    <input type="number" v-model="duration" />
    <button @click="start">start game</button>
  </div>
</template>
