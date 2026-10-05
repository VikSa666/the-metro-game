export function formatTime(seconds: number | undefined): string {
  if (!seconds) return "asdf";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
