import morganaIdle from "./assets/characters/morgana/morgana_idle.webp";
import morganaAssist from "./assets/characters/morgana/morgana_assist.webp";
import morganaLog from "./assets/characters/morgana/morgana_log.webp";
import morganaStar from "./assets/characters/morgana/morgana_star.webp";

import futabaNormal from "./assets/characters/futaba/futaba_normal.webp";
import futabaAssist from "./assets/characters/futaba/futaba_assist.webp";
import futabaLog from "./assets/characters/futaba/futaba_log.webp";
import futabaStar from "./assets/characters/futaba/futaba_star.webp";

import makotoNormal from "./assets/characters/makoto/makoto_normal.webp";
import makotoAssist from "./assets/characters/makoto/makoto_assist.webp";
import makotoLog from "./assets/characters/makoto/makoto_log.webp";
import makotoStar from "./assets/characters/makoto/makoto_star.webp";

import lavenzaIdle from "./assets/characters/lavenza/lavenza_idle.webp";
import lavenzaAssist from "./assets/characters/lavenza/lavenza_assist.webp";
import lavenzaLog from "./assets/characters/lavenza/lavenza_log.webp";
import lavenzaStar from "./assets/characters/lavenza/lavenza_star.webp";

import carolineIdle from "./assets/characters/caroline_justine/caroline_idle.webp";
import carolineSmile from "./assets/characters/caroline_justine/caroline_smile.webp";
import justineIdle from "./assets/characters/caroline_justine/justine_idle.webp";
import justineSmile from "./assets/characters/caroline_justine/justine_smile.webp";

const CONFIDANTS = {
  morgana: {
    key: "morgana",
    label: "Morgana",
    images: {
      idle: morganaIdle,
      smile: morganaAssist,
      grin: morganaLog,
      star: morganaStar,
    },
    welcome:
      "Welcome to Persona 5 Stat Tracker. Let’s turn your routine into something worth leveling up.",
    idleQuotes: [
      "Don't overthink it, {name}, just get started.",
      "Nobody's perfect at first. Keep going!",
      "A tidy room means a tidy mind!",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is looking low... try "{suggestion}"!',
      noSuggestion:
        "Your {lowestStat} is low. Try creating a new activity for it!",
    },
    logPrompt: "What shall we do, {name}?",
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: "Looks like your social stats are growing!",
  },
  futaba: {
    key: "futaba",
    label: "Futaba",
    images: {
      idle: futabaNormal,
      smile: futabaLog,
      grin: futabaAssist,
      star: futabaStar,
    },
    welcome: "System online. Let's hack your habits and level up, {name}.",
    idleQuotes: [
      "Let's level up, one byte at a time.",
      "Small wins stack up fast.",
      "System's ready when you are. Go log something!",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} needs attention. Try "{suggestion}".',
      noSuggestion:
        "Your {lowestStat} is low, but I have no data for that trait yet.",
    },
    logPrompt: "What should we log?",
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: "Nice, {name}! Your social stats are growing.",
  },
  makoto: {
    key: "makoto",
    label: "Makoto",
    images: {
      idle: makotoNormal,
      smile: makotoLog,
      grin: makotoAssist,
      star: makotoStar,
    },
    welcome:
      "Let’s train your mind and heart. Log an action and watch yourself grow.",
    idleQuotes: [
      "Consistency builds momentum.",
      "One step at a time is still progress.",
      "Steady habits go a long way.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} is weak... consider "{suggestion}".',
      noSuggestion:
        "Your {lowestStat} could use work, but I don’t have a suggestion yet.",
    },
    logPrompt: "Which activity will you choose, {name}?",
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: "Excellent, {name}. Your social stats are growing.",
  },
  lavenza: {
    key: "lavenza",
    label: "Lavenza",
    images: {
      idle: lavenzaIdle,
      smile: lavenzaLog,
      grin: lavenzaAssist,
      star: lavenzaStar,
    },
    welcome:
      "Every choice matters. Log your next action and progress together.",
    idleQuotes: [
      "Every choice shapes the path ahead.",
      "Small effort, steady progress.",
      "Order your time, and much shall follow.",
    ],
    assist: {
      hasSuggestion:
        'Your {lowestStat} needs some attention, {name}. Try "{suggestion}".',
      noSuggestion:
        "Your {lowestStat} is a bit low, but I need more data to suggest something.",
    },
    logPrompt: "What would you like to log?",
    intensityPrompt: (activityName) => `How intense was "${activityName}"?`,
    expUpText: "Your progress is steady. Keep moving forward.",
  },
  caroline_justine: {
    key: "caroline_justine",
    label: "Caroline & Justine",
    images: {
      idle: carolineIdle,
      smile: carolineIdle,
      grin: justineIdle,
      star: justineIdle,
    },
    welcome:
      "Listen up, inmate! Justine and I are in charge of your rehabilitation now. Log your next action, and don't make us repeat ourselves.",
    idleQuotes: [
      "Hmph! Standing around won't shorten your sentence, inmate.",
      "Discipline and order are the foundations of true rehabilitation.",
      "Every wasted second is a step closer to eternal imprisonment!",
      "Compliance now will be reflected favorably in your record.",
    ],
    assist: {
      hasSuggestion:
        'Hmph! Your {lowestStat} is pathetic, inmate. Try "{suggestion}" or face the consequences.',
      noSuggestion:
        "Your {lowestStat} requires correction, but we lack sufficient data to issue a proper directive.",
    },
    logPrompt: "Speak, inmate. What deed shall be entered into your record?",
    intensityPrompt: (activityName) =>
      `How grueling was "${activityName}"? Answer truthfully, or else!`,
    expUpText:
      "Your rehabilitation proceeds as scheduled. Do not grow complacent.",
  },
};

// ─── Characters awaiting art ────────────────────────────────────────────────
//
// To activate one of the drafts below, run
//   npm run confidants -- add <key> <idle> <smile> <grin> <star>
// which converts the four source images to .webp and writes them into
// src/assets/characters/<key>/ under the names looked up here.
//
// The confidant then shows up in the picker and the gacha pool on its own.
// Until all four exist the draft is skipped, so a half-finished set never
// breaks the build or puts a broken image on the page.

const CHARACTER_FILES = import.meta.glob("./assets/characters/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const FACES = ["idle", "smile", "grin", "star"];

const resolveImages = (key) => {
  const images = {};
  for (const face of FACES) {
    const url = CHARACTER_FILES[`./assets/characters/${key}/${key}_${face}.webp`];
    if (!url) return null;
    images[face] = url;
  }
  return images;
};

const DRAFT_CONFIDANTS = {
  ryuji: {
    key: "ryuji",
    label: "Ryuji",
    welcome:
      "Yo, {name}! Ready to shake things up? Let's get after it already.",
    idleQuotes: [
      "C'mon {name}, don't just stand there!",
      "Slow progress is still progress, man.",
      "You got this. Just don't half-ass it.",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat}\'s draggin\', man. Go hit "{suggestion}"!',
      noSuggestion:
        "Your {lowestStat} is weak sauce. Make somethin' for it, would ya?",
    },
    logPrompt: "Whatcha gonna do, {name}?",
    intensityPrompt: (activityName) => `How hard'd you go on "${activityName}"?`,
    expUpText: "Hell yeah! You're gettin' stronger, {name}!",
  },
  ann: {
    key: "ann",
    label: "Ann",
    welcome:
      "Hey, {name}! Let's make this fun — I'll cheer you on the whole way.",
    idleQuotes: [
      "You're doing better than you think, {name}.",
      "Take a break if you need one. Then get right back up!",
      "Ugh, I'd kill for some crepes right now...",
    ],
    assist: {
      hasSuggestion: 'Your {lowestStat} could use some love. How about "{suggestion}"?',
      noSuggestion:
        "Your {lowestStat} is lagging behind. Maybe add an activity for it?",
    },
    logPrompt: "So what's the plan, {name}?",
    intensityPrompt: (activityName) => `How rough was "${activityName}"?`,
    expUpText: "See? You're growing, {name}! I knew you had it in you.",
  },
  yusuke: {
    key: "yusuke",
    label: "Yusuke",
    welcome: "Ah, {name}. Let us sculpt something worthwhile from your days.",
    idleQuotes: [
      "Discipline is the frame upon which beauty is stretched.",
      "Even a blank canvas begins with a single stroke.",
      "I find myself short on funds again... but do continue.",
    ],
    assist: {
      hasSuggestion:
        'Your {lowestStat} lacks composition. Perhaps "{suggestion}" would balance it.',
      noSuggestion:
        "Your {lowestStat} is wanting, yet I have no subject to suggest.",
    },
    logPrompt: "What shall you create today, {name}?",
    intensityPrompt: (activityName) =>
      `With what intensity did you approach "${activityName}"?`,
    expUpText: "Remarkable. Your form grows more refined, {name}.",
  },
  haru: {
    key: "haru",
    label: "Haru",
    welcome: "Hello, {name}. Shall we tend to your growth together? Fufu.",
    idleQuotes: [
      "Every garden needs patience, {name}.",
      "Small, steady care yields the best harvest.",
      "Would you like some coffee before we begin?",
    ],
    assist: {
      hasSuggestion:
        'Your {lowestStat} looks a little wilted. Perhaps "{suggestion}" would help?',
      noSuggestion:
        "Your {lowestStat} needs tending, though I've nothing to suggest just yet.",
    },
    logPrompt: "What would you like to do today, {name}?",
    intensityPrompt: (activityName) => `How demanding was "${activityName}"?`,
    expUpText: "My, you're blossoming beautifully, {name}.",
  },
  akechi: {
    key: "akechi",
    label: "Akechi",
    welcome:
      "A pleasure, {name}. Let's see whether your habits withstand scrutiny.",
    idleQuotes: [
      "Consistency is the most damning evidence of character.",
      "Idle hands, {name}. Shall we?",
      "I've reviewed your record. It's... promising.",
    ],
    assist: {
      hasSuggestion:
        'Your {lowestStat} is the weakest link. I\'d recommend "{suggestion}".',
      noSuggestion:
        "Your {lowestStat} is deficient, though the data gives me nothing to suggest.",
    },
    logPrompt: "What will you commit to, {name}?",
    intensityPrompt: (activityName) =>
      `How taxing was "${activityName}", truthfully?`,
    expUpText: "Impressive, {name}. Though I'd expect nothing less.",
  },
  sojiro: {
    key: "sojiro",
    label: "Sojiro",
    welcome: "So you're the one, huh? Fine. Pull up a stool, {name}.",
    idleQuotes: [
      "Take your time. Good coffee can't be rushed.",
      "You look like you could use a curry.",
      "Don't make a mess of things, kid.",
    ],
    assist: {
      hasSuggestion:
        'Your {lowestStat} is running thin. Try "{suggestion}", why don\'t you.',
      noSuggestion:
        "Your {lowestStat}'s lacking. Figure out something for it yourself.",
    },
    logPrompt: "What'll it be, {name}?",
    intensityPrompt: (activityName) =>
      `How much did "${activityName}" take out of you?`,
    expUpText: "Heh. Not bad, {name}. Not bad at all.",
  },
  sae: {
    key: "sae",
    label: "Sae",
    welcome: "Let's be efficient about this, {name}. Show me results.",
    idleQuotes: [
      "Excuses don't hold up under cross-examination.",
      "Hesitation costs you time you can't recover.",
      "...Don't push yourself to the point of collapse.",
    ],
    assist: {
      hasSuggestion:
        'The evidence points to your {lowestStat}. Address it with "{suggestion}".',
      noSuggestion:
        "Your {lowestStat} is the weak point, but I lack the evidence to advise further.",
    },
    logPrompt: "State your intent, {name}.",
    intensityPrompt: (activityName) => `How demanding was "${activityName}"?`,
    expUpText: "Acceptable progress, {name}. Keep it up.",
  },
};

for (const [key, draft] of Object.entries(DRAFT_CONFIDANTS)) {
  const images = resolveImages(key);
  if (images) CONFIDANTS[key] = { ...draft, images };
}

const CONFIDANT_LIST = Object.values(CONFIDANTS);

// Every key that is actually playable right now — drafts without art are absent
const CONFIDANT_KEYS = CONFIDANT_LIST.map((confidant) => confidant.key);

// The confidant everyone starts with, and the one we fall back to on a reset
const DEFAULT_CONFIDANT = "morgana";

export { CONFIDANTS, CONFIDANT_LIST, CONFIDANT_KEYS, DEFAULT_CONFIDANT };
