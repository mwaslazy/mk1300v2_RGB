import { KB_WIDTH, KB_HEIGHT } from './keyboard-layout.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360; 
  s = Math.max(0, Math.min(1, s)); 
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { 
    r: Math.round((r + m) * 255), 
    g: Math.round((g + m) * 255), 
    b: Math.round((b + m) * 255) 
  };
}

function nx(k) { return (k.x + k.w / 2) / KB_WIDTH; }
function ny(k) { return (k.y + k.h / 2) / KB_HEIGHT; }

// Pseudo-random deterministic hash for starry effects
function hash2d(x, y) {
  const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

// ── 1. Classic Rainbow Wave ─────────────────────────────────────────────────
function rgbWave(keys, time) {
  const shift = time * -180;
  return keys.map(k => {
    const h = (nx(k) * 360) + shift;
    return hsl(h, 1, 0.5);
  });
}

// ── 2. Rainbow Cycle (Synchronized) ─────────────────────────────────────────
function rainbowCycle(keys, time) {
  const h = (time * 60) % 360;
  return keys.map(() => hsl(h, 1, 0.5));
}

// ── 3. Matrix Rain ──────────────────────────────────────────────────────────
function matrixRain(keys, time) {
  return keys.map(k => {
    const col = Math.floor(k.x + k.w / 2);
    const speed = 1.6 + (col % 4) * 0.4;
    const offset = (col * 19.3) % 10;
    const yPos = (time * speed + offset) % 3.5;
    const dist = ny(k) - (yPos - 1);
    
    if (dist >= 0 && dist < 0.65) {
      const l = dist < 0.08 ? 0.95 : (0.55 - (dist / 0.65) * 0.55);
      return hsl(125, 1, l);
    }
    return { r: 0, g: 0, b: 0 };
  });
}

// ── 4. Breathing Pulse ──────────────────────────────────────────────────────
function breathing(keys, time) {
  const wave = (Math.sin(time * 2.2) + 1) / 2;
  const l = 0.04 + wave * 0.46;
  return keys.map(k => {
    const hue = 350 + nx(k) * 25;
    return hsl(hue, 1, l);
  });
}

// ── 5. Center Radial Ripple ─────────────────────────────────────────────────
function pulse(keys, time) {
  const shift = time * 3.5;
  return keys.map(k => {
    const cx = (nx(k) - 0.5) * 2;
    const cy = (ny(k) - 0.5) * 2;
    const dist = Math.sqrt(cx * cx + cy * cy);
    const wave = Math.sin((dist - shift) * Math.PI * 2);
    const l = Math.max(0, wave * 0.5);
    return hsl(190 + dist * 50, 1, l);
  });
}

// ── 6. Heartbeat ────────────────────────────────────────────────────────────
function heartbeat(keys, time) {
  const cycle = time % 1.25;
  let l = 0.04;
  if (cycle < 0.12) l = 0.65;
  else if (cycle > 0.22 && cycle < 0.34) l = 0.45;
  
  return keys.map(k => {
    const cx = Math.abs(nx(k) - 0.5);
    return hsl(340, 1, Math.max(0.02, l - cx * 0.2));
  });
}

// ── 7. Aurora Borealis ──────────────────────────────────────────────────────
function auroraBorealis(keys, time) {
  return keys.map(k => {
    const x = nx(k);
    const y = ny(k);
    const wave1 = Math.sin(x * 4 + time * 1.5) * 0.3;
    const wave2 = Math.cos(x * 2 - time * 1.2) * 0.2;
    const height = y + wave1 + wave2;
    
    const hue = 140 + Math.sin(x * 3 + time) * 70; // Emerald -> Cyan -> Purple
    const l = Math.max(0.04, Math.sin(height * Math.PI) * 0.5);
    return hsl(hue, 1, l);
  });
}

// ── 8. Fire & Lava Flames ───────────────────────────────────────────────────
function fireEffect(keys, time) {
  return keys.map(k => {
    const x = nx(k);
    const y = ny(k);
    const flicker1 = Math.sin(x * 12 + time * 6) * 0.15;
    const flicker2 = Math.cos(x * 24 - time * 9) * 0.1;
    const heat = (1 - y) + flicker1 + flicker2;
    
    if (heat > 0.75) return hsl(55, 1, 0.65); // Bright yellow-white top
    if (heat > 0.45) return hsl(25, 1, 0.52); // Orange
    if (heat > 0.15) return hsl(0, 1, 0.38);  // Crimson
    return hsl(0, 1, Math.max(0, heat * 0.3));
  });
}

// ── 9. Starry Night Twinkle ─────────────────────────────────────────────────
function starryNight(keys, time) {
  return keys.map(k => {
    const h = hash2d(k.x, k.y);
    const speed = 1.5 + h * 2.5;
    const twinkle = (Math.sin(time * speed + h * 10) + 1) / 2;
    
    // Deep cosmic blue background
    const bgL = 0.05 + ny(k) * 0.05;
    const starL = Math.pow(twinkle, 3.5) * 0.75;
    
    if (starL > 0.15) {
      return hsl(200 + h * 40, 0.3, Math.min(1, bgL + starL));
    }
    return hsl(235, 0.9, bgL);
  });
}

// ── 10. Cylon Scanner (Knight Rider) ────────────────────────────────────────
function neonScanner(keys, time) {
  const beamPos = (Math.sin(time * 3) + 1) / 2; // 0 to 1 back and forth
  return keys.map(k => {
    const dist = Math.abs(nx(k) - beamPos);
    if (dist < 0.2) {
      const intensity = 1 - (dist / 0.2);
      return hsl(350, 1, Math.pow(intensity, 2) * 0.55);
    }
    return { r: 5, g: 0, b: 2 };
  });
}

// ── 11. Cyber Cascade (Pink & Cyan diagonal rain) ───────────────────────────
function cyberCascade(keys, time) {
  return keys.map(k => {
    const diag = (nx(k) * 0.8 + ny(k) * 0.6 + time * 1.8) % 1;
    const isPink = Math.floor(k.x) % 2 === 0;
    const hue = isPink ? 315 : 185;
    const l = Math.max(0.04, Math.pow(1 - diag, 3) * 0.6);
    return hsl(hue, 1, l);
  });
}

// ── 12. Spiral Vortex ───────────────────────────────────────────────────────
function spiralVortex(keys, time) {
  return keys.map(k => {
    const cx = (nx(k) - 0.5) * (KB_WIDTH / KB_HEIGHT);
    const cy = ny(k) - 0.5;
    const angle = Math.atan2(cy, cx); // -PI to PI
    const radius = Math.sqrt(cx * cx + cy * cy);
    
    const spiral = (angle + radius * 5 - time * 4) % (Math.PI * 2);
    const hue = ((angle + Math.PI) / (Math.PI * 2) * 360 + time * 60) % 360;
    const l = (Math.sin(spiral) + 1) / 2 * 0.5;
    return hsl(hue, 1, l);
  });
}

// ── 13. Demoscene Plasma Wave ───────────────────────────────────────────────
function plasmaWave(keys, time) {
  return keys.map(k => {
    const x = nx(k) * 6;
    const y = ny(k) * 4;
    const v1 = Math.sin(x + time);
    const v2 = Math.sin(y - time * 1.5);
    const v3 = Math.sin(x + y + time * 0.7);
    const cx = x + 0.5 * Math.sin(time / 2);
    const cy = y + 0.5 * Math.cos(time / 3);
    const v4 = Math.sin(Math.sqrt(cx * cx + cy * cy + 1) + time);
    
    const val = (v1 + v2 + v3 + v4 + 4) / 8; // 0 to 1
    const hue = (val * 360 + time * 30) % 360;
    return hsl(hue, 1, 0.45);
  });
}

// ── 14. Bouncing Orb / Pong ─────────────────────────────────────────────────
function bouncyDot(keys, time) {
  const posX = (Math.sin(time * 2.2) + 1) / 2;
  const posY = (Math.cos(time * 3.1) + 1) / 2;
  return keys.map(k => {
    const dx = (nx(k) - posX) * (KB_WIDTH / KB_HEIGHT);
    const dy = ny(k) - posY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.28) {
      const l = (1 - dist / 0.28) * 0.6;
      return hsl(50, 1, l);
    }
    return { r: 0, g: 3, b: 8 };
  });
}

// ── 15. Cyber Glitch ────────────────────────────────────────────────────────
function glitchStorm(keys, time) {
  const slice = Math.floor(time * 12);
  return keys.map(k => {
    const rand = hash2d(k.x + slice * 0.1, k.y + slice * 0.3);
    if (rand > 0.88) {
      const colorPick = hash2d(k.index, slice);
      if (colorPick < 0.33) return hsl(320, 1, 0.6); // Hot Magenta
      if (colorPick < 0.66) return hsl(180, 1, 0.6); // Cyan
      return hsl(60, 1, 0.7); // Glitch yellow
    }
    return { r: 5, g: 5, b: 12 };
  });
}

// ── 16. Dual Clash Wave ─────────────────────────────────────────────────────
function dualWave(keys, time) {
  const phase1 = (time * 1.5) % 1.5;
  const phase2 = (time * 1.5) % 1.5;
  return keys.map(k => {
    const dLeft = Math.abs(nx(k) - phase1);
    const dRight = Math.abs((1 - nx(k)) - phase2);
    
    let lLeft = dLeft < 0.15 ? (1 - dLeft / 0.15) * 0.5 : 0;
    let lRight = dRight < 0.15 ? (1 - dRight / 0.15) * 0.5 : 0;
    
    if (lLeft > 0 && lRight > 0) return hsl(60, 1, 0.7); // Collision flash
    if (lLeft > 0) return hsl(210, 1, lLeft);  // Blue wave
    if (lRight > 0) return hsl(350, 1, lRight); // Red wave
    return { r: 2, g: 2, b: 6 };
  });
}

// ── 17. Hyperspace Warp ─────────────────────────────────────────────────────
function hyperSpace(keys, time) {
  return keys.map(k => {
    const cx = (nx(k) - 0.5) * 2;
    const cy = (ny(k) - 0.5) * 2;
    const r = Math.sqrt(cx * cx + cy * cy);
    const speed = (r * 2 - (time * 3) % 1);
    const beam = (Math.sin(speed * Math.PI * 3) + 1) / 2;
    const l = Math.pow(beam, 4) * Math.min(1, r + 0.2) * 0.65;
    return hsl(215, 0.6, l);
  });
}

// ── 18. Ocean Tide Waves ────────────────────────────────────────────────────
function oceanWaves(keys, time) {
  return keys.map(k => {
    const wave = Math.sin(nx(k) * 3 + ny(k) * 2 + time * 2) * 0.5 + 0.5;
    const hue = 185 + wave * 35; // Cyan to Deep Sea
    const l = 0.15 + wave * 0.35;
    return hsl(hue, 1, l);
  });
}

// ── 19. Sunset Horizon ──────────────────────────────────────────────────────
function sunsetBreeze(keys, time) {
  return keys.map(k => {
    const breeze = Math.sin(nx(k) * 4 + time * 1.8) * 0.15;
    const t = ny(k) + breeze;
    const hue = 320 - t * 140; // Violet top -> Amber bottom
    const l = 0.25 + (1 - ny(k)) * 0.25;
    return hsl(hue, 1, l);
  });
}

// ── 20. Perimeter Chaser (Marquee) ──────────────────────────────────────────
function perimeterChase(keys, time) {
  return keys.map(k => {
    const isBorder = (k.y <= 0.6 || k.y >= 3.8 || k.x <= 0.6 || k.x >= 13.8);
    if (!isBorder) return { r: 4, g: 4, b: 10 };
    
    // Compute perimeter coordinate 0 to 1
    let p = 0;
    if (k.y <= 0.6) p = k.x / 15 * 0.25;
    else if (k.x >= 13.8) p = 0.25 + (k.y / 5) * 0.25;
    else if (k.y >= 3.8) p = 0.5 + ((15 - k.x) / 15) * 0.25;
    else p = 0.75 + ((5 - k.y) / 5) * 0.25;
    
    const chaser = ((p - time * 0.6) % 1 + 1) % 1;
    const l = Math.pow(1 - chaser, 6) * 0.7;
    return hsl((chaser * 360) % 360, 1, Math.max(0.08, l));
  });
}

// ── 21. Equalizer Bounce ────────────────────────────────────────────────────
function eqBounce(keys, time) {
  return keys.map(k => {
    const col = Math.floor(k.x + k.w / 2);
    const barHeight = (Math.sin(col * 1.5 + time * 4.5) * 0.5 + 0.5) * 0.8 + 0.1;
    const normY = 1 - ny(k); // 0=bottom, 1=top
    
    if (normY <= barHeight) {
      const hue = 120 - normY * 120; // Green bottom -> Yellow mid -> Red peak
      return hsl(hue, 1, 0.48);
    }
    return { r: 2, g: 2, b: 4 };
  });
}

// ── Registry ─────────────────────────────────────────────────────────────────

export const ANIMATED_PATTERNS = [
  { id:'rgbwave',         name:'RGB Wave',         icon:'🌊', animated: true, fn: rgbWave },
  { id:'rainbowcycle',    name:'Rainbow Cycle',    icon:'🌈', animated: true, fn: rainbowCycle },
  { id:'matrixrain',      name:'Matrix Rain',      icon:'🌧️', animated: true, fn: matrixRain },
  { id:'auroraborealis',  name:'Aurora Borealis',  icon:'🌌', animated: true, fn: auroraBorealis },
  { id:'fire',            name:'Fire & Lava',      icon:'🔥', animated: true, fn: fireEffect },
  { id:'breathing',       name:'Breathing Glow',   icon:'🫁', animated: true, fn: breathing },
  { id:'pulse',           name:'Pulse Ripple',     icon:'🌀', animated: true, fn: pulse },
  { id:'heartbeat',       name:'Heartbeat',        icon:'💓', animated: true, fn: heartbeat },
  { id:'starrynight',     name:'Starry Night',     icon:'✨', animated: true, fn: starryNight },
  { id:'neonscanner',     name:'Cylon Scanner',    icon:'🚨', animated: true, fn: neonScanner },
  { id:'cybercascade',    name:'Cyber Cascade',    icon:'☔', animated: true, fn: cyberCascade },
  { id:'spiral',          name:'Spiral Vortex',    icon:'🍥', animated: true, fn: spiralVortex },
  { id:'plasmawave',      name:'Plasma Wave',      icon:'🔮', animated: true, fn: plasmaWave },
  { id:'bouncydot',       name:'Bouncing Pong',    icon:'⚽', animated: true, fn: bouncyDot },
  { id:'glitchstorm',     name:'Cyber Glitch',     icon:'⚡', animated: true, fn: glitchStorm },
  { id:'dualwave',        name:'Clash Wave',       icon:'⚔️', animated: true, fn: dualWave },
  { id:'hyperspace',      name:'Hyperspace Warp',  icon:'🚀', animated: true, fn: hyperSpace },
  { id:'oceanwaves',      name:'Ocean Tide',       icon:'🏄', animated: true, fn: oceanWaves },
  { id:'sunsetbreeze',    name:'Sunset Breeze',    icon:'🌅', animated: true, fn: sunsetBreeze },
  { id:'perimeterchase',  name:'Perimeter Chaser', icon:'🏎️', animated: true, fn: perimeterChase },
  { id:'eqbounce',        name:'Equalizer Bounce', icon:'📊', animated: true, fn: eqBounce },
];
