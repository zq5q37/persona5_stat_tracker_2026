import { toLocalDateStr } from './streak';
import { weightOf } from './intensity';

// Fixed at 4 by the --heat-1..4 ramp in ActivityHeatmap.css -- raising it here
// alone would leave the top levels uncoloured.
export const LEVEL_COUNT = 4;

export const COMBINED_NAME = 'All activities';

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

const emptyCell = () => ({ effort: 0, logs: 0, byIntensity: {} });

// fold one log into `byDay`'s cell for that date
const addLog = (byDay, dayKey, entry) => {
  const cell = byDay.get(dayKey) ?? emptyCell();
  cell.effort += weightOf(entry.intensity);
  cell.logs += 1;
  cell.byIntensity[entry.intensity] = (cell.byIntensity[entry.intensity] ?? 0) + 1;
  byDay.set(dayKey, cell);
};

// a cell per day in the window, so gaps are drawn rather than skipped
const cellsFor = (byDay, dayKeys) =>
  dayKeys.map(key => ({ key, ...(byDay?.get(key) ?? emptyCell()) }));

const maxEffort = (cells) => cells.reduce((max, cell) => Math.max(max, cell.effort), 0);

// Rows of per-day effort, one row per activity, over the trailing `days` window.
// Activities with nothing logged still get a row — an empty row is the point in
// a habit tracker. Activities since deleted but present in history are appended.
// Also returns a `combined` row: the same window with the activities merged, so
// a day reads as one number instead of a column to scan.
export const buildHeatmap = ({ history, activities, days, now = new Date() }) => {
  const dayKeys = recentDayKeys(days, now);
  const rangeSet = new Set(dayKeys);

  const names = activities.map(a => a.name);
  const buckets = new Map(); // name -> dayKey -> cell
  const totals = new Map(); // dayKey -> cell, with every activity folded in
  let total = 0;

  for (const entry of history) {
    const dayKey = toLocalDateStr(new Date(entry.timestamp));
    if (!rangeSet.has(dayKey)) continue;

    total += 1;
    if (!names.includes(entry.activityName)) names.push(entry.activityName);
    if (!buckets.has(entry.activityName)) buckets.set(entry.activityName, new Map());

    addLog(buckets.get(entry.activityName), dayKey, entry);
    addLog(totals, dayKey, entry);
  }

  const rows = names.map(name => ({ name, cells: cellsFor(buckets.get(name), dayKeys) }));
  const combined = { name: COMBINED_NAME, cells: cellsFor(totals, dayKeys) };

  return {
    dayKeys,
    rows,
    max: maxEffort(rows.flatMap(row => row.cells)),
    combined,
    // its own scale: a day total sits well above any single activity's cell, so
    // sharing `max` would flatten the combined row to solid colour
    combinedMax: maxEffort(combined.cells),
    total,
  };
};
