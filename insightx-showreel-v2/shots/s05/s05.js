// s05.js — Shot 5 (17.5s - 21.5s, local 0-4.0s): 实操4 · 播客长音频 30s 原声解密胶囊
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawSpeedLines, drawComicPhone, drawCurvedComicArrow,
  drawComicCursor, drawSpeechBubble, drawChapterTag
} from './comic-kit.js';

export const S05_DUR = 4.0;

export function renderS05(ctx, t, W, H, U, IMGS) {
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  const clickT = 0.78;
  const playing = t >= clickT;
  const dtPlay = t - clickT;

  const [shx, shy] = shake(t, [clickT], 12 * U, 0.22);
  ctx.save();
  ctx.translate(shx, shy);

  drawComicPage(ctx, W, H, U, { dotColor: 'rgba(37, 77, 255, 0.09)' });

  // Left Slanted Cobalt Panel
  drawPanel(ctx, [
    [42 * U, 42 * U],
    [625 * U, 42 * U],
    [555 * U, 1038 * U],
    [42 * U, 1038 * U]
  ], U, {
    fill: PALETTE.blue,
    innerFn: () => {
      drawSpeedLines(ctx, 42 * U, 42 * U, 580 * U, 990 * U, t, U, { color: 'rgba(255,255,255,0.14)', slope: -0.07 });
    }
  });

  // Right Main Comic Action Stage
  drawPanel(ctx, [
    [662 * U, 42 * U],
    [1878 * U, 42 * U],
    [1878 * U, 1038 * U],
    [592 * U, 1038 * U]
  ], U, {
    fill: '#FFFFFF',
    innerFn: () => {
      drawConcentrationLines(ctx, 1020 * U, 420 * U, t, U, {
        count: playing ? 48 : 30,
        rMin: 250,
        color: playing ? 'rgba(37,77,255,0.14)' : 'rgba(18,18,22,0.09)'
      });
    }
  });

  // Left Headline Contrast: 120分钟 (crossed out!) -> 30秒原声!
  const leftIn = spring(t + 0.05, { freq: 4.0, damp: 0.72 });
  ctx.save();
  ctx.translate(lerp(-150 * U, 0, leftIn), 0);
  drawChapterTag(ctx, 82 * U, 96 * U, 'STEP 05 // 播客原声解密', U, { bg: PALETTE.yellow, fg: PALETTE.ink });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `900 ${52 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  ctx.fillText('120 分钟播客', 82 * U, 225 * U);

  // Bold Coral Strike-through across "120 分钟播客"
  const xK = ease.outCubic(seg(t, 0.25, 0.58));
  if (xK > 0.01) {
    ctx.strokeStyle = PALETTE.coral;
    ctx.lineWidth = 10 * U;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(76 * U, 206 * U);
    ctx.lineTo(lerp(76 * U, 430 * U, xK), 214 * U);
    ctx.stroke();
  }

  ctx.font = `900 ${86 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillStyle = PALETTE.yellow;
  ctx.fillText('30 秒原声！', 78 * U, 345 * U);

  drawSpeechBubble(ctx, 82 * U, 415 * U, 455 * U, 220 * U, [
    { text: '小宇宙 · 42章经硬核访谈', color: PALETTE.ink, size: 25 },
    { text: '直接锚定 28:15 关键原声，', color: PALETTE.blue, size: 25 },
    { text: '创始人真相一句话听懂！', color: PALETTE.muted, size: 23 }
  ], U, { padY: 56, lineHeight: 54 });

  // Bottom comic badge
  ctx.fillStyle = PALETTE.ink;
  rrect(ctx, 82 * U, 700 * U, 435 * U, 64 * U, 12 * U);
  ctx.fill();
  ctx.font = `900 ${21 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
  ctx.fillStyle = PALETTE.mint;
  ctx.fillText('⏱️ 精确时间戳定位 · 拒绝瞎总结', 106 * U, 740 * U);
  ctx.restore();

  // Center Panel-Breaking REAL Podcast Phone (`08-podcast-audio.png`)
  const phIn = spring(t, { freq: 3.8, damp: 0.72 });
  const phX = 910 * U, phY = 542 * U;
  drawComicPhone(ctx, IMGS.podcast, phX, phY, 880 * U, -0.022, U, {
    shadow: [16 * U, 16 * U],
    shadowColor: PALETTE.blue,
    scale: lerp(0.86, 1.0, phIn),
    overlayFn: (pw, ph) => {
      // Bold Yellow Highlight Box around the REAL audio-snippet-box!
      ctx.strokeStyle = playing ? PALETTE.mint : PALETTE.yellow;
      ctx.lineWidth = 6 * U;
      rrect(ctx, -pw / 2 + pw * 0.06, -ph / 2 + ph * 0.242, pw * 0.88, ph * 0.165, 14 * U);
      ctx.stroke();
    }
  });

  // Comic Pointer Cursor moving onto the real audio snippet box & clicking at t = 0.78s!
  const curIn = ease.outExpo(seg(t, 0.18, 0.72));
  const curFade = playing ? clamp(1 - (dtPlay - 0.5) / 0.4, 0, 1) : 1;
  if (curFade > 0.02) {
    ctx.save();
    ctx.globalAlpha = curFade;
    drawComicCursor(ctx, lerp(1360 * U, 920 * U, curIn), lerp(760 * U, 395 * U, curIn), U, seg(t, clickT, clickT + 0.45));
    ctx.restore();
  }

  // Right Pop-out Comic Soundwave Decryption Capsule (bursts out on click!)
  if (playing) {
    const popK = spring(dtPlay, { freq: 4.4, damp: 0.62 });
    const cxBox = 1525 * U, cyBox = 520 * U;
    const bw = 610 * U, bh = 640 * U;

    // Curved Comic Arrow from Real Snippet Box -> Pop-out Audio Capsule!
    drawCurvedComicArrow(ctx, phX + 185 * U, 395 * U, 1170 * U, 285 * U, cxBox - bw / 2 - 14 * U, 360 * U, ease.outCubic(seg(dtPlay, 0, 0.42)), U, {
      color: PALETTE.yellow, lw: 10, headL: 28
    });

    ctx.save();
    ctx.translate(cxBox, cyBox);
    ctx.rotate(0.018);
    ctx.scale(popK, popK);

    // Offset comic shadow
    ctx.fillStyle = PALETTE.ink;
    rrect(ctx, -bw / 2 + 12 * U, -bh / 2 + 12 * U, bw, bh, 20 * U);
    ctx.fill();

    // Main Card
    ctx.fillStyle = '#FFFFFF';
    rrect(ctx, -bw / 2, -bh / 2, bw, bh, 20 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 5 * U;
    ctx.stroke();

    // Top Dark Audio Header Bar
    ctx.fillStyle = PALETTE.ink;
    rrect(ctx, -bw / 2 + 24 * U, -bh / 2 + 24 * U, bw - 48 * U, 62 * U, 12 * U);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${19 * U}px "JetBrains Mono", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.yellow;
    ctx.fillText('▶ PLAYING · 28:15 — 28:45', -bw / 2 + 46 * U, -bh / 2 + 55 * U);
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.mint;
    ctx.fillText('30s 原声', bw / 2 - 46 * U, -bh / 2 + 55 * U);

    // 20 Vibrant Dancing Comic Soundwave Bars (ink-outlined, 128 BPM synced!)
    const barCount = 20;
    const waveW = bw - 68 * U;
    const barGap = waveW / barCount;
    const waveMidY = -bh / 2 + 185 * U;
    const barColors = [PALETTE.blue, PALETTE.yellow, PALETTE.mint, PALETTE.coral];

    for (let i = 0; i < barCount; i++) {
      // Rhythmic deterministic audio wave synced to 128 BPM (freq = 128/60 * PI * 2)
      const beatPulse = Math.abs(Math.sin(dtPlay * 6.7 + i * 0.45));
      const env = Math.sin(((i + 0.5) / barCount) * Math.PI); // taller in center
      const hBar = Math.max(16 * U, (24 + beatPulse * 104 * (0.45 + 0.55 * env)) * U);
      const bx = -waveW / 2 + i * barGap + 4 * U;
      const bwBar = barGap - 9 * U;
      ctx.fillStyle = barColors[i % barColors.length];
      rrect(ctx, bx, waveMidY - hBar / 2, bwBar, hBar, 6 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 3 * U;
      ctx.stroke();
    }

    // Audio Scrub Progress Track
    const prog = seg(dtPlay, 0, 3.2);
    const trY = -bh / 2 + 278 * U;
    ctx.fillStyle = '#E5E7EB';
    rrect(ctx, -waveW / 2, trY, waveW, 12 * U, 6 * U);
    ctx.fill();
    ctx.fillStyle = PALETTE.blue;
    rrect(ctx, -waveW / 2, trY, Math.max(12 * U, waveW * prog), 12 * U, 6 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 3 * U;
    rrect(ctx, -waveW / 2, trY, waveW, 12 * U, 6 * U);
    ctx.stroke();

    // Real Founder Quote from 08-podcast-audio.png in bold comic box!
    const qY = -bh / 2 + 322 * U;
    ctx.fillStyle = PALETTE.paper;
    rrect(ctx, -bw / 2 + 28 * U, qY, bw - 56 * U, 224 * U, 14 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 4 * U;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${24 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('“客户根本不在乎你用 70B 还是 8B，', -bw / 2 + 48 * U, qY + 52 * U);
    ctx.fillText(' 只看能不能帮他省掉 3 个外包，', -bw / 2 + 48 * U, qY + 96 * U);
    ctx.fillStyle = PALETTE.blue;
    ctx.fillText(' 在月底报表兑现真实净利润增量！”', -bw / 2 + 48 * U, qY + 140 * U);

    ctx.font = `800 ${17 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText('— B2B 独角兽创始人 / 小宇宙 · 42章经现场原声', -bw / 2 + 48 * U, qY + 194 * U);

    // Bottom Yellow Highlight Stamp
    ctx.fillStyle = PALETTE.yellow;
    rrect(ctx, -bw / 2 + 28 * U, bh / 2 - 70 * U, 330 * U, 46 * U, 10 * U);
    ctx.fill();
    ctx.strokeStyle = PALETTE.ink;
    ctx.lineWidth = 3.5 * U;
    ctx.stroke();
    ctx.font = `900 ${19 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('🎧 原声可核验 · 商业洞察不失真', -bw / 2 + 46 * U, bh / 2 - 40 * U);

    ctx.restore();
  }

  ctx.restore();
}
