import * as THREE from 'three';

const cache = new Map();

function makeCanvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}

function toTexture(canvas, repeatX = 1, repeatY = 1, srgb = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function speckle(ctx, size, count, colors, min = 0.5, max = 2) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
    ctx.globalAlpha = 0.18 + Math.random() * 0.45;
    const r = min + Math.random() * (max - min);
    ctx.fillRect(Math.random() * size, Math.random() * size, r, r);
  }
  ctx.globalAlpha = 1;
}

function crack(ctx, x, y, length, color = 'rgba(20,20,18,.48)') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8 + Math.random();
  ctx.beginPath();
  ctx.moveTo(x, y);
  let angle = Math.random() * Math.PI * 2;
  for (let i = 0; i < length; i++) {
    angle += (Math.random() - 0.5) * 0.8;
    x += Math.cos(angle) * (3 + Math.random() * 8);
    y += Math.sin(angle) * (3 + Math.random() * 8);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function graffiti(ctx, x, y, text, color, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((Math.random() - 0.5) * 0.12);
  ctx.font = `700 ${size}px "Barlow Semi Condensed", Arial`;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.82;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function canvasTexture(key, size, draw, repeatX = 1, repeatY = 1) {
  if (cache.has(key)) return cache.get(key);
  const c = makeCanvas(size);
  const ctx = c.getContext('2d');
  draw(ctx, size);
  const tex = toTexture(c, repeatX, repeatY);
  cache.set(key, tex);
  return tex;
}

export function grassTexture() {
  return canvasTexture('grass', 512, (ctx, s) => {
    ctx.fillStyle = '#4b5033';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.strokeStyle = `rgba(${70 + Math.random() * 50},${72 + Math.random() * 46},${35 + Math.random() * 32},${0.18 + Math.random() * 0.4})`;
      ctx.lineWidth = 0.6 + Math.random() * 1.4;
      const x = Math.random() * s;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 5, y - 3 - Math.random() * 11);
      ctx.stroke();
    }
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(95,84,49,.22)' : 'rgba(45,54,31,.32)';
      ctx.beginPath();
      ctx.ellipse(Math.random() * s, Math.random() * s, 12 + Math.random() * 42, 6 + Math.random() * 20, Math.random() * 3, 0, 7);
      ctx.fill();
    }
    speckle(ctx, s, 500, ['#6b6d45', '#353a23', '#7d7445'], 1, 3);
  }, 26, 26);
}

export function asphaltTexture() {
  return canvasTexture('asphalt', 512, (ctx, s) => {
    ctx.fillStyle = '#333330';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 3500, ['#1e1e1d', '#454540', '#56564e', '#77766c'], 0.6, 2.2);
    for (let i = 0; i < 20; i++) {
      crack(ctx, Math.random() * s, Math.random() * s, 4 + Math.random() * 10);
    }
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#c9c2ab';
    for (let i = 0; i < 10; i++) ctx.fillRect(Math.random() * s, Math.random() * s, 8 + Math.random() * 44, 1);
    ctx.globalAlpha = 1;
  }, 12, 12);
}

export function concreteTexture() {
  return canvasTexture('concrete', 512, (ctx, s) => {
    ctx.fillStyle = '#8b887d';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 1800, ['#6e6c63', '#a19d8f', '#bcb6a3'], 0.5, 2.5);
    ctx.strokeStyle = 'rgba(48,48,44,.34)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= s; i += 128) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
    }
    for (let i = 0; i < 8; i++) crack(ctx, Math.random() * s, Math.random() * s, 3 + Math.random() * 7, 'rgba(50,48,43,.4)');
  }, 3, 3);
}

export function brickTexture() {
  return canvasTexture('brick', 512, (ctx, s) => {
    ctx.fillStyle = '#5d3830';
    ctx.fillRect(0, 0, s, s);
    const bw = 64, bh = 25;
    for (let row = 0; row < s / bh; row++) {
      for (let col = -1; col < s / bw + 1; col++) {
        const x = col * bw + (row % 2 ? bw / 2 : 0);
        const y = row * bh;
        const shade = 70 + Math.random() * 38;
        ctx.fillStyle = `rgb(${shade + 25},${shade - 10},${shade - 20})`;
        ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
        ctx.fillStyle = 'rgba(255,200,160,.04)';
        ctx.fillRect(x + 4, y + 3, bw - 8, 2);
      }
    }
    ctx.strokeStyle = 'rgba(40,33,29,.34)';
    ctx.lineWidth = 1;
    for (let y = 0; y < s; y += bh) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke(); }
    for (let i = 0; i < 7; i++) crack(ctx, Math.random() * s, Math.random() * s, 5, 'rgba(32,24,20,.35)');
    speckle(ctx, s, 700, ['#492a25', '#7f4c3e', '#342521'], 1, 3);
  }, 2.2, 1.4);
}

export function sidingTexture() {
  return canvasTexture('siding', 512, (ctx, s) => {
    ctx.fillStyle = '#b2ad9c';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 26) {
      ctx.fillStyle = `rgba(40,35,28,${0.12 + Math.random() * 0.08})`;
      ctx.fillRect(0, y, s, 3);
      ctx.fillStyle = 'rgba(255,255,245,.08)';
      ctx.fillRect(0, y + 3, s, 2);
    }
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = 'rgba(80,65,48,.08)';
      ctx.fillRect(Math.random() * s, Math.random() * s, 5 + Math.random() * 26, 1.5);
    }
    speckle(ctx, s, 500, ['#8c8777', '#c9c4b3', '#6c685b'], 1, 3);
  }, 2.4, 1.6);
}

export function woodTexture() {
  return canvasTexture('wood', 512, (ctx, s) => {
    ctx.fillStyle = '#6e5237';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(${35 + Math.random() * 35},${24 + Math.random() * 20},${14 + Math.random() * 12},${0.16 + Math.random() * 0.3})`;
      ctx.lineWidth = 0.7 + Math.random() * 2.2;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(s * 0.3, y + (Math.random() - 0.5) * 10, s * 0.7, y + (Math.random() - 0.5) * 8, s, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
    for (let y = 0; y < s; y += 128) {
      ctx.fillStyle = 'rgba(36,25,15,.35)';
      ctx.fillRect(0, y, s, 2);
    }
    speckle(ctx, s, 400, ['#4b3523', '#876647', '#2f2419'], 1, 2.5);
  }, 2, 2);
}

export function metalTexture() {
  return canvasTexture('metal', 512, (ctx, s) => {
    ctx.fillStyle = '#77766f';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 120; i++) {
      ctx.strokeStyle = `rgba(30,30,28,${0.05 + Math.random() * 0.2})`;
      ctx.lineWidth = 0.5 + Math.random();
      const x = Math.random() * s;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (Math.random() - 0.5) * 8, s); ctx.stroke();
    }
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = 'rgba(116,58,30,.28)';
      ctx.beginPath();
      ctx.ellipse(Math.random() * s, Math.random() * s, 4 + Math.random() * 20, 2 + Math.random() * 8, Math.random() * 3, 0, 7);
      ctx.fill();
    }
    speckle(ctx, s, 500, ['#4b4a45', '#9b988d', '#603d29'], 1, 3);
  }, 2, 2);
}

export function tileTexture() {
  return canvasTexture('tile', 512, (ctx, s) => {
    ctx.fillStyle = '#9b927d';
    ctx.fillRect(0, 0, s, s);
    const n = 8;
    const cell = s / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        ctx.fillStyle = (x + y) % 2 ? '#aca38e' : '#857e6c';
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    ctx.strokeStyle = 'rgba(50,48,42,.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(s, i * cell); ctx.stroke();
    }
    speckle(ctx, s, 700, ['#665f50', '#c1b9a4'], 0.5, 2);
    for (let i = 0; i < 8; i++) crack(ctx, Math.random() * s, Math.random() * s, 4, 'rgba(45,42,36,.35)');
  }, 4, 4);
}

export function dirtTexture() {
  return canvasTexture('dirt', 512, (ctx, s) => {
    ctx.fillStyle = '#60523e';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 2400, ['#473c2d', '#77644a', '#8e7a59', '#3a3128'], 1, 4);
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = 'rgba(30,25,18,.18)';
      ctx.beginPath();
      ctx.ellipse(Math.random() * s, Math.random() * s, 8 + Math.random() * 35, 3 + Math.random() * 14, Math.random() * 3, 0, 7);
      ctx.fill();
    }
  }, 8, 8);
}

export function bloodTexture() {
  return canvasTexture('blood', 256, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    for (let i = 0; i < 34; i++) {
      const x = s / 2 + (Math.random() - 0.5) * 110;
      const y = s / 2 + (Math.random() - 0.5) * 110;
      const r = 2 + Math.random() * (i < 8 ? 34 : 13);
      ctx.fillStyle = `rgba(${70 + Math.random() * 40},${5 + Math.random() * 10},${5 + Math.random() * 8},${0.45 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.45 + Math.random() * 0.8), Math.random() * 3, 0, 7);
      ctx.fill();
    }
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = 'rgba(62,3,3,.75)';
      ctx.beginPath();
      ctx.arc(s / 2 + (Math.random() - 0.5) * 210, s / 2 + (Math.random() - 0.5) * 210, 1 + Math.random() * 5, 0, 7);
      ctx.fill();
    }
  }, 1, 1);
}

export function glowTexture() {
  return canvasTexture('glow', 256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,240,190,1)');
    g.addColorStop(0.16, 'rgba(255,190,100,.8)');
    g.addColorStop(0.45, 'rgba(255,130,40,.2)');
    g.addColorStop(1, 'rgba(255,100,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, 1, 1);
}

export function smokeTexture() {
  return canvasTexture('smoke', 128, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    const g = ctx.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(180,175,165,.32)');
    g.addColorStop(0.55, 'rgba(100,95,88,.12)');
    g.addColorStop(1, 'rgba(60,60,60,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, 1, 1);
}

export function signTexture(text, subtext = '', opts = {}) {
  const key = `sign:${text}:${subtext}:${opts.tone || ''}:${opts.width || 0}`;
  if (cache.has(key)) return cache.get(key);
  const w = opts.width || 512;
  const h = Math.round(w * (opts.heightRatio || 0.42));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = opts.background || '#20221d';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = opts.border || '#b64b32';
  ctx.lineWidth = Math.max(5, w * 0.012);
  ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, w - ctx.lineWidth * 2, h - ctx.lineWidth * 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = opts.color || '#e7ddc2';
  ctx.font = `400 ${Math.round(h * 0.43)}px "Bebas Neue", Impact`;
  ctx.fillText(text, w / 2, h * 0.55);
  if (subtext) {
    ctx.fillStyle = opts.subcolor || '#c5a66a';
    ctx.font = `600 ${Math.round(h * 0.13)}px "Barlow Semi Condensed", Arial`;
    ctx.letterSpacing = '4px';
    ctx.fillText(subtext, w / 2, h * 0.8);
  }
  // weathering
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(16,16,13,${Math.random() * 0.22})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 18, Math.random() * 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

export function graffitiTexture(text, color = '#a43c2e') {
  const key = `graffiti:${text}`;
  if (cache.has(key)) return cache.get(key);
  const c = makeCanvas(512);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);
  ctx.translate(40, 300);
  ctx.rotate(-0.07);
  ctx.font = '700 125px "Barlow Semi Condensed", Arial';
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.86;
  ctx.fillText(text, 0, 0);
  ctx.globalAlpha = 0.35;
  ctx.filter = 'blur(1px)';
  ctx.fillText(text, 4, 6);
  ctx.filter = 'none';
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

export function decalTexture(kind = 'paper') {
  const key = `decal:${kind}`;
  if (cache.has(key)) return cache.get(key);
  const c = makeCanvas(128);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  if (kind === 'paper') {
    ctx.fillStyle = 'rgba(205,196,165,.75)';
    ctx.fillRect(24, 34, 72, 52);
    ctx.fillStyle = 'rgba(70,66,55,.55)';
    for (let y = 44; y < 80; y += 8) ctx.fillRect(32, y, 46 + Math.random() * 10, 1.5);
  } else if (kind === 'tire') {
    ctx.strokeStyle = 'rgba(20,20,18,.4)';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.ellipse(64, 64, 44, 22, 0.2, 0, 7); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

export function makeMat(opts = {}) {
  return new THREE.MeshStandardMaterial({
    roughness: 0.85,
    metalness: 0,
    ...opts,
  });
}

export function clearTextureCache() {
  for (const tex of cache.values()) tex.dispose();
  cache.clear();
}
