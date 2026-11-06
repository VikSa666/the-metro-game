<script setup lang="ts">
import { RouterView } from "vue-router";
import { useSessionStore } from "./stores/session";

const session = useSessionStore();
session.restoreSession();
</script>

<template>
  <RouterView />
</template>
