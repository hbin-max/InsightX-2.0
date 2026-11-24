// score.mjs — Custom 128 BPM D Dorian Funk-Electro Groove + Tactile Comic UI SFX
// Explicitly avoids cliché Am-F-C-G four-on-the-floor + bell outro.
import { DUR, BPM, CUES, DROPS } from './timeline.js';
export { DUR };

export default function score(S) {
  S.tempo(BPM);

  const drums = S.bus('drums', { gain: 0.92 });
  const perc  = S.bus('perc',  { gain: 0.52, reverb: 0.12 });
  const bass  = S.bus('bass',  { gain: 0.82, duck: 0.45 });
  const keys  = S.bus('keys',  { gain: 0.52, reverb: 0.28, duck: 0.4, highpass: 220 });
  const lead  = S.bus('lead',  { gain: 0.44, reverb: 0.25, highpass: 300 });
  const sfx   = S.bus('sfx',   { gain: 0.92, reverb: 0.16 });

  const bars = Math.round(DUR / S.bar(1)); // 16 bars = 30.00s

  // Stylish D Dorian / Neo-Funk 4-bar chord progression (non-cliché!)
  const prog = [
    { root: 'D2', oct: 'D3', chord: ['D3', 'F3', 'A3', 'C4', 'E4'],  mel: ['A4', 'C5', 'D5', 'F5'] },
    { root: 'G2', oct: 'G3', chord: ['G3', 'B3', 'D4', 'F4', 'E4'],  mel: ['B4', 'D5', 'E5', 'G5'] },
    { root: 'Bb2', oct: 'Bb3', chord: ['Bb3', 'D4', 'F4', 'A4'],     mel: ['F4', 'A4', 'C5', 'D5'] },
    { root: 'A2', oct: 'A3', chord: ['A3', 'C#4', 'E4', 'G4'],       mel: ['E4', 'G4', 'A4', 'C5'] },
  ];

  // Helper: check if time `t` falls inside a deliberate pre-drop breath window
  const dropTimes = DROPS.map(d => d.t);
  const inBreath = t => dropTimes.some(dt => t >= dt - 0.36 && t < dt - 0.02);

  for (let bar = 0; bar < bars; bar++) {
    const tBar = S.bar(bar);
    const p = prog[bar % prog.length];
    const isIntro = bar < 2;          // Bars 0–1 (0–3.75s): tension perc + sparse stabs until CUT!
    const isClimax = bar >= 7 && bar <= 11; // Bars 7–11: ROI & Podcast peak energy
    const isOutro = bar >= 14;        // Bars 14–15 (26.25–30s): smooth resolve & hold

    // 1. Funky FM Keys stabs (syncopated on beat 0 and beat 2.5!)
    if (!isIntro && !isOutro) {
      if (!inBreath(tBar)) {
        keys.add(S.keys(p.chord, S.beat(0.75), { decay: 0.9, index: 2.2 }), tBar, { gain: 0.65, pan: -0.18 });
      }
      const stab2 = tBar + S.beat(2.5);
      if (!inBreath(stab2)) {
        keys.add(S.keys(p.chord, S.beat(0.55), { decay: 0.65, index: 2.6 }), stab2, { gain: 0.55, pan: 0.22 });
      }
    } else if (bar === 14) {
      // Warm resolving Dm9 chord on the finale lockup (no cheesy bell!)
      keys.add(S.pad(S.chord(S.midi('D3'), 'min7'), S.bar(1.8), { cutoff: 1400, attack: 0.25, release: 1.0 }), tBar, { gain: 0.58 });
      keys.add(S.keys(['D3', 'F3', 'A3', 'C4', 'E4'], S.beat(2.5), { decay: 2.0, index: 1.6 }), tBar, { gain: 0.72 });
    }

    // 2. Syncopated Breakbeat / Funk Drums (NOT boring four-on-the-floor!)
    const kickSteps = isIntro ? [0, 2.5] : (isOutro ? (bar === 14 ? [0] : []) : [0, 1.5, 2.5]);
    for (const ks of kickSteps) {
      const kt = tBar + S.beat(ks);
      if (inBreath(kt) || kt >= DUR - 1.5) continue;
      drums.add(S.kick({ tone: 52, decay: 0.28, click: 0.65, drive: 0.35 }), kt, { gain: isIntro ? 0.68 : 0.88 });
      S.duck(kt, 0.26);
    }

    // Crisp Snare / Rim backbeat on 1 & 3 + funky ghost snare on 3.75
    if (!isOutro) {
      for (const ss of [1, 3]) {
        const st = tBar + S.beat(ss);
        if (inBreath(st)) continue;
        if (isIntro) {
          perc.add(S.rim({ tone: 1.15 }), st, { gain: 0.75, pan: -0.12 });
        } else {
          drums.add(S.snare({ tone: 205, decay: 0.14, snappy: 0.85 }), st, { gain: 0.72 });
          drums.add(S.clap({ decay: 0.14 }), st, { gain: isClimax ? 0.55 : 0.32 });
        }
      }
      // Subtle 16th-note shaker & hat groove (tactile, human)
      for (let step = 0; step < 8; step++) {
        const ht = tBar + S.beat(step * 0.5);
        if (inBreath(ht)) continue;
        const accent = step % 2 === 1;
        drums.add(S.hat({ open: step === 7 && isClimax, decay: step === 7 && isClimax ? 0.18 : 0.032 }), ht, {
          gain: accent ? 0.52 : 0.24,
          pan: accent ? 0.24 : -0.14
        });
        if (!isIntro) {
          perc.add(S.shaker({ decay: 0.045 }), ht + S.beat(0.25), { gain: 0.24, pan: (step % 2 ? -0.3 : 0.3) });
        }
      }
    }

    // 3. Bouncy Funk Octave-Jumping Bassline
    if (!isIntro && !isOutro) {
      const bassPattern = [
        [0.0,  p.root, 0.40],
        [0.75, p.root, 0.22],
        [1.5,  p.oct,  0.35],
        [2.0,  p.root, 0.25],
        [2.5,  p.root, 0.35],
        [3.25, p.oct,  0.22],
        [3.5,  p.root, 0.30],
      ];
      for (const [step, note, len] of bassPattern) {
        const bt = tBar + S.beat(step);
        if (inBreath(bt)) continue;
        bass.add(S.bass(note, S.beat(len), { cutoff: isClimax ? 950 : 720, q: 1.4, sub: 0.65, drive: 0.42 }), bt, { gain: 0.85 });
      }
    }

    // 4. Playful Mallet / Pluck Comic Counter-Motif during Climax & Active Demos
    if ((bar >= 2 && bar <= 13) && !isIntro) {
      const motifSteps = isClimax ? [0, 0.75, 1.5, 2.25, 3.0, 3.5] : [0, 1.5, 2.5, 3.5];
      motifSteps.forEach((step, idx) => {
        const mt = tBar + S.beat(step);
        if (inBreath(mt)) return;
        const note = p.mel[(bar + idx) % p.mel.length];
        lead.add(S.mallet(note, S.beat(0.42), { material: 'marimba', bright: 0.68 }), mt, {
          gain: isClimax ? 0.55 : 0.38,
          pan: (idx % 2 === 0 ? -0.32 : 0.32)
        });
      });
    }
  }

  // ── TACTILE COMIC & UI SFX LAYER (Exact frame sync from timeline.js) ──
  for (const c of CUES) {
    if (c.t >= DUR) continue;
    if (c.sfx === 'impact') {
      sfx.add(S.impact({ size: 0.95 }), c.t, { gain: 0.88 });
      S.duck(c.t, 0.45);
    } else if (c.sfx === 'slash') {
      sfx.add(S.whoosh(0.28, { from: 900, to: 6500, peak: 0.85 }), Math.max(0, c.t - 0.14), { gain: 0.85 });
      sfx.add(S.click({ tone: 1.5 }), c.t, { gain: 0.8 });
    } else if (c.sfx === 'whoosh') {
      sfx.add(S.whoosh(0.34, { from: 420, to: 4200, peak: 0.65 }), Math.max(0, c.t - 0.18), { gain: 0.68 });
    } else if (c.sfx === 'riser') {
      const d = c.dur || 0.45;
      sfx.add(S.riser(d, { from: 260, to: 3800 }), Math.max(0, c.t - d), { gain: 0.58 });
    } else if (c.sfx === 'click') {
      sfx.add(S.click({ tone: 1.2 }), c.t, { gain: 0.82 });
    } else if (c.sfx === 'swipe') {
      sfx.add(S.swipe(0.24, { up: c.up !== false }), c.t, { gain: 0.86 });
    } else if (c.sfx === 'pop') {
      sfx.add(S.pop(c.note || 'C5'), c.t, { gain: 0.72 });
    } else if (c.sfx === 'blip') {
      sfx.add(S.blip(c.note || 'E6', 0.065), c.t, { gain: 0.52, pan: Math.sin(c.t * 5) * 0.35 });
    } else if (c.sfx === 'tick') {
      sfx.add(S.tick({ tone: 1.05 }), c.t, { gain: 0.52, pan: Math.cos(c.t * 6) * 0.35 });
    } else if (c.sfx === 'shimmer') {
      sfx.add(S.shimmer(1.1, { root: 'D6', count: 7 }), c.t, { gain: 0.52 });
    }
  }
}
