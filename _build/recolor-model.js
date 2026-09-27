// Re-skin the semantic model to the green role-based palette (2026-09-27 redesign).
// Rewrites Color * measures, the shared HTML Theme CSS tokens and hard-coded colours inside
// HTML measures in _Measures.tmdl, and appends the new role measures. Idempotent.
//   node recolor-model.js
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'Data Science for Good Kiva Crowdfunding With AI.SemanticModel', 'definition', 'tables', '_Measures.tmdl');
let t = fs.readFileSync(FILE, 'utf8');
const EOL = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\r\n/g, '\n');

// ---- role colours: [light, dark, description] ----
const ROLES = {
  'Color Page': ['#F1F7F6', '#021B1A', 'Page/canvas background: Anti-Flash White #F1F7F6 (light) or Rich Black #021B1A (dark).'],
  'Color Card': ['#FFFFFF', '#032221', 'Card/visual background: White #FFFFFF (light) or Dark Green #032221 (dark).'],
  'Color Nav': ['#03624C', '#06302B', 'Header bar / elevated panel (nav rail, drawer): Bangladesh Green #03624C (light) or Pine #06302B (dark).'],
  'Color Text': ['#021B1A', '#F1F7F6', 'Primary text: Rich Black #021B1A (light) or Anti-Flash White #F1F7F6 (dark).'],
  'Color Text Muted': ['#707D7D', '#AACBC4', 'Secondary text (labels, axes): Stone #707D7D (light) or Pistachio #AACBC4 (dark).'],
  'Color Border': ['#AACBC4', '#0B453A', 'Borders: Pistachio #AACBC4 (light) or Basil #0B453A (dark).'],
  'Color Gridline': ['#AACBC4', '#0B453A', 'Gridlines: Pistachio #AACBC4 (light) or Basil #0B453A (dark).'],
  'Color Series Primary': ['#03624C', '#2CC295', 'Data series 1: Bangladesh Green #03624C (light) or Mountain Meadow #2CC295 (dark).'],
  'Color Series Secondary': ['#2CC295', '#AACBC4', 'Data series 2: Mountain Meadow #2CC295 (light) or Pistachio #AACBC4 (dark).'],
  'Color Accent': ['#03624C', '#00DF81', 'Accent for slicers, selected state and links: Bangladesh Green #03624C (light) or Caribbean Green #00DF81 (dark). #00DF81 is never used as text on white.'],
  'Color Hover': ['#17876D', '#2CC295', 'Hover / secondary accent: Frog #17876D (light) or Mountain Meadow #2CC295 (dark).'],
  'Color Nav Active': ['#17876D', '#0B453A', 'Current-page highlight on the nav rail: Frog #17876D (light) or Basil #0B453A (dark).'],
  'Color Good': ['#17876D', '#00DF81', 'Status good / on target: Frog #17876D (light) or Caribbean Green #00DF81 (dark).'],
  'Color Warning': ['#D99A1E', '#F2C14E', 'Status warning (palette addition): Amber #D99A1E (light) or #F2C14E (dark).'],
  'Color Bad': ['#C8414B', '#FF6B6B', 'Status bad / off target, also the funding gap (palette addition): Coral red #C8414B (light) or Coral #FF6B6B (dark).']
};

const blockRe = (name) => new RegExp(`(\\t/// )[^\\n]*\\n(\\tmeasure '${name}' =\\n)([\\s\\S]*?)(\\n\\t\\t(?:formatString|displayFolder|lineageTag)[^\\n]*)`);
for (const [name, [light, dark, desc]] of Object.entries(ROLES)) {
  const body =
    `\t\t\t// Purpose : ${desc.split(':')[0]} colour for the current theme mode.\n` +
    `\t\t\t// Logic   : Light / dark values from the role-based palette.\n` +
    `\t\t\t// Used in : fx colour bindings in the report and the HTML Theme CSS tokens.\n` +
    `\t\t\tIF([Is Dark Mode], "${dark}", "${light}")`;
  if (blockRe(name).test(t)) {
    t = t.replace(blockRe(name), (m, a, head, _old, tail) => `${a}${desc}\n${head}${body}${tail}`);
  } else {
    // new measure: insert after the last measure block (before the first column)
    const block = `\t/// ${desc}\n\tmeasure '${name}' =\n${body}\n\t\tdisplayFolder: Theme\n\n`;
    t = t.replace(/(\n)(\t\/\/\/[^\n]*\n)?(\tcolumn )/, (m, nl, doc, col) => `${nl}${block}${doc || ''}${col}`);
  }
}

// ---- shared HTML tokens ----
const LIGHT = '--page:#F1F7F6;--card:#FFFFFF;--card2:#F1F7F6;--border:#AACBC4;--text:#021B1A;--muted:#5C6868;--p:#03624C;--s:#2CC295;--grid:#DCE7E4;--track:#E3EEEB;--accent:#03624C;--hover:#17876D;--good:#17876D;--warn:#D99A1E;--bad:#C8414B;--alert:#C8414B;--badsoft:rgba(200,65,75,.2);--hero1:#03624C;--hero2:#06302B;--onhero:#F1F7F6;--onhero2:#AACBC4;--onheroaccent:#00DF81;--heroline:rgba(170,203,196,.28);--herofill:rgba(241,247,246,.08);';
const DARK = '--page:#021B1A;--card:#032221;--card2:#06302B;--border:#0B453A;--text:#F1F7F6;--muted:#AACBC4;--p:#2CC295;--s:#AACBC4;--grid:#0B453A;--track:#0B453A;--accent:#00DF81;--hover:#2CC295;--good:#00DF81;--warn:#F2C14E;--bad:#FF6B6B;--alert:#FF6B6B;--badsoft:rgba(255,107,107,.25);--hero1:#06302B;--hero2:#032221;--onhero:#F1F7F6;--onhero2:#AACBC4;--onheroaccent:#00DF81;--heroline:rgba(170,203,196,.22);--herofill:rgba(241,247,246,.06);';
t = t.replace(/"--page:[^"]*",(\s*)"--page:[^"]*"/, `"${DARK}",$1"${LIGHT}"`);

// ---- hard-coded colours inside HTML measures -> role tokens ----
const swaps = [
  [/linear-gradient\((\d+deg),#1D3557 0%,#457B9D (\d+%)\)/g, 'linear-gradient($1,var(--hero1) 0%,var(--hero2) $2)'],
  [/stroke='#A8DADC'/g, "stroke='var(--onheroaccent)'"],
  [/\.ins b\{font-family:'Segoe UI Semibold';font-weight:600;color:#A8DADC;\}/g, ".ins b{font-family:'Segoe UI Semibold';font-weight:600;color:var(--onheroaccent);}"],
  [/background:#A8DADC;filter:blur/g, 'background:var(--onheroaccent);filter:blur'],
  [/box-shadow:0 0 0 3px rgba\(230,57,70,\.2+5?\)/g, 'box-shadow:0 0 0 3px var(--badsoft)'],
  [/background:#E63946/g, 'background:var(--bad)'],
  [/background:#1D3557/g, 'background:var(--hero1)'],
  [/#F1FAEE/g, 'var(--onhero)'],
  [/#A8DADC/g, 'var(--onhero2)'],
  [/rgba\(241,250,238,\.(\d+)\)/g, 'var(--herofill)'],
  [/rgba\(168,218,220,\.(\d+)\)/g, 'var(--heroline)']
];
// Only touch HTML measure bodies (not Color measures, which were rewritten above).
t = t.replace(/(\tmeasure 'HTML [^']+' =\n)([\s\S]*?)(\n\t\t(?:formatString|displayFolder|lineageTag))/g, (m, head, body, tail) => {
  let b = body;
  if (!/HTML Theme CSS/.test(head)) for (const [re, rep] of swaps) b = b.replace(re, rep);
  return head + b + tail;
});

// Descriptions that name the old palette.
t = t.replace(/Shown in the alert colour \(#E63946\)\./g, 'Shown in the Bad status colour.');
t = t.replace(/\/\/ Used in : Overview funding progress rings \/ gap callout \(punch-red #E63946\)\./g, '// Used in : Overview funding progress rings / gap callout (Bad status colour).');
t = t.replace(/Gap line uses --alert \(#E63946\), the only red on the page\./g, 'Gap line uses --alert (the Bad status colour).');
t = t.replace(/the funding gap in the alert colour\./g, 'the funding gap in the Bad status colour.');

fs.writeFileSync(FILE, t.replace(/\n/g, EOL));
const left = (t.match(/#(1D3557|457B9D|A8DADC|F1FAEE|E63946|101D30|14253D|3F5370|D4EDEE|E3EBF0|2A4466)\b/g) || []);
console.log('recoloured; leftover old-palette hexes:', left.length ? [...new Set(left)].join(' ') : 'none');
