const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function getRemainingMs(lastReminderSentAt?: string | null): number {
  if (!lastReminderSentAt) return 0;
  const lastSent = new Date(lastReminderSentAt).getTime();
  if (Number.isNaN(lastSent)) return 0;

  const unlockAt = lastSent + ONE_DAY_MS;
  return Math.max(0, unlockAt - Date.now());
}

export function isReminderBlocked(lastReminderSentAt?: string | null): boolean {
  return getRemainingMs(lastReminderSentAt) > 0;
}

export function formatReminderCountdown(lastReminderSentAt?: string | null): string {
  const remainingMs = getRemainingMs(lastReminderSentAt);
  if (remainingMs <= 0) return "";

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Next reminder in ${hours}h ${minutes}m`;
}
