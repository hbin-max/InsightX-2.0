// s03.js — Shot 3 (8.5s - 13.0s, local 0-4.5s): Bento 2x2 参数特写 → 左滑 DISCARD → 右滑 SWIPE! SAVED!
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawSpeedLines, drawComicPhone, drawComicArrow, drawCurvedComicArrow,
  drawComicCursor, drawSpeechBubble, drawStarburst, drawChapterTag
} from './comic-kit.js';

export const S03_DUR = 4.5;

export function renderS03(ctx, t, W, H, U, IMGS) {
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  const [shx, shy] = shake(t, [1.88, 2.95], 15 * U, 0.22);
  ctx.save();
  ctx.translate(shx, shy);

  // -----------------------------------------------------------------------
  // PHASE A (0.0s - 1.85s): Bento 2x2 Real UI + 2x Magnified Comic Callout!
  // -----------------------------------------------------------------------
  if (t < 1.85) {
    drawComicPage(ctx, W, H, U);

    // Left Slanted Yellow Info Panel
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [620 * U, 42 * U],
      [555 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.yellow,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 650 * U, 560 * U, 370 * U, t, U, { color: 'rgba(18,18,22,0.1)', slope: -0.1 });
      }
    });

    // Right Wide Comic Stage
    drawPanel(ctx, [
      [656 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [590 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 980 * U, 380 * U, t, U, { count: 42, rMin: 260, color: 'rgba(37,77,255,0.1)' });
      }
    });

    // Left Copy
    const inK = spring(t + 0.04, { freq: 4.2, damp: 0.72 });
    ctx.save();
    ctx.translate(lerp(-140 * U, 0, inK), 0);
    drawChapterTag(ctx, 82 * U, 96 * U, 'STEP 03 // BENTO 2×2 参数格', U, { bg: PALETTE.ink, fg: PALETTE.yellow });

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${72 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('拒绝千字长文', 78 * U, 260 * U);
    ctx.fillStyle = PALETTE.blue;
    ctx.fillText('4 格看穿硬指标', 78 * U, 350 * U);

    drawSpeechBubble(ctx, 78 * U, 420 * U, 455 * U, 225 * U, [
      { text: '架构 / 上下文 / 商用协议 / 跑分', color: PALETTE.ink, size: 24 },
      { text: '全部结构化抽提成 Bento 卡片，', color: PALETTE.muted, size: 22 },
      { text: '1 秒判断值不值得跟进！', color: PALETTE.blue, size: 26 }
    ], U, { padY: 56, lineHeight: 54 });
    ctx.restore();

    // Center Real Model Bento Phone!
    const phIn = spring(t, { freq: 3.8, damp: 0.72 });
    const phX = 925 * U, phY = 540 * U;
    drawComicPhone(ctx, IMGS.model, phX, phY, 880 * U, -0.02, U, {
      shadow: [16 * U, 16 * U],
      shadowColor: PALETTE.blue,
      scale: lerp(0.88, 1.0, phIn),
      overlayFn: (pw, ph) => {
        // Yellow comic highlight box around the REAL 2x2 Bento grid in 03-feed-model.png!
        ctx.strokeStyle = PALETTE.yellow;
        ctx.lineWidth = 6 * U;
        rrect(ctx, -pw / 2 + pw * 0.06, -ph / 2 + ph * 0.252, pw * 0.88, ph * 0.135, 14 * U);
        ctx.stroke();
      }
    });

    // Right 2× Magnified Comic Zoom Box of the REAL Bento 2x2 Grid!
    const zoomIn = spring(t - 0.18, { freq: 4.0, damp: 0.68 });
    const zx = 1235 * U, zy = 185 * U, zw = 600 * U, zh = 670 * U;
    if (zoomIn > 0.02) {
      ctx.save();
      ctx.translate(zx + zw / 2, zy + zh / 2);
      ctx.scale(zoomIn, zoomIn);
      ctx.rotate(0.015);

      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, -zw / 2 + 12 * U, -zh / 2 + 12 * U, zw, zh, 18 * U);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      rrect(ctx, -zw / 2, -zh / 2, zw, zh, 18 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5 * U;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = `900 ${19 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.blue;
      ctx.fillText('🔍 真实 Bento 2×2 局部 2× 放大', -zw / 2 + 28 * U, -zh / 2 + 46 * U);

      // Crop REAL 2x2 Bento grid from IMGS.model!
      const sx = IMGS.model.width * 0.06, sy = IMGS.model.height * 0.250;
      const sw = IMGS.model.width * 0.88, sh = IMGS.model.height * 0.140;
      const dw = zw - 56 * U, dh = dw * (sh / sw);
      ctx.save();
      rrect(ctx, -dw / 2, -zh / 2 + 72 * U, dw, dh, 14 * U);
      ctx.clip();
      ctx.drawImage(IMGS.model, sx, sy, sw, sh, -dw / 2, -zh / 2 + 72 * U, dw, dh);
      ctx.restore();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 4 * U;
      rrect(ctx, -dw / 2, -zh / 2 + 72 * U, dw, dh, 14 * U);
      ctx.stroke();

      // 4 Staggered Comic Spec Pills below magnified grid
      const tags = [
        ['01 架构规格', '端云协同微架构', PALETTE.blue],
        ['02 上下文长度', '实时低延时音频流', '#0EA5E9'],
        ['03 商用协议', '商业消费硬件', PALETTE.mint],
        ['04 跑分评测', '语音延迟 < 300ms', PALETTE.coral]
      ];
      tags.forEach(([k, v, col], idx) => {
        const tk = spring(t - (0.38 + idx * 0.24), { freq: 4.8, damp: 0.6 });
        if (tk <= 0.02) return;
        const cCol = idx % 2, cRow = Math.floor(idx / 2);
        const bx = -dw / 2 + cCol * (dw / 2 + 8 * U);
        const by = -zh / 2 + 72 * U + dh + 28 * U + cRow * 145 * U;
        const bw = dw / 2 - 8 * U, bh = 122 * U;
        ctx.save();
        ctx.translate(bx + bw / 2, by + bh / 2);
        ctx.scale(tk, tk);
        ctx.fillStyle = PALETTE.paper;
        rrect(ctx, -bw / 2, -bh / 2, bw, bh, 12 * U);
        ctx.fill();
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 4 * U;
        ctx.stroke();
        ctx.fillStyle = col;
        rrect(ctx, -bw / 2 + 14 * U, -bh / 2 + 14 * U, 148 * U, 30 * U, 6 * U);
        ctx.fill();
        ctx.textAlign = 'left';
        ctx.font = `900 ${14 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(k, -bw / 2 + 24 * U, -bh / 2 + 34 * U);
        ctx.font = `900 ${23 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = PALETTE.ink;
        ctx.fillText(v, -bw / 2 + 16 * U, -bh / 2 + 88 * U);
        ctx.restore();
      });
      ctx.restore();
    }

    // Curved comic arrow connecting Phone Bento Grid -> Right 2x Magnifier!
    drawCurvedComicArrow(ctx, phX + 185 * U, 350 * U, 1175 * U, 240 * U, zx - 10 * U, 330 * U, ease.outCubic(seg(t, 0.2, 0.65)), U, {
      color: PALETTE.yellow, lw: 9, headL: 28
    });
  }

  // -----------------------------------------------------------------------
  // PHASE B (1.85s - 2.92s): Swipe LEFT -> DISCARD PR Noise!
  // -----------------------------------------------------------------------
  else if (t < 2.92) {
    const dt = t - 1.85;
    drawComicPage(ctx, W, H, U, { dotColor: 'rgba(255, 59, 92, 0.12)' });

    // Left Slanted Coral Panel
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [720 * U, 42 * U],
      [640 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.coral,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 42 * U, 680 * U, 990 * U, t, U, { color: 'rgba(255,255,255,0.2)', slope: 0.06 });
      }
    });

    // Right Stage Panel
    drawPanel(ctx, [
      [756 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [676 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawSpeedLines(ctx, 700 * U, 140 * U, 1140 * U, 780 * U, t, U, { color: 'rgba(255, 59, 92, 0.16)', count: 28 });
      }
    });

    drawChapterTag(ctx, 84 * U, 102 * U, 'GESTURE 01 // 极速淘汰', U, { bg: PALETTE.ink, fg: '#FFFFFF' });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${82 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('← 左滑忽略', 82 * U, 280 * U);
    ctx.fillStyle = PALETTE.yellow;
    ctx.fillText('废话直接飞走', 82 * U, 380 * U);

    drawSpeechBubble(ctx, 82 * U, 455 * U, 520 * U, 185 * U, [
      { text: '像刷 Tinder 一样处理商业情报：', color: PALETTE.ink, size: 25 },
      { text: '不相关的杂讯，向左一划秒删！', color: PALETTE.coral, size: 27 }
    ], U, { padY: 66, lineHeight: 54 });

    // Real Phone showing actual Left Swipe + Red DISCARD Stamp!
    const dragK = ease.outCubic(seg(dt, 0.05, 0.78));
    const phX = lerp(1360 * U, 1245 * U, dragK);
    drawComicPhone(ctx, IMGS.swipeLeft, phX, 540 * U, 900 * U, lerp(0.0, -0.045, dragK), U, {
      shadow: [18 * U, 18 * U],
      shadowColor: PALETTE.coral
    });

    // Big sweeping Left Curved Swipe Arrow + Pointer Cursor!
    drawCurvedComicArrow(ctx, 1520 * U, 590 * U, 1270 * U, 470 * U, 955 * U, 560 * U, dragK, U, {
      color: PALETTE.coral, lw: 12, headL: 34
    });
    drawComicCursor(ctx, lerp(1460 * U, 1110 * U, dragK), lerp(575 * U, 545 * U, dragK), U, 0.25);
  }

  // -----------------------------------------------------------------------
  // PHASE C (2.92s - 4.50s): Swipe RIGHT -> SWIPE! SAVED! Into Vault!
  // -----------------------------------------------------------------------
  else {
    const dt = t - 2.92;
    const flash = dt < 0.06;
    drawComicPage(ctx, W, H, U, { invert: flash, dotColor: 'rgba(0, 200, 133, 0.14)' });

    // Left Slanted Emerald Panel
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [690 * U, 42 * U],
      [615 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.mint,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 42 * U, 640 * U, 990 * U, t, U, { color: 'rgba(18,18,22,0.12)', slope: -0.08 });
      }
    });

    // Right Action Stage
    drawPanel(ctx, [
      [726 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [650 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 1180 * U, 440 * U, t, U, { count: 48, rMin: 240, color: 'rgba(0, 200, 133, 0.18)' });
      }
    });

    drawChapterTag(ctx, 82 * U, 100 * U, 'GESTURE 02 // 收藏入库', U, { bg: PALETTE.ink, fg: PALETTE.yellow });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${80 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('右滑收藏 →', 80 * U, 275 * U);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('P0 直入智库', 80 * U, 372 * U);

    drawSpeechBubble(ctx, 80 * U, 445 * U, 505 * U, 200 * U, [
      { text: '看到高价值商业机会，', color: PALETTE.ink, size: 26 },
      { text: '向右一滑盖章 SAVED！', color: PALETTE.mint, size: 28 },
      { text: '自动归档进专属决策智库。', color: PALETTE.muted, size: 22 }
    ], U, { padY: 58, lineHeight: 52 });

    // Real Phone showing actual Right Swipe + Green SAVED Stamp!
    const swipeK = spring(dt, { freq: 4.0, damp: 0.62 });
    const phX = lerp(960 * U, 1110 * U, swipeK);
    drawComicPhone(ctx, IMGS.swipeRight, phX, 542 * U, 900 * U, lerp(0, 0.045, swipeK), U, {
      shadow: [18 * U, 18 * U],
      shadowColor: PALETTE.mint
    });

    // Big Sweeping Right Curved Comic Arrow + Cursor!
    drawCurvedComicArrow(ctx, 830 * U, 560 * U, 1130 * U, 440 * U, 1410 * U, 550 * U, ease.outCubic(seg(dt, 0.05, 0.65)), U, {
      color: PALETTE.yellow, lw: 12, headL: 34
    });
    drawComicCursor(ctx, lerp(960 * U, 1280 * U, ease.outCubic(seg(dt, 0.05, 0.65))), 515 * U, U, seg(dt, 0.55, 0.95));

    // Starburst "SWIPE! SAVED!" Comic Climax #2!
    const stK = spring(dt - 0.12, { freq: 4.5, damp: 0.50 });
    drawStarburst(ctx, 1625 * U, 310 * U, 210 * U, 120 * U, 'SWIPE!', 'SAVED ✓', stK, 0.07, U, {
      fill: PALETTE.yellow, shadowColor: PALETTE.mint, botColor: PALETTE.ink, topSize: 54, botSize: 40
    });
  }

  ctx.restore();
}
