import morganaIdle from './assets/characters/morgana/morgana_idle.webp';
import morganaAssist from './assets/characters/morgana/morgana_assist.webp';
import morganaLog from './assets/characters/morgana/morgana_log.webp';
import morganaStar from './assets/characters/morgana/morgana_star.webp';

import futabaNormal from './assets/characters/futaba/futaba_normal.webp';
import futabaAssist from './assets/characters/futaba/futaba_assist.webp';
import futabaLog from './assets/characters/futaba/futaba_log.webp';
import futabaStar from './assets/characters/futaba/futaba_star.webp';

import makotoNormal from './assets/characters/makoto/makoto_normal.webp';
import makotoAssist from './assets/characters/makoto/makoto_assist.webp';
import makotoLog from './assets/characters/makoto/makoto_log.webp';
import makotoStar from './assets/characters/makoto/makoto_star.webp';

import lavenzaIdle from './assets/characters/lavenza/lavenza_idle.webp';
import lavenzaAssist from './assets/characters/lavenza/lavenza_assist.webp';
import lavenzaLog from './assets/characters/lavenza/lavenza_log.webp';
import lavenzaStar from './assets/characters/lavenza/lavenza_star.webp';

const CONFIDANTS = {
  morgana: {
    key: 'morgana',
    label: 'Morgana',
    images: {
      idle: morganaIdle,
      smile: morganaAssist,
      grin: morganaLog,
      star: morganaStar,
    },
    welcome: 'Welcome to Persona 5 Stat Tracker. Let’s turn your routine into something worth leveling up.',
    idleQuotes: [
      "Don't overthink it, just get started.",
      "Nobody's perfect at first. Keep going!",
      "A tidy room means a tidy mind!",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is looking low... try "{suggestion}"!',
      noSuggestion: 'Your {lowestStat} is low. Try creating a new activity for it!',
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
      smile: futabaLog,
      grin: futabaAssist,
      star: futabaStar,
    },
    welcome: 'System online. Let\'s hack your habits and level up.',
    idleQuotes: [
      "Let's level up, one byte at a time.",
      "Small wins stack up fast.",
      "System's ready when you are. Go log something!",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} needs attention. Try "{suggestion}".',
      noSuggestion: 'Your {lowestStat} is low, but I have no data for that trait yet.',
    },
    logPrompt: 'What should we log?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Nice! Your social stats are growing.',
  },
  makoto: {
    key: 'makoto',
    label: 'Makoto',
    images: {
      idle: makotoNormal,
      smile: makotoLog,
      grin: makotoAssist,
      star: makotoStar,
    },
    welcome: 'Let’s train your mind and heart. Log an action and watch yourself grow.',
    idleQuotes: [
      "Consistency builds momentum.",
      "One step at a time is still progress.",
      "Steady habits go a long way.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is weak... consider "{suggestion}".',
      noSuggestion: 'Your {lowestStat} could use work, but I don’t have a suggestion yet.',
    },
    logPrompt: 'Which activity will you choose?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Excellent. Your social stats are growing.',
  },
  lavenza: {
    key: 'lavenza',
    label: 'Lavenza',
    images: {
      idle: lavenzaIdle,
      smile: lavenzaLog,
      grin: lavenzaAssist,
      star: lavenzaStar,
    },
    welcome: 'Every choice matters. Log your next action and progress together.',
    idleQuotes: [
      "Every choice shapes the path ahead.",
      "Small effort, steady progress.",
      "Order your time, and much shall follow.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} needs some attention. Try "{suggestion}".',
      noSuggestion: 'Your {lowestStat} is a bit low, but I need more data to suggest something.',
    },
    logPrompt: 'What would you like to log?',
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: 'Your progress is steady. Keep moving forward.',
  },
};

const CONFIDANT_LIST = Object.values(CONFIDANTS);

export { CONFIDANTS, CONFIDANT_LIST };