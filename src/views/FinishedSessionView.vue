<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSessionStore } from "../stores/session";
import { formatTime } from "../helpers";

const router = useRouter();
const session = useSessionStore();
function backToMenu() {
  router.push("/");
}
</script>

<template>
  <div>
    <h1>End</h1>
    <button @click="backToMenu">menu</button>
    <h2>Results:</h2>
    <div>
      <strong> Total: </strong>
      <span>{{ Math.round(session.totalPercentage) }}%</span>
      <strong>Time: </strong>
      <span>{{ formatTime(session.time) }}</span>
    </div>
  </div>
</template>
