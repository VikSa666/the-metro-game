import { createRouter, createWebHashHistory } from "vue-router";
import SetupSessionView from "./views/SetupSessionView.vue";
import OngoingSessionView from "./views/OngoingSessionView.vue";
import FinishedSessionView from "./views/FinishedSessionView.vue";

const routes = [
  { path: "/", name: "setup", component: SetupSessionView },
  { path: "/game", name: "game", component: OngoingSessionView },
  { path: "/results", name: "results", component: FinishedSessionView },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
