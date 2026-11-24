// s01.js — Shot 1 (0.0s - 4.5s): 痛点爆破引入 → CUT! 斩断噪音 → InsightX 2.0 破框亮相
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawSpeedLines, drawComicPhone, drawComicArrow, drawSpeechBubble,
  drawStarburst, drawChapterTag
} from './comic-kit.js';

export const S01_DUR = 4.5;

const PAIN_CARDS = [
  {
    tIn: 0.12, x: 980, y: 245, w: 680, h: 175, rot: -0.045,
    tag: 'PR 营销水稿 #01',
    title: '“史诗级颠覆！某神秘模型超越一切”',
    sub: '无开源权重 · 无真实跑分 · 满屏情绪标题党',
    bg: '#FFFFFF', accent: PALETTE.coral
  },
  {
    tIn: 0.65, x: 1090, y: 500, w: 690, h: 175, rot: 0.038,
    tag: '信息黑盒 #02',
    title: '“2 小时硬核播客，干货藏在第 28 分钟”',
    sub: '没时间从头听到尾 · 关键成本内幕全被埋没',
    bg: '#FFFFFF', accent: PALETTE.coral
  },
  {
    tIn: 1.18, x: 960, y: 765, w: 710, h: 175, rot: -0.025,
    tag: '算账盲区 #03',
    title: '“API 官宣直降 97%，到底每月省多少？”',
    sub: '百万/千 Token 单位混杂 · 老板要 ROI 根本拍脑袋',
    bg: '#FFFFFF', accent: PALETTE.coral
  }
];

export function renderS01(ctx, t, W, H, U, IMGS) {
  const cutT = 3.15;
  const afterCut = t >= cutT;

  // Always paint clean base before any camera shake so edges never bleed previous frames
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  // Camera shake on pain slams + big CUT! impact
  const [shx, shy] = shake(t, [0.18, 0.72, 1.25, 3.18], 16 * U, 0.24);
  ctx.save();
  ctx.translate(shx, shy);

  // -----------------------------------------------------------------------
  // PHASE A (0.0s - 3.15s): Pain barrage & rising noise tension
  // -----------------------------------------------------------------------
  if (!afterCut) {
    // Subtle push-in tension from 1.0 -> 1.045
    const push = lerp(1.0, 1.045, ease.inOutSine(seg(t, 0, cutT)));
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(push, push);
    ctx.translate(-W / 2, -H / 2);

    drawComicPage(ctx, W, H, U, { dotColor: 'rgba(255, 59, 92, 0.09)' });

    // Left slanted bold Yellow Warning Panel (slides in immediately from frame 0!)
    const p1In = spring(t + 0.06, { freq: 3.6, damp: 0.72 });
    const p1OffX = lerp(-680 * U, 0, p1In);
    ctx.save();
    ctx.translate(p1OffX, 0);
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [690 * U, 42 * U],
      [612 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.yellow,
      shadow: [12 * U, 12 * U],
      shadowColor: PALETTE.ink,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 680 * U, 620 * U, 340 * U, t, U, { color: 'rgba(18,18,22,0.12)', slope: -0.15 });
      }
    });

    drawChapterTag(ctx, 84 * U, 92 * U, 'PROBLEM // 商业决策痛点', U, { bg: PALETTE.ink, fg: PALETTE.yellow });

    // Giant kinetic comic typography (left-aligned, stacked tight)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const w1 = spring(t - 0.04, { freq: 4.0, damp: 0.68 });
    ctx.save();
    ctx.translate(0, (1 - w1) * 40 * U);
    ctx.font = `900 ${78 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('每天刷 AI', 82 * U, 265 * U);
    ctx.restore();

    // Giant "90%" number slamming in
    const n90 = spring(t - 0.22, { freq: 3.8, damp: 0.58 });
    ctx.save();
    ctx.translate(82 * U, 445 * U);
    ctx.scale(lerp(1.5, 1, n90), lerp(1.5, 1, n90));
    ctx.font = `900 ${168 * U}px "JetBrains Mono", "Arial Black", sans-serif`;
    ctx.fillStyle = PALETTE.coral;
    ctx.lineWidth = 10 * U;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = PALETTE.ink;
    ctx.strokeText('90%', 0, 0);
    ctx.fillText('90%', 0, 0);
    ctx.restore();

    ctx.font = `900 ${74 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('都是噪音！', 82 * U, 555 * U);

    // Speech bubble question at bottom-left
    const bubK = spring(t - 0.9, { freq: 3.6, damp: 0.68 });
    if (bubK > 0.02) {
      ctx.save();
      ctx.translate(325 * U, 795 * U);
      ctx.scale(bubK, bubK);
      drawSpeechBubble(ctx, -245 * U, -105 * U, 490 * U, 175 * U, [
        { text: '“到底哪 10% 能真正', color: PALETTE.ink, size: 28 },
        { text: ' 拿去拍板、省钱、落地？”', color: PALETTE.blue, size: 28 }
      ], U, { padY: 64, lineHeight: 48 });
      ctx.restore();
    }
    ctx.restore();

    // Right Slanted White Noise Panel
    drawPanel(ctx, [
      [726 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [648 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 1300 * U, 540 * U, t, U, { count: 36, rMin: 340, color: 'rgba(255, 59, 92, 0.12)' });
      }
    });

    // Slam in 3 Pain Cards staggered on beats
    PAIN_CARDS.forEach((pc, idx) => {
      const k = spring(t - pc.tIn, { freq: 4.4, damp: 0.62 });
      if (t < pc.tIn) return;
      const dropY = lerp(-240 * U, 0, k);
      const sc = lerp(1.18, 1.0, k);
      ctx.save();
      ctx.translate((pc.x + pc.w / 2) * U, (pc.y + pc.h / 2) * U + dropY);
      ctx.rotate(pc.rot);
      ctx.scale(sc, sc);

      // Hard comic shadow
      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, -pc.w / 2 * U + 10 * U, -pc.h / 2 * U + 10 * U, pc.w * U, pc.h * U, 16 * U);
      ctx.fill();

      // Card body
      ctx.fillStyle = pc.bg;
      rrect(ctx, -pc.w / 2 * U, -pc.h / 2 * U, pc.w * U, pc.h * U, 16 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5 * U;
      ctx.stroke();

      // Coral tag pill
      ctx.fillStyle = pc.accent;
      rrect(ctx, -pc.w / 2 * U + 24 * U, -pc.h / 2 * U + 20 * U, 200 * U, 34 * U, 6 * U);
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.font = `900 ${15 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(pc.tag, -pc.w / 2 * U + 38 * U, -pc.h / 2 * U + 43 * U);

      ctx.font = `900 ${28 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText(pc.title, -pc.w / 2 * U + 24 * U, -pc.h / 2 * U + 98 * U);

      ctx.font = `700 ${19 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.muted;
      ctx.fillText(pc.sub, -pc.w / 2 * U + 24 * U, -pc.h / 2 * U + 142 * U);

      // Hand-drawn bold coral strike-through X at t > 1.75 + idx*0.22
      const xK = ease.outCubic(seg(t, 1.75 + idx * 0.22, 2.05 + idx * 0.22));
      if (xK > 0.01) {
        ctx.strokeStyle = PALETTE.coral;
        ctx.lineWidth = 10 * U;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const x0 = -pc.w / 2 * U + 30 * U, x1 = pc.w / 2 * U - 30 * U;
        ctx.moveTo(x0, -10 * U);
        ctx.lineTo(lerp(x0, x1, xK), 22 * U);
        ctx.stroke();
      }
      ctx.restore();
    });

    // Anticipation slash glow line right before CUT! (2.85s - 3.15s)
    const preSlash = seg(t, 2.85, cutT);
    if (preSlash > 0) {
      ctx.save();
      ctx.strokeStyle = PALETTE.yellow;
      ctx.lineWidth = lerp(4, 34, ease.inQuad(preSlash)) * U;
      ctx.beginPath();
      ctx.moveTo(1920 * U, 0);
      ctx.lineTo(lerp(1920 * U, 0, ease.outExpo(preSlash)), lerp(0, 1080 * U, ease.outExpo(preSlash)));
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // -----------------------------------------------------------------------
  // PHASE B (3.15s - 4.50s): CUT! Slash Reveal -> Real InsightX 2.0 Hero!
  // -----------------------------------------------------------------------
  if (afterCut) {
    const dt = t - cutT;
    // Brief 2-frame invert impact flash right on the cut (dt < 0.08s)
    const flash = dt < 0.07;
    drawComicPage(ctx, W, H, U, { invert: flash, dotColor: 'rgba(37, 77, 255, 0.1)' });

    // Dynamic Cobalt & White split action panels
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: flash ? PALETTE.ink : '#FFFFFF',
      innerFn: () => {
        // Cobalt slanted energy band across middle
        ctx.fillStyle = PALETTE.blue;
        ctx.beginPath();
        ctx.moveTo(0, 560 * U);
        ctx.lineTo(W, 380 * U);
        ctx.lineTo(W, 820 * U);
        ctx.lineTo(0, 1000 * U);
        ctx.closePath();
        ctx.fill();
        drawConcentrationLines(ctx, 1180 * U, 540 * U, t, U, { count: 52, rMin: 240, color: flash ? 'rgba(255,212,38,0.35)' : 'rgba(18,18,22,0.16)' });
      }
    });

    // Left bold reveal typography
    const revIn = spring(dt, { freq: 4.2, damp: 0.68 });
    ctx.save();
    ctx.translate(lerp(-180 * U, 0, revIn), 0);
    drawChapterTag(ctx, 96 * U, 108 * U, 'MEET YOUR CO-PILOT', U, { bg: PALETTE.yellow, fg: PALETTE.ink });

    ctx.textAlign = 'left';
    ctx.font = `900 ${96 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.lineWidth = 10 * U;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = PALETTE.ink;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('InsightX 2.0', 92 * U, 265 * U);

    // Highlight yellow banner under tagline
    ctx.fillStyle = PALETTE.yellow;
    rrect(ctx, 92 * U, 304 * U, 640 * U, 78 * U, 12 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 5 * U;
    ctx.stroke();

    ctx.font = `900 ${42 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('AI 商业决策参谋 · 只留 10% 真相', 114 * U, 358 * U);

    // 3 quick value chips popping on staggered beats
    const pills = ['⚡ 9大端口并发', '🎚️ 实时 ROI 算账', '🎙️ 30s 原声解密'];
    pills.forEach((txt, i) => {
      const pk = spring(dt - 0.18 - i * 0.1, { freq: 4.5, damp: 0.6 });
      if (pk <= 0.02) return;
      ctx.save();
      ctx.translate(92 * U + i * 246 * U, 448 * U);
      ctx.scale(pk, pk);
      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, 5 * U, 5 * U, 228 * U, 52 * U, 10 * U);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      rrect(ctx, 0, 0, 228 * U, 52 * U, 10 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 4 * U;
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.font = `900 ${20 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText(txt, 114 * U, 34 * U);
      ctx.restore();
    });

    // Bottom speech bubble inviting into real live walkthrough
    drawSpeechBubble(ctx, 96 * U, 675 * U, 650 * U, 190 * U, [
      { text: '别听吹牛，直接看真实界面怎么跑！', color: PALETTE.ink, size: 30 },
      { text: '👇 接下来 25 秒，全程实操演示', color: PALETTE.blue, size: 28 }
    ], U, { padY: 72, lineHeight: 58, shadow: [12 * U, 12 * U] });
    ctx.restore();

    // Panel-breaking REAL InsightX 2.0 Phone bursting in from bottom-right!
    const phoneIn = spring(dt - 0.04, { freq: 3.6, damp: 0.66 });
    const phoneY = lerp(1280 * U, 550 * U, phoneIn);
    drawComicPhone(ctx, IMGS.model, 1270 * U, phoneY, 880 * U, 0.035, U, {
      shadow: [18 * U, 18 * U],
      shadowColor: PALETTE.yellow,
      scale: lerp(0.72, 1.0, phoneIn)
    });

    // Chunky Comic Arrow pointing straight from subtitle to the real phone!
    const arrP = ease.outBack(seg(dt, 0.25, 0.65));
    drawComicArrow(ctx, 765 * U, 755 * U, 995 * U, 690 * U, arrP, U, {
      fill: PALETTE.yellow, headL: 58, headW: 40, shaftW: 18
    });

    // Starburst "CUT!" badge right on top-right
    const burstK = spring(dt, { freq: 4.5, damp: 0.52 });
    drawStarburst(ctx, 1660 * U, 245 * U, 195 * U, 115 * U, 'CUT!', '噪音清零', burstK, -0.1, U, {
      fill: PALETTE.yellow, shadowColor: PALETTE.coral, botColor: PALETTE.coral, topSize: 58, botSize: 34
    });
  }

  ctx.restore();
}
