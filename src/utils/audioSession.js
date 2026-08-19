// iOS gives the whole page a single audio session, and an un-muted <video>
// starting up claims it -- which pauses every other media element on the page.
// That is why the notes video kills the BGM on an iPhone while desktop
// browsers, which mix media elements freely, are unaffected.
//
// Two layers, because the first one only exists on Safari 16.4+:
//   1. declare the page's session type up front, so Safari mixes our own
//      sources into one session instead of letting the video pre-empt them
//   2. if something pre-empted the BGM anyway, start it again once the
//      interrupting clip is done

// Safe to call repeatedly; no user gesture required.
export const primeAudioSession = () => {
  // navigator.audioSession is Safari-only -- everywhere else this is a no-op
  if (navigator.audioSession) {
    // 'playback' = long-form audio for the whole page, mixed rather than
    // interrupted by our own clips
    navigator.audioSession.type = 'playback';
  }
};

let bgmEl = null;
// what the mute toggle asks for, which is not the same as what iOS is doing
let bgmWanted = false;

export const registerBgm = (el) => {
  bgmEl = el;
};

export const setBgmWanted = (wanted) => {
  bgmWanted = wanted;
};

// iOS does not hand the session back the instant a clip ends, so retry a couple
// of times rather than trusting a single call. play() on an element that is
// already running is skipped, so this is safe to call whenever.
const RESUME_DELAYS = [0, 250, 800];

export const resumeBgm = () => {
  for (const delay of RESUME_DELAYS) {
    setTimeout(() => {
      if (!bgmEl || !bgmWanted || !bgmEl.paused) return;
      bgmEl.play().catch(() => {});
    }, delay);
  }
};
