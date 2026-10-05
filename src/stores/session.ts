import { defineStore } from "pinia";
import { startSession, type Session } from "../session";
import type { MetroSystem } from "../model";

export const useSessionStore = defineStore("session", {
  state: () => ({
    session: undefined as Session | undefined,
    time: 0,
  }),
  getters: {
    totalPercentage(state): number {
      if (!state.session) return 0;
      return (
        (state.session.guessedStations.length /
          state.session.metro.stations.length) *
        100
      );
    },
  },
  actions: {
    startSession(metroSystem: MetroSystem, duration: number) {
      this.session = startSession(metroSystem, duration);
    },
  },
});
