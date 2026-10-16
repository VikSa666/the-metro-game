import type { Line, Station, MetroSystem } from "../model";

interface SvgOptions {
  width?: number;
  height?: number;
  padding?: number;
  revealedStationIds?: ReadonlySet<string>;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateMetroSvg(
  metro: MetroSystem,
  options: SvgOptions = {}
): string {
  const {
    width = 1000,
    height = 700,
    padding = 40,
    revealedStationIds = new Set<string>(),
  } = options;

  if (metro.stations.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}" />`;
  }

  const stationById = new Map(
    metro.stations.map((station: Station) => [station.id, station])
  );

  // 1. Calcular los límites de las coordenadas originales.
  const xs = metro.stations.map((s) => s.x);
  const ys = metro.stations.map((s) => s.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // Evitar divisiones por cero si todas las estaciones
  // tienen la misma coordenada en algún eje.
  const rangeX = Math.max(maxX - minX, 1);
  const rangeY = Math.max(maxY - minY, 1);

  // 2. Escalar uniformemente y centrar el mapa.
  const scale = Math.min(
    (width - 2 * padding) / rangeX,
    (height - 2 * padding) / rangeY
  );

  const offsetX = (width - rangeX * scale) / 2;
  const offsetY = (height - rangeY * scale) / 2;

  const position = (stationId: string) => {
    const station = stationById.get(stationId);
    if (!station) return null;

    return {
      x: offsetX + (station.x - minX) * scale,
      y: offsetY + (station.y - minY) * scale,
    };
  };

  // 3. Dibujar los trazados de las líneas.
  const lineSvg = metro.lines
    .map((line: Line) => {
      const points = line.stations
        .map(position)
        .filter((p) => p !== null)
        .map((p) => `${p!.x},${p!.y}`)
        .join(" ");

      if (!points) return "";

      return `
      <polyline
        points="${points}"
        fill="none"
        stroke="${escapeXml(line.color)}"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    `;
    })
    .join("\n");

  // 4. Dibujar cada estación una sola vez.
  const stationSvg = metro.stations
    .map((station: Station) => {
      const p = position(station.id)!;
      const revealed = revealedStationIds.has(station.id);

      return `
      <g>
        <circle
          cx="${p.x}"
          cy="${p.y}"
          r="5"
          fill="white"
          stroke="#333"
          stroke-width="2"
        />
        ${
          revealed
            ? `
          <text
            x="${p.x + 9}"
            y="${p.y - 9}"
            font-size="14"
            font-family="sans-serif"
            fill="currentColor"
          >${escapeXml(station.name)}</text>
        `
            : ""
        }
      </g>
    `;
    })
    .join("\n");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${height}"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      ${lineSvg}
      ${stationSvg}
    </svg>
  `;
}
