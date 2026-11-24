// timeline.js — Shared 128 BPM clock for InsightX 2.0 Comic-Pop Showreel
export const DUR = 30.0;
export const BPM = 128;
export const BEAT = 60 / BPM; // 0.46875s per beat
export const BAR = BEAT * 4;  // 1.875s per bar (16 bars = 30.0s exact)

export const b = n => n * BEAT;
export const bar = n => n * BAR;

// Start a transition early so its reveal frame lands right on `hit`
export const revealOn = (hit, dur, reveal = 0.5) => hit - dur * reveal;

export const SHOTS = [
  { id: 's01', name: '镜头1：痛点爆破引入 (0-4.5s)',            t0: 0.0,  t1: 4.5,  dur: 4.5 },
  { id: 's02', name: '镜头2：选赛道与8卡门禁实操 (4.5-8.5s)',   t0: 4.5,  t1: 8.5,  dur: 4.0 },
  { id: 's03', name: '镜头3：Bento参数与划卡分拣 (8.5-13s)',    t0: 8.5,  t1: 13.0, dur: 4.5 },
  { id: 's04', name: '镜头4：ROI滑块爆点推演 (13-17.5s)',       t0: 13.0, t1: 17.5, dur: 4.5 },
  { id: 's05', name: '镜头5：30s播客原声解密 (17.5-21.5s)',     t0: 17.5, t1: 21.5, dur: 4.0 },
  { id: 's06', name: '镜头6：态势矩阵+智库导出与升华落版 (21.5-30s)', t0: 21.5, t1: 30.0, dur: 8.5 },
];

// Intentional holds (so QA motion check recognizes deliberate visual stops)
export const HOLDS = [
  [28.4, 30.0], // Final brand poster resolve hold (1.6s)
];

// Major rhythmic drops (for audio breath & impact verification)
export const DROPS = [
  { t: 3.2,  label: 'CUT! 斩断 90% 噪音' },
  { t: 11.4, label: 'SWIPE! 右滑收藏 SAVED' },
  { t: 15.2, label: 'SLIDE! -96.3% ROI 爆点' },
  { t: 25.6, label: '整页漫画拉远 · InsightX 2.0 落版' },
];

// Synchronized tactile UI & comic SFX cues
export const CUES = [
  // s01: Pain barrage -> CUT!
  { t: 0.15, sfx: 'pop',   note: 'G4' },
  { t: 0.65, sfx: 'pop',   note: 'A4' },
  { t: 1.15, sfx: 'pop',   note: 'C5' },
  { t: 1.75, sfx: 'tick' },
  { t: 2.20, sfx: 'tick' },
  { t: 3.15, sfx: 'slash' },
  { t: 3.20, sfx: 'impact' },
  { t: 4.35, sfx: 'whoosh' },

  // s02: Onboarding click -> Gatekeeper -> Telemetry
  { t: 5.35, sfx: 'click' },
  { t: 5.55, sfx: 'whoosh' },
  { t: 6.10, sfx: 'blip', note: 'D6' },
  { t: 6.50, sfx: 'blip', note: 'F6' },
  { t: 6.90, sfx: 'blip', note: 'A6' },
  { t: 7.35, sfx: 'pop',  note: 'C6' },
  { t: 8.35, sfx: 'whoosh' },

  // s03: Bento 4-box callouts + Swipe Left & Right
  { t: 9.00, sfx: 'tick' },
  { t: 9.35, sfx: 'tick' },
  { t: 9.70, sfx: 'tick' },
  { t: 10.05, sfx: 'tick' },
  { t: 10.45, sfx: 'swipe', up: false },
  { t: 11.35, sfx: 'swipe', up: true },
  { t: 11.45, sfx: 'impact' },
  { t: 12.85, sfx: 'whoosh' },

  // s04: Signature ROI Slider Drag -> Explosion!
  { t: 13.45, sfx: 'click' },
  { t: 13.85, sfx: 'tick' },
  { t: 14.15, sfx: 'tick' },
  { t: 14.45, sfx: 'tick' },
  { t: 14.75, sfx: 'tick' },
  { t: 15.05, sfx: 'riser', dur: 0.45 },
  { t: 15.20, sfx: 'impact' },
  { t: 15.25, sfx: 'shimmer' },
  { t: 17.35, sfx: 'whoosh' },

  // s05: Podcast 30s Audio Decryption
  { t: 18.25, sfx: 'click' },
  { t: 18.45, sfx: 'pop', note: 'G5' },
  { t: 19.20, sfx: 'blip', note: 'E6' },
  { t: 20.10, sfx: 'pop', note: 'A5' },
  { t: 21.35, sfx: 'whoosh' },

  // s06: Matrix -> Vault Export -> Final Resolve
  { t: 22.10, sfx: 'click' },
  { t: 22.60, sfx: 'blip', note: 'G6' },
  { t: 23.45, sfx: 'whoosh' },
  { t: 24.05, sfx: 'click' },
  { t: 24.45, sfx: 'pop', note: 'D6' },
  { t: 25.45, sfx: 'whoosh' },
  { t: 25.65, sfx: 'impact' },
  { t: 26.80, sfx: 'shimmer' },
];
