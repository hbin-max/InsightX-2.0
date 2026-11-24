// comic-kit.js — Deterministic Comic-Pop Visual Engine (Direction C)
// Shared by all 6 independent shots and the master 30s assembly.
import { clamp, lerp, ease, spring, seg, stepped, hash } from './motion.js';

export const PALETTE = {
  paper:  '#FAF5E8',
  paper2: '#F2EAD7',
  ink:    '#121216',
  blue:   '#254DFF',
  yellow: '#FFD426',
  coral:  '#FF3B5C',
  mint:   '#00C885',
  white:  '#FFFFFF',
  muted:  '#4A4A55',
};

export const UI_PATHS = {
  onboarding: './assets/ui/01-onboarding.png',
  gatekeeper: './assets/ui/02-gatekeeper.png',
  model:      './assets/ui/03-feed-model.png',
  telemetry:  './assets/ui/04-telemetry.png',
  swipeRight: './assets/ui/05-swipe-right.png',
  swipeLeft:  './assets/ui/05b-swipe-left.png',
  roiLow:     './assets/ui/06-roi-low.png',
  roiHigh:    './assets/ui/07-roi-high.png',
  podcast:    './assets/ui/08-podcast-audio.png',
  matrix:     './assets/ui/09-matrix.png',
  vault:      './assets/ui/10-vault.png',
};

export async function loadUIImages(keys = Object.keys(UI_PATHS), base = '') {
  const out = {};
  await Promise.all(keys.map(async k => {
    const im = new Image();
    im.src = base ? `${base}/${UI_PATHS[k].replace(/^\.\//, '')}` : UI_PATHS[k];
    await im.decode();
    // Bake into an HTMLCanvasElement so Chromium Skia GPU texture upload & mipmap filtering are 100% deterministic from frame 0!
    const cv = document.createElement('canvas');
    cv.width = im.naturalWidth;
    cv.height = im.naturalHeight;
    cv.getContext('2d').drawImage(im, 0, 0);
    out[k] = cv;
  }));
  return out;
}

// Bulletproof rounded rect path (never throws RangeError on negative radius/size)
export function rrect(c, x, y, w, h, r = 0) {
  const sw = Math.max(0.01, w), sh = Math.max(0.01, h);
  const sr = Math.max(0, Math.min(r || 0, sw / 2, sh / 2));
  c.beginPath();
  c.roundRect(x, y, sw, sh, sr);
}

// Cached 45-degree halftone tile pattern (dot diameter >= 7px at 1080p -> zero moire)
const _patCache = new Map();
export function fillHalftone(c, x, y, w, h, U, color = 'rgba(37, 77, 255, 0.085)', spacing = 22, dotR = 3.8) {
  const key = `${color}|${spacing}|${dotR}|${Math.round(U * 100)}`;
  let pat = _patCache.get(key);
  if (!pat) {
    const s = Math.max(8, Math.round(spacing * U));
    const tile = document.createElement('canvas');
    tile.width = s; tile.height = s * 2;
    const tc = tile.getContext('2d');
    tc.fillStyle = color;
    const r = Math.max(1.5, dotR * U);
    tc.beginPath(); tc.arc(s * 0.25, s * 0.5, r, 0, Math.PI * 2); tc.fill();
    tc.beginPath(); tc.arc(s * 0.75, s * 1.5, r, 0, Math.PI * 2); tc.fill();
    pat = c.createPattern(tile, 'repeat');
    _patCache.set(key, pat);
  }
  c.save();
  c.fillStyle = pat;
  c.fillRect(x, y, w, h);
  c.restore();
}

// Draw full comic page base with ivory paper + halftone + subtle register marks
export function drawComicPage(c, W, H, U, opts = {}) {
  c.fillStyle = opts.invert ? PALETTE.ink : (opts.bg || PALETTE.paper);
  c.fillRect(0, 0, W, H);
  if (!opts.noDots) {
    fillHalftone(c, 0, 0, W, H, U, opts.invert ? 'rgba(255, 212, 38, 0.12)' : (opts.dotColor || 'rgba(37, 77, 255, 0.08)'));
  }
}

// Draw a slanted or rectangular comic panel with bold ink stroke + optional offset shadow
export function drawPanel(c, pts, U, opts = {}) {
  c.save();
  c.lineJoin = 'round';
  if (opts.shadow) {
    c.beginPath();
    pts.forEach(([px, py], i) => i === 0 ? c.moveTo(px + opts.shadow[0], py + opts.shadow[1]) : c.lineTo(px + opts.shadow[0], py + opts.shadow[1]));
    c.closePath();
    c.fillStyle = opts.shadowColor || PALETTE.ink;
    c.fill();
  }
  c.beginPath();
  pts.forEach(([px, py], i) => i === 0 ? c.moveTo(px, py) : c.lineTo(px, py));
  c.closePath();
  c.fillStyle = opts.fill || PALETTE.white;
  c.fill();
  if (opts.innerFn) {
    c.save();
    c.clip();
    opts.innerFn();
    c.restore();
    // Re-trace panel outline because innerFn() calls beginPath() (Canvas save/restore does not save paths)
    c.beginPath();
    pts.forEach(([px, py], i) => i === 0 ? c.moveTo(px, py) : c.lineTo(px, py));
    c.closePath();
  }
  c.lineWidth = (opts.strokeWidth || 6) * U;
  c.strokeStyle = opts.stroke || PALETTE.ink;
  c.stroke();
  c.restore();
}

// Draw 12fps jittering comic concentration lines radiating from (fx, fy)
export function drawConcentrationLines(c, fx, fy, t, U, opts = {}) {
  const count = opts.count || 48;
  const rMin = (opts.rMin || 250) * U;
  const rMax = (opts.rMax || 1250) * U;
  const frameSeed = Math.floor(stepped(t, 12) * 12) + (opts.seed || 7);
  c.save();
  c.strokeStyle = opts.color || 'rgba(18, 18, 22, 0.18)';
  c.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const jitter = (hash(i, frameSeed) - 0.5) * 0.045;
    const a = (i / count) * Math.PI * 2 + jitter;
    const r0 = rMin + hash(i + 100, frameSeed) * 110 * U;
    c.lineWidth = (1.6 + hash(i + 200, frameSeed) * 3.4) * U;
    c.beginPath();
    c.moveTo(fx + Math.cos(a) * r0, fy + Math.sin(a) * r0);
    c.lineTo(fx + Math.cos(a) * rMax, fy + Math.sin(a) * rMax);
    c.stroke();
  }
  c.restore();
}

// Draw horizontal or diagonal comic speed lines (12fps jitter)
export function drawSpeedLines(c, x, y, w, h, t, U, opts = {}) {
  const count = opts.count || 22;
  const frameSeed = Math.floor(stepped(t, 12) * 12) + (opts.seed || 31);
  c.save();
  c.strokeStyle = opts.color || 'rgba(18, 18, 22, 0.22)';
  c.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const yy = y + hash(i, frameSeed) * h;
    const x0 = x + hash(i + 50, frameSeed) * w * 0.35;
    const len = w * (0.35 + hash(i + 90, frameSeed) * 0.65);
    c.lineWidth = (1.5 + hash(i + 140, frameSeed) * 3.5) * U;
    c.beginPath();
    c.moveTo(x0, yy);
    c.lineTo(x0 + len, yy + (opts.slope || 0) * len);
    c.stroke();
  }
  c.restore();
}

// Panel-breaking REAL Obsidian Phone screen with hard ink border & Cobalt offset shadow
export function drawComicPhone(c, img, cx, cy, h, rot, U, opts = {}) {
  const aspect = img ? (img.width / img.height) : (420 / 860);
  const w = h * aspect;
  const rad = (opts.radius || 26) * U;
  const sh = opts.shadow || [15 * U, 15 * U];

  c.save();
  c.translate(cx, cy);
  c.rotate(rot || 0);
  if (opts.scale && opts.scale !== 1) c.scale(opts.scale, opts.scale);

  // Hard offset comic shadow
  c.fillStyle = opts.shadowColor || PALETTE.blue;
  rrect(c, -w / 2 + sh[0], -h / 2 + sh[1], w, h, rad);
  c.fill();

  // Phone body clip + real UI image
  c.save();
  rrect(c, -w / 2, -h / 2, w, h, rad);
  c.clip();
  c.fillStyle = '#07080B';
  c.fillRect(-w / 2, -h / 2, w, h);
  if (img) c.drawImage(img, -w / 2, -h / 2, w, h);
  if (opts.overlayFn) opts.overlayFn(w, h);
  c.restore();

  // Bold ink frame
  c.strokeStyle = opts.borderColor || PALETTE.ink;
  c.lineWidth = (opts.borderWidth || 6) * U;
  c.lineJoin = 'round';
  rrect(c, -w / 2, -h / 2, w, h, rad);
  c.stroke();

  c.restore();
  return { w, h };
}

// Chunky Comic Block Arrow (pointing from tail to tip, animated by progress p in [0,1])
export function drawComicArrow(c, x1, y1, x2, y2, p, U, opts = {}) {
  const k = clamp(p, 0, 1);
  if (k <= 0.01) return;
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return;
  const ang = Math.atan2(dy, dx);
  const curLen = dist * k;
  const headL = Math.min(curLen * 0.45, (opts.headL || 58) * U);
  const headW = (opts.headW || 38) * U;
  const shaftW = (opts.shaftW || 17) * U;

  c.save();
  c.translate(x1, y1);
  c.rotate(ang);
  c.lineJoin = 'round';

  const makePath = (ox, oy) => {
    c.beginPath();
    c.moveTo(ox, oy - shaftW);
    c.lineTo(ox + curLen - headL, oy - shaftW);
    c.lineTo(ox + curLen - headL, oy - headW);
    c.lineTo(ox + curLen, oy);
    c.lineTo(ox + curLen - headL, oy + headW);
    c.lineTo(ox + curLen - headL, oy + shaftW);
    c.lineTo(ox, oy + shaftW);
    c.closePath();
  };

  // Hard offset shadow
  makePath(6 * U, 6 * U);
  c.fillStyle = opts.shadowColor || PALETTE.ink;
  c.fill();

  makePath(0, 0);
  c.fillStyle = opts.fill || PALETTE.yellow;
  c.fill();
  c.strokeStyle = opts.stroke || PALETTE.ink;
  c.lineWidth = (opts.strokeWidth || 4.5) * U;
  c.stroke();
  c.restore();
}

// Hand-drawn curved comic path arrow (progressive stroke reveal!)
export function drawCurvedComicArrow(c, x1, y1, cx1, cy1, x2, y2, p, U, opts = {}) {
  const k = clamp(p, 0, 1);
  if (k <= 0.01) return;
  const steps = 28;
  const maxStep = Math.max(1, Math.round(steps * k));
  const pt = u => [
    (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx1 + u * u * x2,
    (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy1 + u * u * y2,
  ];

  c.save();
  c.lineCap = 'round';
  c.lineJoin = 'round';
  // Ink outer stroke + bright inner stroke for crisp comic readability on dark or light backgrounds!
  const drawCurve = (color, lw) => {
    c.strokeStyle = color;
    c.lineWidth = lw;
    c.beginPath();
    for (let i = 0; i <= maxStep; i++) {
      const [px, py] = pt(i / steps);
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.stroke();
    if (k > 0.25) {
      const [ex, ey] = pt(maxStep / steps);
      const [px, py] = pt(Math.max(0, (maxStep - 2) / steps));
      const ang = Math.atan2(ey - py, ex - px);
      const hl = (opts.headL || 26) * U;
      c.beginPath();
      c.moveTo(ex - hl * Math.cos(ang - 0.55), ey - hl * Math.sin(ang - 0.55));
      c.lineTo(ex, ey);
      c.lineTo(ex - hl * Math.cos(ang + 0.55), ey - hl * Math.sin(ang + 0.55));
      c.stroke();
    }
  };
  if (opts.outline !== false) drawCurve(PALETTE.ink, (opts.lw || 8) * U + 6 * U);
  drawCurve(opts.color || PALETTE.yellow, (opts.lw || 8) * U);
  c.restore();
}

// Comic Pointer Cursor (tactile glove/arrow cursor with click ripple ring!)
export function drawComicCursor(c, x, y, U, clickK = 0) {
  c.save();
  if (clickK > 0.01 && clickK < 0.99) {
    c.strokeStyle = PALETTE.yellow;
    c.lineWidth = (5 * (1 - clickK) + 1.5) * U;
    c.beginPath();
    c.arc(x, y, (14 + clickK * 54) * U, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = PALETTE.ink;
    c.lineWidth = 2 * U;
    c.beginPath();
    c.arc(x, y, (14 + clickK * 54) * U + 3 * U, 0, Math.PI * 2);
    c.stroke();
  }
  const sc = clickK > 0 && clickK < 0.4 ? lerp(1, 0.84, Math.sin((clickK / 0.4) * Math.PI)) : 1;
  c.translate(x, y);
  c.scale(sc, sc);
  c.lineJoin = 'round';
  const path = (ox, oy) => {
    c.beginPath();
    c.moveTo(ox, oy);
    c.lineTo(ox + 8 * U, oy + 44 * U);
    c.lineTo(ox + 19 * U, oy + 31 * U);
    c.lineTo(ox + 33 * U, oy + 46 * U);
    c.lineTo(ox + 41 * U, oy + 38 * U);
    c.lineTo(ox + 27 * U, oy + 23 * U);
    c.lineTo(ox + 42 * U, oy + 18 * U);
    c.closePath();
  };
  path(5 * U, 5 * U);
  c.fillStyle = PALETTE.ink;
  c.fill();
  path(0, 0);
  c.fillStyle = PALETTE.yellow;
  c.fill();
  c.strokeStyle = PALETTE.ink;
  c.lineWidth = 4 * U;
  c.stroke();
  c.restore();
}

// Comic Speech Bubble / Flexible Subtitle Caption Box
export function drawSpeechBubble(c, x, y, w, h, lines, U, opts = {}) {
  c.save();
  c.lineJoin = 'round';
  const rad = (opts.radius || 22) * U;
  const sh = opts.shadow || [8 * U, 8 * U];

  // Shadow
  c.fillStyle = opts.shadowColor || PALETTE.ink;
  rrect(c, x + sh[0], y + sh[1], w, h, rad);
  c.fill();

  // Body
  c.fillStyle = opts.fill || PALETTE.white;
  rrect(c, x, y, w, h, rad);
  c.fill();
  c.strokeStyle = PALETTE.ink;
  c.lineWidth = (opts.strokeWidth || 4.5) * U;
  c.stroke();

  // Optional tail pointing toward (tailX, tailY)
  if (opts.tail) {
    const [tx, ty, baseX, baseY] = opts.tail;
    c.beginPath();
    c.moveTo(baseX - 16 * U, baseY);
    c.lineTo(tx, ty);
    c.lineTo(baseX + 16 * U, baseY);
    c.closePath();
    c.fillStyle = opts.fill || PALETTE.white;
    c.fill();
    c.stroke();
    // Cover inner seam
    c.fillStyle = opts.fill || PALETTE.white;
    c.fillRect(baseX - 15 * U, baseY - 4 * U, 30 * U, 8 * U);
  }

  // Lines
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const fs = (opts.fontSize || 24) * U;
  const lh = (opts.lineHeight || 38) * U;
  const padX = (opts.padX || 26) * U;
  const startY = y + (opts.padY || 44) * U;
  lines.forEach((line, i) => {
    const isAccent = typeof line === 'object';
    const text = isAccent ? line.text : line;
    c.font = `900 ${isAccent && line.size ? line.size * U : fs}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    c.fillStyle = isAccent && line.color ? line.color : (opts.textColor || PALETTE.ink);
    c.fillText(text, x + padX, startY + i * lh);
  });
  c.restore();
}

// Starburst Comic Onomatopoeia Badge (round lineJoin -> ZERO miter spikes!)
export function drawStarburst(c, cx, cy, rx, ry, topText, botText, scale, rot, U, opts = {}) {
  if (scale <= 0.02) return;
  const pts = opts.pts || 14;
  c.save();
  c.translate(cx, cy);
  c.rotate(rot || 0);
  c.scale(scale, scale);
  c.lineJoin = 'round';

  const makeStar = (ox, oy) => {
    c.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const m = i % 2 === 0 ? 1.0 : 0.74;
      const a = (i * Math.PI) / pts;
      const px = Math.cos(a) * rx * m + ox;
      const py = Math.sin(a) * ry * m + oy;
      if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
    }
    c.closePath();
  };

  makeStar(10 * U, 10 * U);
  c.fillStyle = opts.shadowColor || PALETTE.blue;
  c.fill();

  makeStar(0, 0);
  c.fillStyle = opts.fill || PALETTE.yellow;
  c.fill();
  c.strokeStyle = PALETTE.ink;
  c.lineWidth = 5 * U;
  c.stroke();

  c.textAlign = 'center';
  c.textBaseline = 'middle';
  if (botText) {
    c.font = `900 ${(opts.topSize || 50) * U}px "JetBrains Mono", "Arial Black", "PingFang SC", sans-serif`;
    c.fillStyle = PALETTE.ink;
    c.fillText(topText, 0, -22 * U);
    c.font = `900 ${(opts.botSize || 42) * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    c.fillStyle = opts.botColor || PALETTE.blue;
    c.fillText(botText, 0, 28 * U);
  } else {
    c.font = `900 ${(opts.topSize || 56) * U}px "JetBrains Mono", "Arial Black", "PingFang SC", sans-serif`;
    c.fillStyle = opts.topColor || PALETTE.ink;
    c.fillText(topText, 0, 2 * U);
  }
  c.restore();
}

// Comic Chapter Tag Pill (Ink block + crisp bold label)
export function drawChapterTag(c, x, y, text, U, opts = {}) {
  c.save();
  c.font = `900 ${18 * U}px "JetBrains Mono", "PingFang SC", "Microsoft YaHei", sans-serif`;
  const tw = c.measureText(text).width;
  const pw = tw + 34 * U, ph = 42 * U;
  c.fillStyle = opts.bg || PALETTE.ink;
  rrect(c, x, y, pw, ph, 8 * U);
  c.fill();
  c.textAlign = 'left';
  c.textBaseline = 'middle';
  c.fillStyle = opts.fg || PALETTE.yellow;
  c.fillText(text, x + 17 * U, y + ph / 2 + 1 * U);
  c.restore();
}

// Comic Slanted Diagonal Wipe Transition Overlay (progress k in [0, 1])
export function drawDiagonalWipe(c, W, H, k, color = PALETTE.ink, accent = PALETTE.yellow) {
  if (k <= 0.001 || k >= 0.999) return;
  const skew = W * 0.22;
  const x = lerp(-skew, W + skew, ease.inOutExpo(k));
  c.save();
  // Accent trail stripe
  c.fillStyle = accent;
  c.beginPath();
  c.moveTo(x - 160, 0);
  c.lineTo(x + 40, 0);
  c.lineTo(x + 40 - skew, H);
  c.lineTo(x - 160 - skew, H);
  c.closePath();
  c.fill();
  // Ink bold lead stripe
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(x - 60, 0);
  c.lineTo(x + 90, 0);
  c.lineTo(x + 90 - skew, H);
  c.lineTo(x - 60 - skew, H);
  c.closePath();
  c.fill();
  c.restore();
}
