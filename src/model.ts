export interface Station {
  id: string;
  name: string;
  aliases: string[];
}

export interface MetroSystem {
  id: string;
  name: string;
  stations: Station[];
  lines: Line[];
}

export interface Line {
  id: string;
  name?: string;
  // TODO: Ordered id of stations
  stations: string[];
}

/**
 * Returns a matched {@link Station} if matches, `null` otherwise.
 * @param s station in a string
 */
export function matchStation(
  s: string,
  metro: MetroSystem
): Station | undefined {
  const normalized = normalize(s);
  return metro.stations.find(
    (station: Station) =>
      normalize(station.name) === normalized ||
      station.aliases.some((alias) => normalized === normalize(alias))
  );
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}
