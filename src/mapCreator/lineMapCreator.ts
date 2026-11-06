import type { Line, Station, MetroSystem } from "../model";

const DEFAULT_FONT_SIZE = 13;

interface LineSvgOptions {
  width?: number;
  height?: number;
  padding?: number;
  labelAngle?: number;
  revealedStationIds?: ReadonlySet<string>;
  endedSession?: boolean;
}

export function generateMetroLineSvgs(
  metro: MetroSystem,
  options: LineSvgOptions = {}
): { id: string; svg: string }[] {
  const {
    width = 1200,
    height = 180,
    padding = 40,
    labelAngle = 60,
    revealedStationIds = new Set<string>(),
    endedSession = false,
  } = options;

  const stationById = new Map(
    metro.stations.map((station) => [station.id, station])
  );

  const lineSvgs = metro.lines.map((line) => {
    return {
      id: line.id,
      svg: generateLineSvg(line, stationById, metro, {
        width,
        height,
        padding,
        labelAngle,
        revealedStationIds,
        endedSession,
      }).svg,
    };
  });
  return lineSvgs;
}

export function generateLineSvg(
  line: Line,
  stationById: Map<string, Station>,
  metro: MetroSystem,
  options: LineSvgOptions = {}
): { svg: string; width: number; height: number } {
  const {
    width = 1200,
    height = 180,
    padding = 40,
    labelAngle = 60,
    revealedStationIds = new Set<string>(),
    endedSession = false,
  } = options;

  const stations = line.stations
    .map((id) => stationById.get(id))
    .filter((s): s is Station => s !== undefined);

  if (stations.length === 0) return { svg: "", width, height };

  const availableWidth = width - padding * 2;
  const spacing =
    stations.length > 1 ? availableWidth / (stations.length - 1) : 0;

  const interchangeIds = new Set(
    metro.stations
      .filter(
        (station) =>
          metro.lines.filter((l) => l.stations.includes(station.id)).length > 1
      )
      .map((station) => station.id)
  );

  const labelDistance = 12;
  const labelAngleRad = (labelAngle * Math.PI) / 180;
  const fontSize = DEFAULT_FONT_SIZE;

  // Calculate the maximum vertical space required by any label.
  const maxLabelHeight = Math.max(
    ...stations.map((station) => {
      const textWidth = estimateTextWidth(station.name, fontSize);

      return (
        textWidth * Math.sin(labelAngleRad) + fontSize * Math.cos(labelAngleRad)
      );
    })
  );

  const topPadding = maxLabelHeight + labelDistance + 12;
  const bottomPadding = 20;

  // Position the line near the bottom, leaving room for labels above.
  const centerY = topPadding;
  const calculatedHeight = topPadding + bottomPadding;

  const stationSvg = stations
    .map((station, index) => {
      const x = padding + index * spacing;
      const y = centerY;

      const revealed = revealedStationIds.has(station.id);
      const showEndedLabel = endedSession && !revealed;
      const showLabel = revealed || showEndedLabel;

      const isInterchange = interchangeIds.has(station.id);

      // Position the label above the line.
      const labelX = x + labelDistance * Math.sin(labelAngleRad);
      const labelY = y - labelDistance * Math.cos(labelAngleRad);

      return `
      <g>
        <circle
          cx="${x}"
          cy="${y}"
          r="${isInterchange ? 7 : 5}"
          fill="white"
          stroke="#333"
          stroke-width="2"
        />

        ${
          showLabel
            ? `
              <text
                x="${labelX}"
                y="${labelY}"
                transform="rotate(-${labelAngle}, ${labelX}, ${labelY})"
                text-anchor="start"
                font-size="${fontSize}"
                font-family="monospace"
                fill="${showEndedLabel ? "#8f352b" : "#333"}"
              >${escapeXml(station.name)}</text>
            `
            : ""
        }
      </g>
    `;
    })
    .join("\n");

  const points = stations
    .map((_, index) => `${padding + index * spacing},${centerY}`)
    .join(" ");

  return {
    svg: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${width} ${calculatedHeight}"
      width="${width}"
      height="${calculatedHeight}"
    >
      <polyline
        points="${points}"
        fill="none"
        stroke="${escapeXml(line.color)}"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      ${stationSvg}
    </svg>
  `,
    width,
    height,
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.602;
}
