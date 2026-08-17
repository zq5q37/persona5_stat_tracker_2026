const STREAK_MILESTONES = {
    7: 400,
    14: 500,
    30: 1000,
};

const DAILY_YEN = 100;

// Returns the yen earned for hitting `streak` on this activity log, or 0 if no milestone
export const computeYenReward = (streak) => {
    return STREAK_MILESTONES[streak] ?? DAILY_YEN;
};

// Returns the reward for logging an activity, or null if today was already
// rewarded. Keyed on the date rather than the streak count so that a broken
// streak restarting at 1 still pays out the daily yen.
export const computeActivityReward = (prevStreak, updatedStreak) => {
    if (updatedStreak.lastActivityDate === prevStreak.lastActivityDate) return null;
    return {
        streak: updatedStreak.currentStreak,
        amount: computeYenReward(updatedStreak.currentStreak),
    };
};