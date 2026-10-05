import type { MetroSystem, Station } from "./model";
import { v4 as uuidv4 } from "uuid";

export interface Session {
  id: string;
  startTime: number | null;
  duration: number;
  // TODO: More complex "game modality"
  metro: MetroSystem;
  guessedStations: Station[];
}

function createNewSession(metro: MetroSystem, duration: number): Session {
  return {
    id: uuidv4(),
    startTime: null,
    duration,
    metro,
    guessedStations: [],
  };
}

export function startSession(
  metroSystem: MetroSystem,
  duration: number
): Session {
  const session = createNewSession(metroSystem, duration);
  session.startTime = Date.now();
  session.duration = duration;
  session.guessedStations = [];
  return session;
}
