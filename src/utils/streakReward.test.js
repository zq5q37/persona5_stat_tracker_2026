import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computeStreakUpdate } from './streak';
import { computeActivityReward, computeYenReward } from './yen';

const TODAY = '2026-06-10';
const YESTERDAY = '2026-06-09';

// Mirrors what main.jsx does when an activity is logged
const logActivity = (streak) => {
  const updated = computeStreakUpdate(streak.lastActivityDate, streak.currentStreak);
  return { streak: updated, reward: computeActivityReward(streak, updated) };
};

describe('logging an activity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Midday, well clear of DST edges, so "now - 24h" is unambiguously yesterday
    vi.setSystemTime(new Date(2026, 5, 10, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('pays the daily yen when a broken streak restarts at 1', () => {
    const { streak, reward } = logActivity({ currentStreak: 3, lastActivityDate: '2026-06-05' });

    expect(streak).toEqual({ currentStreak: 1, lastActivityDate: TODAY });
    expect(reward).toEqual({ streak: 1, amount: 100 });
  });

  it('pays the daily yen when the streak drops from 2 to 1', () => {
    const { streak, reward } = logActivity({ currentStreak: 2, lastActivityDate: '2026-06-01' });

    expect(streak.currentStreak).toBe(1);
    expect(reward).toEqual({ streak: 1, amount: 100 });
  });

  it('pays the daily yen when the streak continues', () => {
    const { streak, reward } = logActivity({ currentStreak: 2, lastActivityDate: YESTERDAY });

    expect(streak).toEqual({ currentStreak: 3, lastActivityDate: TODAY });
    expect(reward).toEqual({ streak: 3, amount: 100 });
  });

  it('pays the daily yen for the very first activity', () => {
    const { streak, reward } = logActivity({ currentStreak: 0, lastActivityDate: null });

    expect(streak).toEqual({ currentStreak: 1, lastActivityDate: TODAY });
    expect(reward).toEqual({ streak: 1, amount: 100 });
  });

  it('pays nothing for a second activity on the same day', () => {
    const { streak, reward } = logActivity({ currentStreak: 4, lastActivityDate: TODAY });

    expect(streak).toEqual({ currentStreak: 4, lastActivityDate: TODAY });
    expect(reward).toBeNull();
  });

  it('pays the milestone bonus when the streak reaches 7', () => {
    const { reward } = logActivity({ currentStreak: 6, lastActivityDate: YESTERDAY });

    expect(reward).toEqual({ streak: 7, amount: 400 });
  });
});

describe('computeYenReward', () => {
  it('pays milestone amounts on milestone streaks', () => {
    expect(computeYenReward(7)).toBe(400);
    expect(computeYenReward(14)).toBe(500);
    expect(computeYenReward(30)).toBe(1000);
  });

  it('pays the daily amount otherwise', () => {
    expect(computeYenReward(1)).toBe(100);
    expect(computeYenReward(6)).toBe(100);
    expect(computeYenReward(31)).toBe(100);
  });
});
