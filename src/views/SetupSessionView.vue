<script lang="ts" setup>
import { ref } from "vue";
import barcelona from "../assets/barcelona.json";
import type { MetroSystem } from "../model";
import { useSessionStore } from "../stores/session.ts";
import { useRouter } from "vue-router";
import BasicButton from "../components/BasicButton.vue";
import BasicDropdown from "../components/BasicDropdown.vue";

const router = useRouter();

const session = useSessionStore();

// TODO: Improve selector of metro options
const metroOptions: Array<{ id: string; metro: MetroSystem }> = [
  { id: "barcelona", metro: barcelona },
];

const metro = ref<string>("");
function start() {
  if (!metro.value || !duration.value) {
    console.error("Can't start");
    return;
  }
  const chosenMetro = metroOptions.find((m) => m.id === metro.value);

  // TODO: Improve
  const mapDuration = (duration: string): number => {
    switch (duration) {
      case "1 minut":
        return 60;
      case "5 minuts":
        return 5 * 60;
      case "10 minuts":
        return 10 * 60;
      case "20 minuts":
        return 20 * 60;
      case "30 minuts":
        return 30 * 60;
      default:
        console.error("Not a valid option: " + duration);
        return NaN;
    }
  };
  if (!chosenMetro) {
    console.error("El metro escollit no existeix");
    return;
  } else {
    setTimeout(() => {
      session.startSession(chosenMetro.metro, mapDuration(duration.value));
      router.push("/game");
    }, 1000);
  }
}

const duration = ref("");
const availableDurations = [
  "1 minut",
  "5 minuts",
  "10 minuts",
  "20 minuts",
  "30 minuts",
];
</script>

<template>
  <div class="main">
    <div class="card">
      <BasicDropdown
        v-model="metro"
        :availableOptions="metroOptions.map((option) => option.id)"
        label="Mapa de metro"
      />
      <BasicDropdown
        v-model="duration"
        :availableOptions="availableDurations"
        label="Duració"
      />
      <BasicButton :disabled="!duration || !metro" @click="start">
        Començar
      </BasicButton>
    </div>
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

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
  width: fit-content;
  color: #29251b;
  border: 3px solid #29251b;
  padding: 24px;
}
</style>
