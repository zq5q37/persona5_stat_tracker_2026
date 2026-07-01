import morganaNormal from './assets/characters/morgana/morgana-normal.webp';
import morganaSmile from './assets/characters/morgana/morgana-smile.webp';
import morganaStar from './assets/characters/morgana/morgana-star.webp';
import morganaGrin from './assets/characters/morgana/morgana-grin.webp';
import futabaNormal from './assets/characters/futaba/futaba_normal.png';
import makotoNormal from './assets/characters/makoto/makoto_normal.png';

const CONFIDANTS = {
  morgana: {
    key: 'morgana',
    label: 'Morgana',
    images: {
      idle: morganaNormal,
      smile: morganaSmile,
      grin: morganaGrin,
      star: morganaStar,
    },
    welcome: 'Welcome to Persona 5 Stat Tracker. Let’s turn your routine into something worth leveling up.',
    idleQuotes: [
      "Don't think too hard about it. You'll get the hang of it.",
      "Everyone starts off a little clumsy. Don't be sad if it doesn't go well at first, OK?",
      "If you have nothing to do, let's clean up this room. An uncluttered room is an uncluttered mind!",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is looking low... try "{suggestion}"!',
      noSuggestion: 'Your {lowestStat} is low, but I don’t have an activity for it yet.',
    },
    logPrompt: 'What shall we do?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Looks like your social stats are growing!',
  },
  futaba: {
    key: 'futaba',
    label: 'Futaba',
    images: {
      idle: futabaNormal,
      smile: futabaNormal,
      grin: futabaNormal,
      star: futabaNormal,
    },
    welcome: 'Ready to hack your routine? Log an activity and climb your confidant rank.',
    idleQuotes: [
      "Let’s get a little bit better every day.",
      "A small win today is a huge win for tomorrow.",
      "I can see your potential — just add one thing to the log.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} needs attention. Try "{suggestion}".',
      noSuggestion: 'Your {lowestStat} is low, but I have no data for that trait yet.',
    },
    logPrompt: 'What should we log?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Nice! Your confidant bond is strengthening.',
  },
  makoto: {
    key: 'makoto',
    label: 'Makoto',
    images: {
      idle: makotoNormal,
      smile: makotoNormal,
      grin: makotoNormal,
      star: makotoNormal,
    },
    welcome: 'Let’s train your mind and heart. Log an action and grow as a confidant.',
    idleQuotes: [
      "Consistency is how you build momentum.",
      "One step at a time is still progress.",
      "A calm mind and steady habits will get you far.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is weak... consider "{suggestion}".',
      noSuggestion: 'Your {lowestStat} could use work, but I don’t have a suggestion yet.',
    },
    logPrompt: 'Which activity will you choose?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Excellent. Your confidant connection is growing.',
  },
};

const CONFIDANT_LIST = Object.values(CONFIDANTS);

export { CONFIDANTS, CONFIDANT_LIST };
