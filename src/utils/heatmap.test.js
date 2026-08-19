import { describe, it, expect } from 'vitest';
import { buildHeatmap, COMBINED_NAME, levelOf, recentDayKeys } from './heatmap';
import { weightOf } from './intensity';

// Midday on a fixed date, clear of DST edges
const NOW = new Date(2026, 5, 10, 12, 0, 0);

// A log at midday `back` days before NOW
const log = (back, activityName, intensity) => ({
  timestamp: new Date(2026, 5, 10 - back, 12, 0, 0).getTime(),
  activityName,
  intensity,
});

const ACTIVITIES = [{ name: 'Code' }, { name: 'Exercise' }];

const cellFor = (result, name, dayKey) =>
  result.rows.find(r => r.name === name).cells.find(c => c.key === dayKey);

describe('recentDayKeys', () => {
  it('returns the trailing window oldest-first, ending today', () => {
    const keys = recentDayKeys(3, NOW);
    expect(keys).toEqual(['2026-06-08', '2026-06-09', '2026-06-10']);
  });

  it('crosses a month boundary correctly', () => {
    const keys = recentDayKeys(3, new Date(2026, 6, 1, 12, 0, 0));
    expect(keys).toEqual(['2026-06-29', '2026-06-30', '2026-07-01']);
  });
});

describe('weightOf', () => {
  it('weights by intensity', () => {
    expect(weightOf('Low')).toBe(1);
    expect(weightOf('Medium')).toBe(2);
    expect(weightOf('High')).toBe(3);
  });

  it('falls back to 1 for an unknown intensity', () => {
    expect(weightOf('Extreme')).toBe(1);
    expect(weightOf(undefined)).toBe(1);
  });
});

describe('levelOf', () => {
  it('is 0 only when there is no effort', () => {
    expect(levelOf(0, 10)).toBe(0);
    expect(levelOf(1, 10)).toBe(1);
  });

  it('scales against the busiest cell and tops out at 4', () => {
    expect(levelOf(2, 8)).toBe(1);
    expect(levelOf(4, 8)).toBe(2);
    expect(levelOf(6, 8)).toBe(3);
    expect(levelOf(8, 8)).toBe(4);
  });

  it('does not divide by zero on an empty range', () => {
    expect(levelOf(0, 0)).toBe(0);
    expect(levelOf(5, 0)).toBe(0);
  });
});

describe('buildHeatmap', () => {
  it('sums effort per activity per day', () => {
    const result = buildHeatmap({
      history: [log(0, 'Code', 'High'), log(0, 'Code', 'Low')],
      activities: ACTIVITIES,
      days: 7,
      now: NOW,
    });

    const cell = cellFor(result, 'Code', '2026-06-10');
    expect(cell.effort).toBe(4); // High 3 + Low 1
    expect(cell.logs).toBe(2);
    expect(cell.byIntensity).toEqual({ High: 1, Low: 1 });
    expect(result.max).toBe(4);
    expect(result.total).toBe(2);
  });

  it('keeps separate days and activities apart', () => {
    const result = buildHeatmap({
      history: [log(0, 'Code', 'Low'), log(2, 'Code', 'Low'), log(0, 'Exercise', 'High')],
      activities: ACTIVITIES,
      days: 7,
      now: NOW,
    });

    expect(cellFor(result, 'Code', '2026-06-10').effort).toBe(1);
    expect(cellFor(result, 'Code', '2026-06-08').effort).toBe(1);
    expect(cellFor(result, 'Code', '2026-06-09').effort).toBe(0);
    expect(cellFor(result, 'Exercise', '2026-06-10').effort).toBe(3);
  });

  it('gives every day in the range a cell, and every activity a row', () => {
    const result = buildHeatmap({
      history: [log(0, 'Code', 'Low')],
      activities: ACTIVITIES,
      days: 30,
      now: NOW,
    });

    expect(result.dayKeys).toHaveLength(30);
    expect(result.rows.map(r => r.name)).toEqual(['Code', 'Exercise']);
    result.rows.forEach(row => expect(row.cells).toHaveLength(30));
    // Exercise was never logged but still gets an all-zero row
    expect(result.rows[1].cells.every(c => c.effort === 0)).toBe(true);
  });

  it('excludes logs older than the range', () => {
    const result = buildHeatmap({
      history: [log(0, 'Code', 'High'), log(30, 'Code', 'High')],
      activities: ACTIVITIES,
      days: 7,
      now: NOW,
    });

    expect(result.total).toBe(1);
    expect(result.max).toBe(3);
  });

  it('still charts activities that were deleted after being logged', () => {
    const result = buildHeatmap({
      history: [log(1, 'Read', 'Medium')],
      activities: ACTIVITIES,
      days: 7,
      now: NOW,
    });

    // current activities first, removed ones appended
    expect(result.rows.map(r => r.name)).toEqual(['Code', 'Exercise', 'Read']);
    expect(cellFor(result, 'Read', '2026-06-09').effort).toBe(2);
  });

  it('sums every activity into the combined row', () => {
    const result = buildHeatmap({
      history: [
        log(0, 'Code', 'High'),
        log(0, 'Exercise', 'Low'),
        log(2, 'Code', 'Medium'),
      ],
      activities: ACTIVITIES,
      days: 7,
      now: NOW,
    });

    const today = result.combined.cells.find(c => c.key === '2026-06-10');
    expect(result.combined.name).toBe(COMBINED_NAME);
    expect(today.effort).toBe(4); // Code High 3 + Exercise Low 1
    expect(today.logs).toBe(2);
    expect(today.byIntensity).toEqual({ High: 1, Low: 1 });

    // its own max, above any single activity cell
    expect(result.max).toBe(3);
    expect(result.combinedMax).toBe(4);
  });

  it('gives the combined row a cell for every day in the range', () => {
    const result = buildHeatmap({
      history: [log(1, 'Code', 'Low')],
      activities: ACTIVITIES,
      days: 30,
      now: NOW,
    });

    expect(result.combined.cells).toHaveLength(30);
    expect(result.combined.cells.filter(c => c.effort > 0)).toHaveLength(1);
    expect(result.combined.cells.map(c => c.key)).toEqual(result.dayKeys);
  });

  it('reports an empty range without a max', () => {
    const result = buildHeatmap({
      history: [],
      activities: ACTIVITIES,
      days: 14,
      now: NOW,
    });

    expect(result.total).toBe(0);
    expect(result.max).toBe(0);
    expect(result.combinedMax).toBe(0);
    expect(result.combined.cells.every(c => c.effort === 0)).toBe(true);
    expect(result.rows).toHaveLength(2);
  });
});
