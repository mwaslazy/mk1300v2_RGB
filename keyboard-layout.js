/**
 * ANT Esports MK1300 V2 — 60% keyboard layout
 * 5 rows, ~15u wide. No F-row, no numpad, no nav cluster.
 *
 * Two hardware revisions exist. They share the same physical 61-key layout,
 * but the firmware uses a DIFFERENT LED index map and custom-light mode:
 *
 *   REV 1   (original)  — LED index = row*21 + col (full-size matrix, Esc=21), UserLight mode 16
 *   REV 2.0 (revised)   — LED index = row*15 + col (compact matrix,  Esc=0),  UserLight mode 20
 *                         Vendor profile "61 Key" (VID 0x36AE / PID 0xFEAD)
 *
 * Each key has:
 *   index — stable logical key ID (= REV 1 LED index). Effects/patterns reference this,
 *           so every pattern works unchanged on every revision.
 *   led   — the hardware LED index for the ACTIVE revision. Only used when writing to HW.
 */

// Row 0: Esc, 1-0, -, =, Backspace
// Row 1: Tab, Q-P, [, ], backslash
// Row 2: Caps, A-L, ;, ', Enter
// Row 3: LShift, Z-?, RShift
// Row 4: Ctrl, Win, Alt, Space, Alt, Menu, Ctrl, Fn

const BASE_LAYOUT = [
  // Row 0 — number row (y=0)
  // NOTE: Esc uses index 21 (the ~ slot in the firmware matrix).
  // Index 0 is reserved for a non-existent function-row key on the full keyboard.
  { index:21, x:0,   y:0, w:1,    h:1, name:"Esc" },
  { index:22, x:1,   y:0, w:1,    h:1, name:"1"   },
  { index:23, x:2,   y:0, w:1,    h:1, name:"2"   },
  { index:24, x:3,   y:0, w:1,    h:1, name:"3"   },
  { index:25, x:4,   y:0, w:1,    h:1, name:"4"   },
  { index:26, x:5,   y:0, w:1,    h:1, name:"5"   },
  { index:27, x:6,   y:0, w:1,    h:1, name:"6"   },
  { index:28, x:7,   y:0, w:1,    h:1, name:"7"   },
  { index:29, x:8,   y:0, w:1,    h:1, name:"8"   },
  { index:30, x:9,   y:0, w:1,    h:1, name:"9"   },
  { index:31, x:10,  y:0, w:1,    h:1, name:"0"   },
  { index:32, x:11,  y:0, w:1,    h:1, name:"-"   },
  { index:33, x:12,  y:0, w:1,    h:1, name:"="   },
  { index:34, x:13,  y:0, w:2,    h:1, name:"←"   },

  // Row 1 — QWERTY (y=1)
  { index:42, x:0,   y:1, w:1.5,  h:1, name:"Tab" },
  { index:43, x:1.5, y:1, w:1,    h:1, name:"Q"   },
  { index:44, x:2.5, y:1, w:1,    h:1, name:"W"   },
  { index:45, x:3.5, y:1, w:1,    h:1, name:"E"   },
  { index:46, x:4.5, y:1, w:1,    h:1, name:"R"   },
  { index:47, x:5.5, y:1, w:1,    h:1, name:"T"   },
  { index:48, x:6.5, y:1, w:1,    h:1, name:"Y"   },
  { index:49, x:7.5, y:1, w:1,    h:1, name:"U"   },
  { index:50, x:8.5, y:1, w:1,    h:1, name:"I"   },
  { index:51, x:9.5, y:1, w:1,    h:1, name:"O"   },
  { index:52, x:10.5,y:1, w:1,    h:1, name:"P"   },
  { index:53, x:11.5,y:1, w:1,    h:1, name:"["   },
  { index:54, x:12.5,y:1, w:1,    h:1, name:"]"   },
  { index:55, x:13.5,y:1, w:1.5,  h:1, name:"\\"  },

  // Row 2 — Home row (y=2)
  { index:63, x:0,    y:2, w:1.75, h:1, name:"Caps" },
  { index:64, x:1.75, y:2, w:1,    h:1, name:"A"   },
  { index:65, x:2.75, y:2, w:1,    h:1, name:"S"   },
  { index:66, x:3.75, y:2, w:1,    h:1, name:"D"   },
  { index:67, x:4.75, y:2, w:1,    h:1, name:"F"   },
  { index:68, x:5.75, y:2, w:1,    h:1, name:"G"   },
  { index:69, x:6.75, y:2, w:1,    h:1, name:"H"   },
  { index:70, x:7.75, y:2, w:1,    h:1, name:"J"   },
  { index:71, x:8.75, y:2, w:1,    h:1, name:"K"   },
  { index:72, x:9.75, y:2, w:1,    h:1, name:"L"   },
  { index:73, x:10.75,y:2, w:1,    h:1, name:";"   },
  { index:74, x:11.75,y:2, w:1,    h:1, name:"'"   },
  { index:76, x:12.75,y:2, w:2.25, h:1, name:"Enter"},

  // Row 3 — Shift row (y=3)
  { index:84, x:0,    y:3, w:2.25, h:1, name:"Shift"},
  { index:86, x:2.25, y:3, w:1,    h:1, name:"Z"   },
  { index:87, x:3.25, y:3, w:1,    h:1, name:"X"   },
  { index:88, x:4.25, y:3, w:1,    h:1, name:"C"   },
  { index:89, x:5.25, y:3, w:1,    h:1, name:"V"   },
  { index:90, x:6.25, y:3, w:1,    h:1, name:"B"   },
  { index:91, x:7.25, y:3, w:1,    h:1, name:"N"   },
  { index:92, x:8.25, y:3, w:1,    h:1, name:"M"   },
  { index:93, x:9.25, y:3, w:1,    h:1, name:"<"   },
  { index:94, x:10.25,y:3, w:1,    h:1, name:">"   },
  { index:95, x:11.25,y:3, w:1,    h:1, name:"?"   },
  { index:97, x:12.25,y:3, w:2.75, h:1, name:"Shift"},

  // Row 4 — Bottom row (y=4)
  { index:105,x:0,    y:4, w:1.25, h:1, name:"Ctrl" },
  { index:106,x:1.25, y:4, w:1.25, h:1, name:"Win"  },
  { index:107,x:2.5,  y:4, w:1.25, h:1, name:"Alt"  },
  { index:111,x:3.75, y:4, w:6.25, h:1, name:"Space" },
  { index:115,x:10,   y:4, w:1.25, h:1, name:"Alt"  },
  { index:116,x:11.25,y:4, w:1,    h:1, name:"Menu" },
  { index:117,x:12.25,y:4, w:1.25, h:1, name:"Ctrl" },
  { index:118,x:13.5, y:4, w:1.5,  h:1, name:"Fn"   },
];

// ── REV 2.0 LED map (logical index → hardware LED) ──────────────────────────
// Source: vendor web-driver profile "61 Key" (36AE:FEAD), compact 15-wide matrix.
// The revised firmware drops the F-row and uses row*15 + col.
//   Row 0: Esc..Bksp  → 0..13
//   Row 1: Tab..\     → 15..28
//   Row 2: Caps..'    → 30..41, Enter → 43
//   Row 3: Shift → 45, Z..? → 47..56, RShift → 58
//   Row 4: Ctrl 60, Win 61, Alt 62, Space 66, then the 4 right-side keys 70..73
//          (LEDs are positional — 70..73 are the 5th..8th physical keys of the bottom row)
const REV2_LED = {};
// Rows 0-3: same column structure as REV 1, just a different row stride/origin.
for (const k of BASE_LAYOUT) {
  if (k.index >= 21 && k.index <= 97) {
    const row = Math.floor(k.index / 21) - 1;   // REV 1 row 1..4 → 0..3
    const col = k.index % 21;
    REV2_LED[k.index] = row * 15 + col;
  }
}
// Bottom row (columns are NOT a simple offset here)
Object.assign(REV2_LED, {
  105: 60,  // Ctrl
  106: 61,  // Win
  107: 62,  // Alt
  111: 66,  // Space
  115: 70,  // R-Alt
  116: 71,  // 6th key
  117: 72,  // 7th key
  118: 73,  // 8th key (bottom-right corner)
});

// REV 2.0 bottom-right: four equal 1.25u keys (Alt, Menu, Ctrl, Fn on ANT Esports keycaps)
const REV2_GEOMETRY = {
  115: { x:10,    w:1.25 },
  116: { x:11.25, w:1.25 },
  117: { x:12.5,  w:1.25 },
  118: { x:13.75, w:1.25 },
};

// ── Revision profiles ────────────────────────────────────────────────────────
export const LAYOUT_PROFILES = {
  rev1: {
    id: 'rev1',
    label: 'REV 1 (original)',
    userLightMode: 16,
    productIds: [0xFE9C, 0xFE61, 0xFEBC],
    keys: BASE_LAYOUT.map(k => ({ ...k, led: k.index })),
  },
  rev2: {
    id: 'rev2',
    label: 'REV 2.0 (revised)',
    userLightMode: 20,
    productIds: [0xFEAD, 0xFE62],
    keys: BASE_LAYOUT.map(k => ({ ...k, ...(REV2_GEOMETRY[k.index] || {}), led: REV2_LED[k.index] })),
  },
};

// Sanity check: every key must have a unique hardware LED in every profile
for (const p of Object.values(LAYOUT_PROFILES)) {
  const seen = new Set();
  for (const k of p.keys) {
    if (k.led === undefined || seen.has(k.led)) {
      console.error(`[layout] ${p.id}: bad/duplicate LED for key "${k.name}" (${k.index})`);
    }
    seen.add(k.led);
  }
}

// ── Active layout (ES module live bindings — importers always see current values) ──
export let ACTIVE_PROFILE  = LAYOUT_PROFILES.rev1;
export let KEYBOARD_LAYOUT = ACTIVE_PROFILE.keys;
export let MAX_KEY_INDEX   = Math.max(...KEYBOARD_LAYOUT.map(k => k.led));
export let KEY_COUNT       = MAX_KEY_INDEX + 1;   // number of LED slots to send to HW
export const KB_WIDTH  = 15;   // ~15 standard key-widths
export const KB_HEIGHT = 5;    // 5 rows

/** Switch active hardware revision. Returns the new profile. */
export function setActiveLayout(id) {
  const p = LAYOUT_PROFILES[id] || LAYOUT_PROFILES.rev1;
  ACTIVE_PROFILE  = p;
  KEYBOARD_LAYOUT = p.keys;
  MAX_KEY_INDEX   = Math.max(...p.keys.map(k => k.led));
  KEY_COUNT       = MAX_KEY_INDEX + 1;
  return p;
}

/** Find the revision profile matching a USB product ID (or null if unknown). */
export function profileForProductId(pid) {
  return Object.values(LAYOUT_PROFILES).find(p => p.productIds.includes(pid)) || null;
}
