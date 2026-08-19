import backgroundMusic from "../assets/sounds/beneathTheMask.mp3";

// iOS gives the whole page a single audio session, and an un-muted <video>
// starting up claims it -- which pauses every other media element on the page.
// That is why the notes video kills the BGM on an iPhone while desktop
// browsers, which mix media elements freely, are unaffected.
//
// Two layers, because the first one only exists on Safari 16.4+:
//   1. declare the page's session type up front, so Safari mixes our own
//      sources into one session instead of letting a clip pre-empt them
//   2. if the BGM gets paused by anything other than us, take it back

// Page-level setting, so it is asserted once at startup -- see main.jsx.
export const primeAudioSession = () => {
  if (navigator.audioSession) {
    // 'playback' = long-form audio owned by the page, mixed rather than
    // interrupted by our own clips
    navigator.audioSession.type = "playback";
  }
};

let audio = null;
// what the mute toggle asks for, which is not the same as what iOS is doing
let wanted = false;
let retry = null;
let attempt = 0;

// iOS does not hand the session back the moment a clip ends, so back off and
// ask again. Stops on the first success; gives up after ~4.5s.
const RETRY_BACKOFF_MS = [300, 600, 1200, 2400];

const scheduleResume = () => {
  if (retry !== null || attempt >= RETRY_BACKOFF_MS.length) return;

  retry = setTimeout(() => {
    retry = null;
    if (!wanted || !audio.paused) return;
    attempt += 1;
    audio.play().catch(scheduleResume);
  }, RETRY_BACKOFF_MS[attempt]);
};

const getAudio = () => {
  if (audio) return audio;

  audio = new Audio(backgroundMusic);
  audio.loop = true;
  audio.volume = 0.15;
  audio.muted = true;

  // A pause we did not ask for is an interruption -- something else took the
  // session. Claiming it back here means no clip has to remember to do it.
  audio.addEventListener("pause", () => {
    if (wanted) scheduleResume();
  });
  audio.addEventListener("playing", () => {
    attempt = 0;
  });

  return audio;
};

// The one place the BGM's playing/muted state is decided.
export const setBgmMuted = (muted) => {
  const el = getAudio();
  wanted = !muted;
  el.muted = muted;

  if (muted) {
    el.pause();
  } else {
    el.play().catch(() => {});
  }
};
