export function timeUntilEvent(targetDate: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isStarted: boolean;
} {
  const totalMs = targetDate.getTime() - Date.now();

  if (totalMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isStarted: true };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, totalSeconds, isStarted: false };
}

export function formatCountdown(targetDate: Date): string {
  const { hours, minutes, seconds } = timeUntilEvent(targetDate);
  return [hours, minutes, seconds]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
}
