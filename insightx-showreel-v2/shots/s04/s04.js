// s04.js — Shot 4 (13.0s - 17.5s, local 0-4.5s): 签名时刻 · Token 经济学交互式 ROI 滑块实时拖拽爆点!
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawComicPhone, drawComicArrow, drawComicCursor, drawSpeechBubble,
  drawStarburst, drawChapterTag
} from './comic-kit.js';

export const S04_DUR = 4.5;

export function renderS04(ctx, t, W, H, U, IMGS) {
  const dropT = 2.20; // Global 15.20s — major DROP!
  const afterDrop = t >= dropT;
  const dtDrop = t - dropT;
  const flash = afterDrop && dtDrop < 0.07;

  ctx.fillStyle = flash ? PALETTE.ink : PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  const [shx, shy] = shake(t, [0.55, dropT], 18 * U, 0.25);
  ctx.save();
  ctx.translate(shx, shy);

  // Subtle camera punch-zoom right on the DROP hit
  const punchZoom = afterDrop ? 1 + 0.045 * Math.exp(-dtDrop * 7) : lerp(1.0, 1.03, ease.inOutSine(seg(t, 0.6, dropT)));
  ctx.save();
  ctx.translate(1090 * U, 410 * U);
  ctx.scale(punchZoom, punchZoom);
  ctx.translate(-1090 * U, -410 * U);

  drawComicPage(ctx, W, H, U, { invert: flash });

  // ── PANEL 1 (Top-Left Slanted Yellow — Headline & Speech Bubble) ──
  const p1In = spring(t + 0.05, { freq: 4.0, damp: 0.72 });
  ctx.save();
  ctx.translate(lerp(-420 * U, 0, p1In), 0);
  drawPanel(ctx, [
    [42 * U, 42 * U],
    [660 * U, 42 * U],
    [610 * U, 520 * U],
    [42 * U, 520 * U]
  ], U, { fill: PALETTE.yellow });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 ${20 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.blue;
  ctx.fillText('STEP 04 // TOKEN 经济学', 78 * U, 108 * U);

  ctx.font = `900 ${72 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.ink;
  ctx.fillText('别猜成本！', 74 * U, 208 * U);
  ctx.fillText('拉一下就明牌', 74 * U, 298 * U);

  drawSpeechBubble(ctx, 78 * U, 345 * U, 470 * U, 132 * U, [
    { text: '“实操滑块直接向右一拽，', color: PALETTE.ink, size: 22 },
    { text: ' 降幅 96.3% 月省立刻算出来！”', color: PALETTE.blue, size: 22 }
  ], U, { padY: 50, lineHeight: 44, shadow: [6 * U, 6 * U] });
  ctx.restore();

  // ── PANEL 2 (Bottom-Left Slanted White — BEFORE 40万/日 Snapshot) ──
  const p2In = spring(t - 0.12, { freq: 3.8, damp: 0.72 });
  ctx.save();
  ctx.translate(0, lerp(360 * U, 0, p2In));
  drawPanel(ctx, [
    [42 * U, 550 * U],
    [602 * U, 550 * U],
    [558 * U, 1038 * U],
    [42 * U, 1038 * U]
  ], U, {
    fill: '#FFFFFF',
    innerFn: () => {
      const sX = IMGS.roiLow.width * 0.06, sY = IMGS.roiLow.height * 0.245;
      const sW = IMGS.roiLow.width * 0.88, sH = IMGS.roiLow.height * 0.132;
      const bW = 470 * U, bH = bW * (sH / sW);
      ctx.drawImage(IMGS.roiLow, sX, sY, sW, sH, 74 * U, 670 * U, bW, bH);
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 4 * U;
      ctx.strokeRect(74 * U, 670 * U, bW, bH);
    }
  });

  drawChapterTag(ctx, 74 * U, 586 * U, 'BEFORE · 40万/日', U, { bg: PALETTE.ink, fg: '#FFFFFF' });
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 ${32 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.ink;
  ctx.fillText('月省 ¥92.40  ──▶', 76 * U, 945 * U);
  ctx.restore();

  // ── PANEL 3 (Right Hero Action Panel with Concentration Speed Lines!) ──
  drawPanel(ctx, [
    [695 * U, 42 * U],
    [1878 * U, 42 * U],
    [1878 * U, 1038 * U],
    [592 * U, 1038 * U]
  ], U, {
    fill: flash ? PALETTE.ink : '#FFFFFF',
    innerFn: () => {
      const lineAlpha = afterDrop ? 0.22 : 0.11;
      drawConcentrationLines(ctx, 1090 * U, 395 * U, t, U, {
        count: afterDrop ? 56 : 34,
        rMin: afterDrop ? 230 : 320,
        color: flash ? 'rgba(255,212,38,0.45)' : `rgba(18, 18, 22, ${lineAlpha})`
      });
    }
  });

  // Slider drag progress from 0.60s -> 2.15s (snaps to 1.0 at dropT!)
  const dragK = afterDrop ? 1.0 : ease.inOutCubic(seg(t, 0.60, 2.15));
  const dailyWan = Math.round(lerp(40, 480, dragK));
  const monthlySave = lerp(92.4, 1108.8, dragK);

  // ── PANEL-BREAKING REAL PHONE (Transitions cleanly from 06-roi-low -> 07-roi-high!) ──
  const phH = 910 * U;
  const phW = phH * (IMGS.roiHigh.width / IMGS.roiHigh.height);
  const phCX = 760 * U + phW / 2;
  const phCY = 85 * U + phH / 2;
  const activeImg = afterDrop ? IMGS.roiHigh : IMGS.roiLow;

  drawComicPhone(ctx, activeImg, phCX, phCY, phH, 0.02, U, {
    shadow: [16 * U, 16 * U],
    shadowColor: afterDrop ? PALETTE.blue : PALETTE.ink,
    overlayFn: (pw, ph) => {
      // During live drag (0.55s - 2.20s), draw crisp dynamic track + glowing sliding thumb over the real track!
      const trackL = -pw / 2 + pw * 0.115;
      const trackR = -pw / 2 + pw * 0.875;
      const trackY = -ph / 2 + ph * 0.324;
      const curThumbX = lerp(trackL + (trackR - trackL) * 0.05, trackR - (trackR - trackL) * 0.04, dragK);

      if (!afterDrop && t >= 0.45) {
        // Active bright fill on real slider track
        ctx.fillStyle = '#6366F1';
        rrect(ctx, trackL, trackY - 3 * U, curThumbX - trackL, 6 * U, 3 * U);
        ctx.fill();
        // Sliding thumb
        ctx.fillStyle = PALETTE.yellow;
        ctx.beginPath(); ctx.arc(curThumbX, trackY, 12 * U, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 3 * U;
        ctx.stroke();
      }

      // Bold Yellow Comic Highlight Frame around real ROI box!
      ctx.strokeStyle = PALETTE.yellow;
      ctx.lineWidth = 6 * U;
      rrect(ctx, -pw / 2 + pw * 0.055, -ph / 2 + ph * 0.242, pw * 0.89, ph * 0.138, 14 * U);
      ctx.stroke();
    }
  });

  // Animated Comic Pointer Cursor physically grabbing and dragging the real slider handle!
  if (!afterDrop || dtDrop < 0.65) {
    const enterK = ease.outExpo(seg(t, 0.18, 0.58));
    const exitAlpha = afterDrop ? clamp(1 - dtDrop / 0.45, 0, 1) : 1;
    const startX = 832 * U, endX = 1135 * U;
    const curX = t < 0.58 ? lerp(1360 * U, startX, enterK) : lerp(startX, endX, dragK);
    const curY = t < 0.58 ? lerp(620 * U, 396 * U, enterK) : lerp(396 * U, 402 * U, dragK);
    ctx.save();
    ctx.globalAlpha = exitAlpha;
    drawComicCursor(ctx, curX, curY, U, seg(t, 0.52, 0.85));
    ctx.restore();
  }

  // Horizontal Comic Drag Path Arrow above the slider during drag!
  if (t >= 0.60 && !afterDrop) {
    drawComicArrow(ctx, 845 * U, 270 * U, 1135 * U, 276 * U, dragK, U, {
      fill: PALETTE.yellow, headL: 36, headW: 24, shaftW: 11
    });
  }

  // ── POST-DROP CLIMAX ELEMENTS (t >= 2.20s) ──
  if (afterDrop) {
    // Chunky Comic Block Arrow pointing straight at the right-end slider handle!
    const arrP = ease.outBack(seg(dtDrop, 0.04, 0.36));
    drawComicArrow(ctx, 1395 * U, 338 * U, 1175 * U, 385 * U, arrP, U, {
      fill: PALETTE.yellow, headL: 62, headW: 42, shaftW: 18
    });

    // Starburst Onomatopoeia Climax #3: "SLIDE! -96.3%!"
    const stK = spring(dtDrop, { freq: 4.8, damp: 0.48 });
    drawStarburst(ctx, 1575 * U, 305 * U, 248 * U, 142 * U, 'SLIDE!', '-96.3%!', stK, -0.075, U, {
      fill: PALETTE.yellow, shadowColor: PALETTE.blue, botColor: PALETTE.blue, topSize: 54, botSize: 46
    });
  }

  // ── BOTTOM-RIGHT LIVE ROLLING COMIC RESULT CARD ──
  const resScale = afterDrop ? lerp(1.12, 1.0, spring(dtDrop, { freq: 4.2, damp: 0.58 })) : 1.0;
  ctx.save();
  ctx.translate(1555 * U, 735 * U);
  ctx.rotate(0.028);
  ctx.scale(resScale, resScale);

  ctx.fillStyle = afterDrop ? PALETTE.mint : PALETTE.ink;
  rrect(ctx, -238 * U + 12 * U, -142 * U + 12 * U, 476 * U, 284 * U, 14 * U);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  rrect(ctx, -238 * U, -142 * U, 476 * U, 284 * U, 14 * U);
  ctx.fill();
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 5 * U;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 ${19 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.blue;
  ctx.fillText(`LIVE · ${dailyWan}万 TOKEN/日`, -204 * U, -90 * U);

  ctx.font = `900 ${66 * U}px "JetBrains Mono", sans-serif`;
  ctx.fillStyle = afterDrop ? PALETTE.ink : PALETTE.muted;
  ctx.fillText(`¥${monthlySave.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`, -204 * U, -8 * U);

  ctx.font = `900 ${24 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = '#059669';
  ctx.fillText(afterDrop ? '每月实打实省下来！' : '正在向右拉动实时测算…', -204 * U, 44 * U);

  ctx.font = `700 ${17 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText('真实界面滑块联动 · 同口径无水分', -204 * U, 98 * U);
  ctx.restore();

  ctx.restore();
  ctx.restore();
}
