// Re-skin the report generator to the green role-based palette (2026-09-27 redesign).
// Swaps colour literals in gen.js, icons.js and the page builders. Idempotent.
const fs = require('fs');
const path = require('path');
const edit = (file, fn) => {
  const p = path.join(__dirname, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  fs.writeFileSync(p, after);
  const old = after.match(/#(1D3557|457B9D|A8DADC|F1FAEE|E63946|30566E|5B8FB0|3F5370|243F55|566881|5E7B7C)\b/g) || [];
  console.log(file.padEnd(20), before === after ? 'unchanged' : 'updated', old.length ? 'LEFTOVER ' + [...new Set(old)].join(' ') : '');
};

edit('gen.js', (s) => s
  // current-page highlight and Back button follow the theme (rail colour role)
  .replace(/fillL\('#457B9D'\), fillHover: fillL\('#30566E'\)/g, "fillM('Color Nav'), fillHover: fillM('Color Nav Active')")
  .replace(/fillL\('#457B9D'\)/g, "fillM('Color Nav Active')")
  .replace(/#F1FAEE/g, '#F1F7F6')      // text on the green rail
  .replace(/#A8DADC/g, '#AACBC4'));    // secondary text / hover wash on the rail

edit('icons.js', (s) => s
  .replace(/#F1FAEE/g, '#F1F7F6')
  .replace(/fill="#457B9D"/g, 'fill="#17876D"')
  .replace(/fill="#A8DADC"/g, 'fill="#00DF81"'));

edit('pages/home.js', (s) => s.replace(/#457B9D/g, '#03624C'));

const sectorShade = { '#457B9D': '#03624C', '#1D3557': '#06302B', '#30566E': '#17876D', '#5B8FB0': '#2E7D6A', '#3F5370': '#0B453A', '#243F55': '#032221', '#566881': '#5C6868', '#5E7B7C': '#707D7D' };
edit('pages/sectors.js', (s) => s.replace(/#(457B9D|1D3557|30566E|5B8FB0|3F5370|243F55|566881|5E7B7C)\b/g, (m) => sectorShade[m]));

edit('pages/geography.js', (s) => s
  .replace(/(positiveColor: fillL\(')#A8DADC('\)[\s\S]*?selector: \{ metadata: '_Measures\.Average Regional MPI' \})/, '$1#2CC295$2')
  .replace(/#A8DADC/g, '#AACBC4')
  .replace(/#E63946/g, '#C8414B'));
