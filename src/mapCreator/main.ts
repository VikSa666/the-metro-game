import type { Line, Station, MetroSystem } from "../model";

interface SvgOptions {
  width?: number;
  padding?: number;
  revealedStationIds?: ReadonlySet<string>;
  endedSession?: boolean;
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
    width = 2400,
    padding = 20,
    revealedStationIds = new Set<string>(),
    endedSession,
  } = options;

  console.log(endedSession);

  if (metro.stations.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width}" />`;
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
  const height = width * (rangeY / rangeX);

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

  console.log({
    rangeX,
    rangeY,
    aspectRatio: rangeX / rangeY,
    svgAspectRatio: width / height,
  });

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

      // Usar las coordenadas personalizadas si existen.
      // Si no, mantener el offset predeterminado.
      const labelX =
        station.labelX != null
          ? offsetX + (station.labelX - minX) * scale
          : p.x + 9;

      const labelY =
        station.labelY != null
          ? offsetY + (station.labelY - minY) * scale
          : p.y - 9;

      const fontSize = 14;
      const charWidth = fontSize * 0.6;
      const textWidth = station.name.length * charWidth;
      const padX = 4;
      const padY = 3;

      // Las etiquetas adivinadas mantienen el estilo normal.
      // Solo las no adivinadas reciben fondo rojo al finalizar.
      const showNormalLabel = revealed;
      const showEndedLabel = endedSession && !revealed;

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
          showEndedLabel
            ? `
          <rect
            x="${labelX - padX}"
            y="${labelY - fontSize + padY}"
            width="${textWidth + padX * 2}"
            height="${fontSize + padY * 2}"
            rx="3"
            fill="#8f352b"
          />
          <text
            x="${labelX}"
            y="${labelY + padY}"
            font-size="${fontSize}"
            font-family="monospace"
            fill="#f5f0df"
          >${escapeXml(station.name)}</text>
        `
            : ""
        }

        ${
          showNormalLabel
            ? `
          <text
            x="${labelX}"
            y="${labelY}"
            font-size="${fontSize}"
            font-family="monospace"
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
