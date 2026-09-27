// Set the corner radius of HTML container surfaces to 8px (user request 2026-09-27).
// Small elements (progress bars, rank badges, pills, swatches) keep their own shape. Idempotent.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'Data Science for Good Kiva Crowdfunding With AI.SemanticModel', 'definition', 'tables', '_Measures.tmdl');
const RADIUS = 8;
const CLASSES = ['card', 'cp', 'ins', 'ringcard', 'tt', 'fact', 'kp', 'ni', 'badge'];
let t = fs.readFileSync(FILE, 'utf8');
let changed = 0;
for (const c of CLASSES) {
  const re = new RegExp(`(\\.${c}\\{[^}]*?border-radius:)(\\d+)px`, 'g');
  t = t.replace(re, (m, head, r) => { if (Number(r) !== RADIUS) changed++; return `${head}${RADIUS}px`; });
}
fs.writeFileSync(FILE, t);
console.log(`container radii set to ${RADIUS}px: ${changed} changed`);
