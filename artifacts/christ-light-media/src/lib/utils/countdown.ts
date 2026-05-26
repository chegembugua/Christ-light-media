export function timeUntilEvent(eventDate: Date | string): number {
  return Math.max(0, new Date(eventDate).getTime() - Date.now());
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Live now';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
