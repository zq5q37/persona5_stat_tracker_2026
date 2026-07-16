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