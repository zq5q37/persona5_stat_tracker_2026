function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeStreakUpdate(lastActivityDate, currentStreak) {
  const today = toLocalDateStr(new Date());

  if (lastActivityDate === today) {
    return { currentStreak, lastActivityDate: today };
  }

  const yesterday = toLocalDateStr(new Date(Date.now() - 86400000));

  if (lastActivityDate === yesterday) {
    return { currentStreak: currentStreak + 1, lastActivityDate: today };
  }

  return { currentStreak: 1, lastActivityDate: today };
}
