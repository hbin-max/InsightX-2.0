// s06.js — Shot 6 (21.5s - 30.0s, local 0-8.5s): 2D态势矩阵 → 智库一键导出MD → 价值升华落版 (含1.6s终极定格)
import { clamp, lerp, ease, spring, seg, shake } from './motion.js';
import {
  PALETTE, rrect, drawComicPage, drawPanel, drawConcentrationLines,
  drawSpeedLines, drawComicPhone, drawComicArrow, drawCurvedComicArrow,
  drawComicCursor, drawSpeechBubble, drawChapterTag, drawDiagonalWipe
} from './comic-kit.js';

export const S06_DUR = 8.5;

export function renderS06(ctx, t, W, H, U, IMGS) {
  const vaultT = 2.05;
  const outroT = 4.10; // Global 25.60s DROP -> Finale Resolve!
  const holdStart = 6.90; // Global 28.40s -> Rock-solid 1.6s hold!

  const dtOutro = t - outroT;
  const flash = t >= outroT && dtOutro < 0.06;

  ctx.fillStyle = flash ? PALETTE.ink : PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  // Stop any shake before holdStart so final hold is 100% still
  const [shx, shy] = t < holdStart ? shake(t, [0.35, 2.55, outroT], 14 * U, 0.22) : [0, 0];
  ctx.save();
  ctx.translate(shx, shy);

  // -----------------------------------------------------------------------
  // PHASE A (0.0s - 2.05s): 2D Matrix Radar + Bottom Dock Pointer!
  // -----------------------------------------------------------------------
  if (t < vaultT) {
    drawComicPage(ctx, W, H, U);

    drawPanel(ctx, [
      [42 * U, 42 * U],
      [635 * U, 42 * U],
      [565 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.yellow,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 640 * U, 580 * U, 380 * U, t, U, { color: 'rgba(18,18,22,0.1)', slope: -0.1 });
      }
    });

    drawPanel(ctx, [
      [672 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [602 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 960 * U, 340 * U, t, U, { count: 40, rMin: 240, color: 'rgba(0, 200, 133, 0.14)' });
      }
    });

    const inK = spring(t + 0.04, { freq: 4.2, damp: 0.72 });
    ctx.save();
    ctx.translate(lerp(-140 * U, 0, inK), 0);
    drawChapterTag(ctx, 82 * U, 96 * U, 'STEP 06 // 2D 战略态势矩阵', U, { bg: PALETTE.ink, fg: PALETTE.yellow });

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${72 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('全局一图看懂', 80 * U, 260 * U);
    ctx.fillStyle = PALETTE.blue;
    ctx.fillText('锁定高 ROI 区', 80 * U, 350 * U);

    drawSpeechBubble(ctx, 80 * U, 420 * U, 460 * U, 210 * U, [
      { text: '点击底部「📊 态势矩阵」，', color: PALETTE.ink, size: 25 },
      { text: '横轴看落地阻碍 · 纵轴看商业价值，', color: PALETTE.muted, size: 22 },
      { text: '绿点区直接告诉你先干哪件！', color: PALETTE.blue, size: 25 }
    ], U, { padY: 56, lineHeight: 54 });
    ctx.restore();

    // Real 09-matrix.png Phone
    const phX = 945 * U, phY = 540 * U;
    drawComicPhone(ctx, IMGS.matrix, phX, phY, 880 * U, -0.02, U, {
      shadow: [16 * U, 16 * U],
      shadowColor: PALETTE.mint,
      overlayFn: (pw, ph) => {
        // Target circle on the real emerald High Value / Low Friction cluster!
        const pulse = 1 + 0.06 * Math.sin(t * 14);
        ctx.save();
        ctx.translate(-pw / 2 + pw * 0.36, -ph / 2 + ph * 0.21);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = PALETTE.yellow;
        ctx.lineWidth = 6 * U;
        ctx.setLineDash([12 * U, 6 * U]);
        ctx.beginPath(); ctx.arc(0, 0, 74 * U, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Highlight box on bottom dock "态势矩阵" tab!
        ctx.strokeStyle = PALETTE.yellow;
        ctx.lineWidth = 5 * U;
        rrect(ctx, -pw * 0.16, ph / 2 - ph * 0.088, pw * 0.32, ph * 0.072, 12 * U);
        ctx.stroke();
      }
    });

    // Comic pointer clicking the bottom Dock "态势矩阵" tab!
    drawComicCursor(ctx, 965 * U, 935 * U, U, seg(t, 0.22, 0.65));

    // Right Comic Callout Card explaining the 2D Radar Sweet Spot!
    const cardK = spring(t - 0.35, { freq: 4.2, damp: 0.65 });
    if (cardK > 0.02) {
      drawCurvedComicArrow(ctx, phX + 20 * U, 285 * U, 1140 * U, 175 * U, 1270 * U, 290 * U, ease.outCubic(seg(t, 0.35, 0.80)), U, {
        color: PALETTE.yellow, lw: 10, headL: 28
      });

      ctx.save();
      ctx.translate(1555 * U, 445 * U);
      ctx.rotate(0.02);
      ctx.scale(cardK, cardK);
      const cw = 540 * U, ch = 415 * U;
      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, -cw / 2 + 12 * U, -ch / 2 + 12 * U, cw, ch, 18 * U);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      rrect(ctx, -cw / 2, -ch / 2, cw, ch, 18 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5 * U;
      ctx.stroke();

      drawChapterTag(ctx, -cw / 2 + 26 * U, -ch / 2 + 26 * U, '★ HIGH VALUE / LOW FRICTION', U, { bg: PALETTE.mint, fg: PALETTE.ink });

      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `900 ${32 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('点选任意散点节点', -cw / 2 + 28 * U, -ch / 2 + 132 * U);
      ctx.fillStyle = PALETTE.blue;
      ctx.fillText('下方立显 ROI 与落地建议', -cw / 2 + 28 * U, -ch / 2 + 180 * U);

      ctx.fillStyle = PALETTE.paper;
      rrect(ctx, -cw / 2 + 28 * U, -ch / 2 + 215 * U, cw - 56 * U, 165 * U, 12 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 3.5 * U;
      ctx.stroke();

      ctx.font = `800 ${21 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = '#059669';
      ctx.fillText('● 已选：小宇宙 · 42章经专访', -cw / 2 + 46 * U, -ch / 2 + 260 * U);
      ctx.font = `700 ${19 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('决策周期：4个月 ➔ 压缩至 2周', -cw / 2 + 46 * U, -ch / 2 + 305 * U);
      ctx.fillText('年终留存：92% · 立即改造定价页！', -cw / 2 + 46 * U, -ch / 2 + 345 * U);
      ctx.restore();
    }
  }

  // -----------------------------------------------------------------------
  // PHASE B (2.05s - 4.10s): Vault Archive + 1-Click Export Markdown Report!
  // -----------------------------------------------------------------------
  else if (t < outroT) {
    const dt = t - vaultT;
    drawComicPage(ctx, W, H, U, { dotColor: 'rgba(0, 200, 133, 0.12)' });

    drawPanel(ctx, [
      [42 * U, 42 * U],
      [625 * U, 42 * U],
      [555 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: PALETTE.mint,
      innerFn: () => {
        drawSpeedLines(ctx, 42 * U, 42 * U, 580 * U, 990 * U, t, U, { color: 'rgba(18,18,22,0.12)', slope: -0.08 });
      }
    });

    drawPanel(ctx, [
      [662 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [592 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        drawConcentrationLines(ctx, 1140 * U, 240 * U, t, U, { count: 44, rMin: 240, color: 'rgba(37,77,255,0.11)' });
      }
    });

    drawChapterTag(ctx, 82 * U, 96 * U, 'STEP 07 // 智库一键导出', U, { bg: PALETTE.ink, fg: PALETTE.yellow });
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${72 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.fillStyle = PALETTE.ink;
    ctx.fillText('收藏即研报', 80 * U, 260 * U);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('一键导出 MD', 80 * U, 350 * U);

    drawSpeechBubble(ctx, 80 * U, 420 * U, 455 * U, 210 * U, [
      { text: '右滑收藏的 P0 情报全在这里，', color: PALETTE.ink, size: 24 },
      { text: '点一下右上角「导出 MD」，', color: PALETTE.blue, size: 26 },
      { text: '直接拿去发周报 / 进 Obsidian！', color: PALETTE.muted, size: 22 }
    ], U, { padY: 56, lineHeight: 54 });

    // Real 10-vault.png Phone!
    const phX = 910 * U, phY = 540 * U;
    const clickK = seg(dt, 0.45, 0.90);
    drawComicPhone(ctx, IMGS.vault, phX, phY, 880 * U, -0.02, U, {
      shadow: [16 * U, 16 * U],
      shadowColor: PALETTE.blue,
      overlayFn: (pw, ph) => {
        // Highlight ring right around the real "导出 MD" button top-right of Vault!
        const bx = pw / 2 - pw * 0.24, by = -ph / 2 + ph * 0.082;
        if (clickK > 0 && clickK < 0.5) {
          ctx.fillStyle = `rgba(255, 212, 38, ${0.45 * (1 - clickK * 2)})`;
          rrect(ctx, bx, by, pw * 0.21, ph * 0.042, 8 * U);
          ctx.fill();
        }
        ctx.strokeStyle = PALETTE.yellow;
        ctx.lineWidth = 5 * U;
        rrect(ctx, bx, by, pw * 0.21, ph * 0.042, 8 * U);
        ctx.stroke();
      }
    });

    // Comic pointer clicking "导出 MD"!
    const curM = ease.outExpo(seg(dt, 0.05, 0.44));
    drawComicCursor(ctx, lerp(1120 * U, phX + 148 * U, curM), lerp(420 * U, 198 * U, curM), U, clickK);

    // Pop-out Exported Markdown Report Card (appears immediately on click at dt >= 0.48s!)
    if (dt >= 0.48) {
      const repK = spring(dt - 0.48, { freq: 4.5, damp: 0.62 });
      drawCurvedComicArrow(ctx, phX + 190 * U, 195 * U, 1235 * U, 110 * U, 1300 * U, 240 * U, ease.outCubic(seg(dt, 0.48, 0.90)), U, {
        color: PALETTE.yellow, lw: 10, headL: 28
      });

      ctx.save();
      ctx.translate(1545 * U, 540 * U);
      ctx.rotate(0.02);
      ctx.scale(repK, repK);
      const rw = 575 * U, rh = 620 * U;
      ctx.fillStyle = PALETTE.blue;
      rrect(ctx, -rw / 2 + 12 * U, -rh / 2 + 12 * U, rw, rh, 18 * U);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      rrect(ctx, -rw / 2, -rh / 2, rw, rh, 18 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5 * U;
      ctx.stroke();

      // Top file bar
      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, -rw / 2 + 22 * U, -rh / 2 + 22 * U, rw - 44 * U, 54 * U, 10 * U);
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${18 * U}px "JetBrains Mono", monospace`;
      ctx.fillStyle = PALETTE.yellow;
      ctx.fillText('📄 InsightX-Report-2026.md', -rw / 2 + 40 * U, -rh / 2 + 49 * U);
      ctx.textAlign = 'right';
      ctx.fillStyle = PALETTE.mint;
      ctx.fillText('SAVED ✓', rw / 2 - 40 * U, -rh / 2 + 49 * U);

      // Markdown content lines
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = `900 ${28 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('# 本周 AI 商业决策研报', -rw / 2 + 34 * U, -rh / 2 + 135 * U);

      const mdLines = [
        ['## 1. 重大机遇 · 3 篇已归档', PALETTE.blue],
        ['- Anthropic 1.5万亿 IPO 与企业营收', PALETTE.ink],
        ['- Nothing 无屏端侧录音硬件新入口', PALETTE.ink],
        ['## 2. 算力降本测算 (实测)', '#059669'],
        ['- 千问 Turbo 降价 96.3% · 月省 ¥1,108+', PALETTE.ink],
        ['## 3. 本周 48h 行动清单', PALETTE.coral],
        ['- [x] 非核心清洗任务切低价路由', PALETTE.muted]
      ];
      mdLines.forEach(([txt, col], idx) => {
        ctx.font = `${txt.startsWith('##') ? 900 : 700} ${(txt.startsWith('##') ? 22 : 19) * U}px "PingFang SC", "JetBrains Mono", sans-serif`;
        ctx.fillStyle = col;
        ctx.fillText(txt, -rw / 2 + 34 * U, -rh / 2 + 195 * U + idx * 46 * U);
      });

      // Bottom Privacy Ribbon
      ctx.fillStyle = PALETTE.yellow;
      rrect(ctx, -rw / 2 + 34 * U, rh / 2 - 78 * U, rw - 68 * U, 50 * U, 10 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 3.5 * U;
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.font = `900 ${20 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('🛡️ 本地直出 · 零密钥泄露 · 开箱即用', 0, rh / 2 - 46 * U);
      ctx.restore();
    }
  }

  // -----------------------------------------------------------------------
  // PHASE C (4.10s - 8.50s): Comic Pull-Out Finale -> InsightX 2.0 Brand Resolve!
  // Hold steady from 6.90s -> 8.50s (1.6s crisp ending hold!)
  // -----------------------------------------------------------------------
  else {
    // Clamp animation time at holdStart so the final 1.6s is rock-steady (zero jitter during HOLDS!)
    const animT = Math.min(t, holdStart);
    const dt = animT - outroT;
    const fanK = spring(dt, { freq: 3.0, damp: 0.78 });
    const lockK = spring(dt - 0.35, { freq: 2.6, damp: 0.86 });

    drawComicPage(ctx, W, H, U, { invert: flash, dotColor: 'rgba(37, 77, 255, 0.09)' });

    // Full-page comic poster border with diagonal yellow & cobalt split
    drawPanel(ctx, [
      [42 * U, 42 * U],
      [1878 * U, 42 * U],
      [1878 * U, 1038 * U],
      [42 * U, 1038 * U]
    ], U, {
      fill: '#FFFFFF',
      innerFn: () => {
        // Top-left yellow triangle
        ctx.fillStyle = PALETTE.yellow;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(780 * U, 0); ctx.lineTo(420 * U, H); ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fill();
        // Bottom-right cobalt band
        ctx.fillStyle = PALETTE.blue;
        ctx.beginPath();
        ctx.moveTo(1260 * U, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(940 * U, H);
        ctx.closePath();
        ctx.fill();
        // Crisp ink diagonal dividers
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 6 * U;
        ctx.beginPath(); ctx.moveTo(780 * U, 0); ctx.lineTo(420 * U, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1260 * U, 0); ctx.lineTo(940 * U, H); ctx.stroke();

        // Concentration lines frozen smoothly once in holdStart
        drawConcentrationLines(ctx, W / 2, H / 2, animT, U, { count: 48, rMin: 360, color: 'rgba(18,18,22,0.12)' });
      }
    });

    // Fan of 5 REAL InsightX UI screens arranged symmetrically behind the center brand hero!
    const fanSpecs = [
      { img: IMGS.onboarding, tx: 290,  ty: 590, rot: -0.22, h: 520, sh: PALETTE.ink },
      { img: IMGS.model,      tx: 565,  ty: 480, rot: -0.10, h: 560, sh: PALETTE.blue },
      { img: IMGS.podcast,    tx: 1355, ty: 480, rot: 0.10,  h: 560, sh: PALETTE.yellow },
      { img: IMGS.matrix,     tx: 1630, ty: 590, rot: 0.22,  h: 520, sh: PALETTE.ink },
      { img: IMGS.roiHigh,    tx: 960,  ty: 420, rot: 0.0,   h: 610, sh: PALETTE.mint }
    ];
    fanSpecs.forEach((f, idx) => {
      const k = spring(dt - idx * 0.06, { freq: 3.2, damp: 0.78 });
      const fx = lerp(W / 2, f.tx * U, k);
      const fy = lerp(1280 * U, f.ty * U, k);
      drawComicPhone(ctx, f.img, fx, fy, f.h * U, f.rot * k, U, {
        shadow: [12 * U, 12 * U],
        shadowColor: f.sh,
        borderWidth: 5
      });
    });

    // Center Hero Comic Cover Lockup Banner (clean, zero clutter, razor-sharp readability!)
    if (lockK > 0.02) {
      ctx.save();
      ctx.translate(W / 2, 650 * U);
      const sc = lerp(0.75, 1.0, lockK);
      ctx.scale(sc, sc);

      const bw = 1140 * U, bh = 420 * U;
      // Bold offset cobalt shadow
      ctx.fillStyle = PALETTE.blue;
      rrect(ctx, -bw / 2 + 16 * U, -bh / 2 + 16 * U, bw, bh, 24 * U);
      ctx.fill();
      // Main crisp white lockup card
      ctx.fillStyle = '#FFFFFF';
      rrect(ctx, -bw / 2, -bh / 2, bw, bh, 24 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 7 * U;
      ctx.stroke();

      // Top dark ribbon
      ctx.fillStyle = PALETTE.ink;
      rrect(ctx, -330 * U, -bh / 2 - 26 * U, 660 * U, 52 * U, 26 * U);
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${19 * U}px "JetBrains Mono", "PingFang SC", sans-serif`;
      ctx.fillStyle = PALETTE.yellow;
      ctx.fillText('⚡ OBSIDIAN PRO · 本地单页即开即用 · 零密钥泄露', 0, -bh / 2);

      // Giant Brand Name: InsightX 2.0
      ctx.textBaseline = 'alphabetic';
      ctx.font = `900 ${112 * U}px "JetBrains Mono", "Arial Black", sans-serif`;
      // Subtle solid blue drop-text offset
      ctx.fillStyle = PALETTE.blue;
      ctx.fillText('InsightX 2.0', 6 * U, -20 * U);
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('InsightX 2.0', 0, -26 * U);

      // Yellow Hero Tagline Bar
      ctx.fillStyle = PALETTE.yellow;
      rrect(ctx, -455 * U, 10 * U, 910 * U, 74 * U, 12 * U);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 5 * U;
      ctx.stroke();

      ctx.font = `900 ${36 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText('刺穿 90% 噪音 · 从信息洪流到清晰定策', 0, 59 * U);

      // 4 Clean Feature Pills along bottom
      const pills = ['🔥 Bento 2×2 参数', '🎚️ 动态 ROI 推演', '🎙️ 30s 播客原声', '📊 矩阵 & MD 研报'];
      const pw = 238 * U, gap = 18 * U;
      const totalW = pills.length * pw + (pills.length - 1) * gap;
      pills.forEach((txt, i) => {
        const px = -totalW / 2 + i * (pw + gap);
        ctx.fillStyle = PALETTE.paper;
        rrect(ctx, px, 114 * U, pw, 50 * U, 10 * U);
        ctx.fill();
        ctx.strokeStyle = PALETTE.ink;
        ctx.lineWidth = 3.5 * U;
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${18 * U}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = PALETTE.ink;
        ctx.fillText(txt, px + pw / 2, 140 * U);
      });

      ctx.restore();
    }
  }

  // Diagonal comic wipe across Matrix -> Vault switch (1.88 -> 2.22s) and Vault -> Finale (3.92 -> 4.26s)
  drawDiagonalWipe(ctx, W, H, seg(t, 1.88, 2.22), PALETTE.ink, PALETTE.yellow);
  drawDiagonalWipe(ctx, W, H, seg(t, 3.92, 4.26), PALETTE.ink, PALETTE.blue);

  ctx.restore();
}
