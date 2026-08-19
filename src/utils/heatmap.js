import { toLocalDateStr } from './streak';

// Effort per log, so a High session outweighs a Low one. Mirrors the exp
// values in Dialogue.jsx, scaled down to 1/2/3.
export const INTENSITY_WEIGHT = { Low: 1, Medium: 2, High: 3 };

export const LEVEL_COUNT = 4;

export const weightOf = (intensity) => INTENSITY_WEIGHT[intensity] ?? 1;

// value -> one of LEVEL_COUNT ramp steps, scaled against the busiest cell on screen
export const levelOf = (value, max) => {
  if (value <= 0 || max <= 0) return 0;
  return Math.min(LEVEL_COUNT, Math.ceil((value / max) * LEVEL_COUNT));
};

// The `days` most recent local dates, oldest first, ending today
export const recentDayKeys = (days, now = new Date()) => {
  const anchor = new Date(now);
  anchor.setHours(12, 0, 0, 0); // midday, so DST shifts can't skip a day

  const keys = [];
  for (let back = days - 1; back >= 0; back -= 1) {
    const date = new Date(anchor);
    date.setDate(anchor.getDate() - back);
    keys.push(toLocalDateStr(date));
  }
  return keys;
};

export const COMBINED_NAME = 'All activities';

// Rows of per-day effort, one row per activity, over the trailing `days` window.
// Activities with nothing logged still get a row — an empty row is the point in
// a habit tracker. Activities since deleted but present in history are appended.
// Also returns a `combined` row: the same window with the activities merged, so
// a day reads as one number instead of a column to scan.
export const buildHeatmap = ({ history, activities, days, now = new Date() }) => {
  const dayKeys = recentDayKeys(days, now);
  const rangeSet = new Set(dayKeys);

  const inRange = history.filter(entry =>
    rangeSet.has(toLocalDateStr(new Date(entry.timestamp)))
  );

  const names = activities.map(a => a.name);
  for (const entry of inRange) {
    if (!names.includes(entry.activityName)) names.push(entry.activityName);
  }

  const addTo = (cell, entry) => {
    cell.effort += weightOf(entry.intensity);
    cell.logs += 1;
    cell.byIntensity[entry.intensity] = (cell.byIntensity[entry.intensity] ?? 0) + 1;
    return cell;
  };

  const emptyCell = () => ({ effort: 0, logs: 0, byIntensity: {} });

  // name -> dayKey -> { effort, logs, byIntensity }
  const buckets = new Map();
  // dayKey -> the same shape, with every activity folded in
  const totals = new Map();

  for (const entry of inRange) {
    const dayKey = toLocalDateStr(new Date(entry.timestamp));
    if (!buckets.has(entry.activityName)) buckets.set(entry.activityName, new Map());

    const byDay = buckets.get(entry.activityName);
    byDay.set(dayKey, addTo(byDay.get(dayKey) ?? emptyCell(), entry));
    totals.set(dayKey, addTo(totals.get(dayKey) ?? emptyCell(), entry));
  }

  let max = 0;
  const rows = names.map((name) => {
    const byDay = buckets.get(name);
    const cells = dayKeys.map((key) => {
      const cell = byDay?.get(key);
      if (cell && cell.effort > max) max = cell.effort;
      return { key, ...(cell ?? emptyCell()) };
    });
    return { name, cells };
  });

  // Scaled on its own max: a day total sits well above any one activity's cell,
  // so sharing `max` would flatten the combined row to solid colour.
  let combinedMax = 0;
  const combinedCells = dayKeys.map((key) => {
    const cell = totals.get(key);
    if (cell && cell.effort > combinedMax) combinedMax = cell.effort;
    return { key, ...(cell ?? emptyCell()) };
  });

  return {
    dayKeys,
    rows,
    max,
    combined: { name: COMBINED_NAME, cells: combinedCells },
    combinedMax,
    total: inRange.length,
  };
};
