import { defineStore } from "pinia";
import { startSession, type Session } from "../session";
import type { MetroSystem, Station } from "../model";

const STORAGE_KEY = "metro-game-session";

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
      this.updateTime();
      this.persistSession();
    },

    persistSession() {
      if (!this.session) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    },

    restoreSession() {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      try {
        this.session = JSON.parse(saved) as Session;
        this.updateTime();
      } catch {
        // Si los datos guardados están corruptos, los descartamos.
        this.clearSession();
      }
    },

    updateTime() {
      if (!this.session || this.session.startTime === null) {
        this.time = 0;
        return;
      }

      const elapsed = (Date.now() - this.session.startTime) / 1000;
      this.time = Math.max(0, Math.ceil(this.session.duration - elapsed));
    },

    addGuessedStation(station: Station) {
      if (!this.session) return;

      if (this.session.guessedStations.some((s) => s.id === station.id)) {
        return;
      }

      this.session.guessedStations.push(station);
      this.persistSession();
    },

    clearSession() {
      this.session = undefined;
      this.time = 0;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
