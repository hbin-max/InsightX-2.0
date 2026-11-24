// s02.js — Shot 2 (4.5s - 8.5s, local 0-4.0s): 真实选赛道点击 → 8 卡门禁并发 + 9+ 端口遥测大盘
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawSpeedLines, drawComicPhone, drawComicArrow, drawCurvedComicArrow,
  drawComicCursor, drawSpeechBubble, drawChapterTag, drawDiagonalWipe
} from './comic-kit.js';

export const S02_DUR = 4.0;

export function renderS02(ctx, t, W, H, U, IMGS) {
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  const switchT = 1.50;
  const isGate = t >= switchT;

  const [shx, shy] = shake(t, [0.90, 1.55, 2.35], 12 * U, 0.2);
  ctx.save();
  ctx.translate(shx, shy);

  // -----------------------------------------------------------------------
  // PHASE A (0.0s - 1.50s): Real Onboarding Track Picker + Comic Pointer Click
  // -----------------------------------------------------------------------
  if (!isGate) {
    // Camera zoom-in toward the clicked track button right before switching!
    const zoomK = ease.inExpo(seg(t, 1.10, switchT));
    const camScale = lerp(1.0, 1.38, zoomK);
    ctx.save();
    ctx.translate(1150 * U, 480 * U);
    ctx.scale(camScale, camScale);
    ctx.translate(-1150 * U, -480 * U);

    drawComicPage(ctx, W, H, U);

    // Left Slanted Yellow Panel
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [760 * U, 42 * U],
      [680 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.yellow,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 640 * U, 680 * U, 380 * U, t, U, { color: 'rgba(18,18,22,0.12)', slope: -0.1 });
      }
    });

    // Right White Action Panel
    drawPanel(ctx, [
      [796 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [716 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 1260 * U, 480 * U, t, U, { count: 40, rMin: 260, color: 'rgba(37,77,255,0.12)' });
      }
    });

    // Left Subtitle Copy
    const txtIn = spring(t + 0.05, { freq: 4.0, damp: 0.7 });
    ctx.save();
    ctx.translate(lerp(-140 * U, 0, txtIn), 0);
    drawChapterTag(ctx, 86 * U, 100 * U, 'STEP 01 // 真实实操 · 选赛道', U, { bg: PALETTE.ink, fg: PALETTE.yellow });

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${76 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('先选你的', 84 * U, 265 * U);
    ctx.fillStyle = PALETTE.blue;
    ctx.fillText('核心决策赛道', 84 * U, 360 * U);

    drawSpeechBubble(ctx, 84 * U, 435 * U, 550 * U, 200 * U, [
      { text: '新模型 / Token 经济学 / 播客原声', color: PALETTE.ink, size: 25 },
      { text: '点击「🔥 新模型发布与技术速递」', color: PALETTE.blue, size: 27 },
      { text: '秒级拉起全网商业情报雷达！', color: PALETTE.muted, size: 22 }
    ], U, { padY: 58, lineHeight: 50 });

    // Little comic checklist stamp at bottom-left
    ctx.fillStyle = PALETTE.ink;
    rrect(ctx, 84 * U, 710 * U, 390 * U, 58 * U, 10 * U);
    ctx.fill();
    ctx.font = `800 ${21 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('✓ 4 大核心商业赛道 · 一键直达', 108 * U, 747 * U);
    ctx.restore();

    // Panel-breaking REAL Onboarding Phone!
    const phIn = spring(t, { freq: 3.8, damp: 0.72 });
    const phX = 1230 * U;
    const phY = lerp(1180 * U, 540 * U, phIn);
    const clickK = seg(t, 0.85, 1.30);

    drawComicPhone(ctx, IMGS.onboarding, phX, phY, 910 * U, -0.02, U, {
      shadow: [18 * U, 18 * U],
      shadowColor: PALETTE.blue,
      overlayFn: (pw, ph) => {
        // Highlight box right on Button 1 ("🔥 新模型发布与技术速递") inside 01-onboarding.png!
        const boxK = spring(t - 0.35, { freq: 5.0, damp: 0.65 });
        if (boxK > 0.02) {
          const bx = -pw / 2 + pw * 0.055;
          const by = -ph / 2 + ph * 0.378;
          const bw = pw * 0.89;
          const bh = ph * 0.105;
          // Flash fill right on click
          if (clickK > 0 && clickK < 0.5) {
            ctx.fillStyle = `rgba(255, 212, 38, ${0.38 * (1 - clickK * 2)})`;
            rrect(ctx, bx, by, bw, bh, 16 * U);
            ctx.fill();
          }
          ctx.strokeStyle = PALETTE.yellow;
          ctx.lineWidth = 6 * U;
          rrect(ctx, bx, by, bw, bh, 16 * U);
          ctx.stroke();
        }
      }
    });

    // Chunky Comic Arrow pointing straight at the "新模型速递" button!
    const arrP = ease.outBack(seg(t, 0.25, 0.70));
    drawComicArrow(ctx, 645 * U, 515 * U, 995 * U, 478 * U, arrP, U, {
      fill: PALETTE.yellow, headL: 56, headW: 38, shaftW: 17
    });

    // Animated Comic Pointer Cursor moving onto button & clicking at t = 0.85s!
    const curMove = ease.outExpo(seg(t, 0.30, 0.82));
    const curX = lerp(1640 * U, 1280 * U, curMove);
    const curY = lerp(820 * U, 488 * U, curMove);
    drawComicCursor(ctx, curX, curY, U, clickK);

    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // PHASE B (1.50s - 4.00s): 8-Card Gatekeeper + 11-Channel Telemetry Dashboard!
  // -----------------------------------------------------------------------
  if (isGate) {
    const dt = t - switchT;
    drawComicPage(ctx, W, H, U, { dotColor: 'rgba(37, 77, 255, 0.09)' });

    // Left Slanted Cobalt Panel
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [635 * U, 42 * U],
      [560 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.blue,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 40 * U, 580 * U, 990 * U, t, U, { color: 'rgba(255,255,255,0.14)', slope: -0.08 });
      }
    });

    // Right Main White Stage Panel
    drawPanel(ctx, [
      [672 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [596 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 1020 * U, 520 * U, t, U, { count: 44, rMin: 240, color: 'rgba(18,18,22,0.12)' });
      }
    });

    // Left High-Contrast Typography
    const copyIn = spring(dt, { freq: 4.2, damp: 0.7 });
    ctx.save();
    ctx.translate(lerp(-160 * U, 0, copyIn), 0);
    drawChapterTag(ctx, 82 * U, 96 * U, 'STEP 02 // 门禁 + 遥测', U, { bg: PALETTE.yellow, fg: PALETTE.ink });

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${70 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('多端口并发', 80 * U, 255 * U);
    ctx.fillStyle = PALETTE.yellow;
    ctx.fillText('满 8 张解锁！', 80 * U, 345 * U);

    drawSpeechBubble(ctx, 80 * U, 410 * U, 465 * U, 210 * U, [
      { text: 'HuggingFace · HN · IT之家', color: PALETTE.ink, size: 24 },
      { text: 'GitHub · Token 雷达全并发', color: PALETTE.blue, size: 25 },
      { text: '严控 20 张缓冲上限，绝不卡顿', color: PALETTE.muted, size: 21 }
    ], U, { padY: 56, lineHeight: 52 });

    // Live animated comic counter box (6/8 -> 8/8 UNLOCKED!)
    const cntK = ease.outCubic(seg(dt, 0.25, 1.35));
    const cardsReady = Math.min(8, Math.round(lerp(3, 8, cntK)));
    const unlocked = cardsReady >= 8;
    ctx.fillStyle = unlocked ? PALETTE.mint : PALETTE.yellow;
    rrect(ctx, 80 * U, 685 * U, 450 * U, 120 * U, 16 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 5 * U;
    ctx.stroke();

    ctx.font = `900 ${46 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText(`${cardsReady} / 8 张就绪`, 108 * U, 748 * U);
    ctx.font = `800 ${19 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.fillText(unlocked ? '★ GATEKEEPER UNLOCKED · 流式放行！' : '► 并发扫描提炼高价值卡片中...', 108 * U, 786 * U);
    ctx.restore();

    // Primary Real Phone: 02-gatekeeper.png (8-Card Gatekeeper Overlay!)
    const ph1In = spring(dt, { freq: 3.8, damp: 0.72 });
    const ph1X = lerp(1100 * U, 920 * U, spring(dt - 0.75, { freq: 3.2, damp: 0.78 }));
    drawComicPhone(ctx, IMGS.gatekeeper, ph1X, 542 * U, 860 * U, -0.025, U, {
      shadow: [15 * U, 15 * U],
      shadowColor: PALETTE.yellow,
      scale: lerp(0.84, 1.0, ph1In),
      overlayFn: (pw, ph) => {
        // Highlight ring on Gatekeeper progress bar!
        ctx.strokeStyle = PALETTE.yellow;
        ctx.lineWidth = 5 * U;
        rrect(ctx, -pw / 2 + pw * 0.08, -ph / 2 + ph * 0.50, pw * 0.84, ph * 0.10, 12 * U);
        ctx.stroke();
      }
    });

    // Secondary Real Phone popping in at dt >= 0.75s: 04-telemetry.png (Full 11-Channel Telemetry Modal!)
    const ph2In = spring(dt - 0.72, { freq: 4.0, damp: 0.65 });
    if (dt >= 0.72) {
      const ph2X = lerp(2150 * U, 1525 * U, ph2In);
      drawComicPhone(ctx, IMGS.telemetry, ph2X, 548 * U, 845 * U, 0.028, U, {
        shadow: [16 * U, 16 * U],
        shadowColor: PALETTE.ink,
        overlayFn: (pw, ph) => {
          // Highlight box around live channel rows
          ctx.strokeStyle = PALETTE.mint;
          ctx.lineWidth = 5 * U;
          rrect(ctx, -pw / 2 + pw * 0.05, -ph / 2 + ph * 0.24, pw * 0.90, ph * 0.58, 14 * U);
          ctx.stroke();
        }
      });

      // Curved Comic Arrow connecting Gatekeeper top telemetry button -> Telemetry Dashboard!
      const arr2P = ease.outCubic(seg(dt, 0.90, 1.40));
      drawCurvedComicArrow(ctx, ph1X + 165 * U, 185 * U, 1230 * U, 85 * U, 1345 * U, 240 * U, arr2P, U, {
        color: PALETTE.yellow, lw: 9, headL: 28
      });

      // Comic floating callout sticker above Phone 2
      const tagK = spring(dt - 1.10, { freq: 4.4, damp: 0.62 });
      if (tagK > 0.02) {
        ctx.save();
        ctx.translate(1520 * U, 88 * U);
        ctx.scale(tagK, tagK);
        ctx.rotate(0.02);
        ctx.fillStyle = PALETTE.ink;
        rrect(ctx, -182 * U + 6 * U, -26 * U + 6 * U, 364 * U, 52 * U, 10 * U);
        ctx.fill();
        ctx.fillStyle = PALETTE.yellow;
        rrect(ctx, -182 * U, -26 * U, 364 * U, 52 * U, 10 * U);
        ctx.fill();
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 4 * U;
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${21 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = PALETTE.ink;
        ctx.fillText('🔍 点遥测 · 全渠道实时状态透明可见', 0, 1 * U);
        ctx.restore();
      }
    }

    // Chunky arrow from Left counter to Gatekeeper bar
    const arr1P = ease.outBack(seg(dt, 0.15, 0.55));
    drawComicArrow(ctx, 548 * U, 710 * U, ph1X - 180 * U, 610 * U, arr1P, U, {
      fill: PALETTE.yellow, headL: 50, headW: 34, shaftW: 15
    });
  }

  // Diagonal comic wipe across the transition at t = 1.32 -> 1.68s!
  drawDiagonalWipe(ctx, W, H, seg(t, 1.32, 1.68), PALETTE.ink, PALETTE.yellow);

  ctx.restore();
}
