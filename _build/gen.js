// Kiva report generator: rewrites every page, the nav chrome, bookmarks and icon
// resources from the spec below. Run with Desktop open, then `powerbi-desktop reload`.
//   node gen.js
const fs = require('fs');
const path = require('path');
const L = require('./lib');
const icons = require('./icons');
const { hid, Ls, Ld, Li, Lb, fillM, fillL, props, withSel, mProj, cProj, imageRef, cardVCO, bareVCO } = L;

const REPORT = 'X:/Data Science for Good Kiva Crowdfunding/Data Science for Good Kiva Crowdfunding With AI.Report';
const DEF = path.join(REPORT, 'definition');
const RR = path.join(REPORT, 'StaticResources', 'RegisteredResources');

// ---------------------------------------------------------------- layout
const W = 1280, H = 720;
const RAIL_W = 64;          // collapsed nav rail
const DRAWER_W = 208;       // expanded labels drawer, sits right of the rail
const CX = 88;              // content left edge
const CW = W - CX - 16;     // content width (1176)
const NAV_Y0 = 128, NAV_STEP = 52, NAV_H = 44;

// ---------------------------------------------------------------- pages
// `nav: true` pages appear in the rail/drawer. Content builders live in ./pages/<key>.js.
const PAGES = [
  { key: 'home', name: 'Home', icon: 'home', nav: true, slicers: false },
  { key: 'overview', name: 'Overview', icon: 'overview', nav: true, slicers: true,
    subtitle: 'Headline lending volume, funding progress and how Kiva lending evolved month by month.' },
  { key: 'geography', name: 'Geography & Poverty', icon: 'geography', nav: true, slicers: true,
    subtitle: 'Where Kiva capital flows, and how poor those places are (Multidimensional Poverty Index).' },
  { key: 'sectors', name: 'Sectors & Activities', icon: 'sectors', nav: true, slicers: true,
    subtitle: 'What borrowers use their loans for, from agriculture and food to education.' },
  { key: 'borrowers', name: 'Borrowers & Gender', icon: 'borrowers', nav: true, slicers: true,
    subtitle: 'Who borrows on Kiva: women, groups and how they repay.' },
  { key: 'funding', name: 'Funding Dynamics', icon: 'funding', nav: true, slicers: true,
    subtitle: 'How fast lenders fund loans, and how field partners pre-disburse before funding arrives.' },
  { key: 'partners', name: 'Partners & Themes', icon: 'partners', nav: true, slicers: true,
    subtitle: 'The field partners behind the loans, the themes they run and how rural their reach is.' },
  { key: 'explore', name: 'Explore', icon: 'explore', nav: true, slicers: true,
    subtitle: 'Ask your own questions: break lending down by any dimension.' },
  { key: 'about', name: 'About', icon: 'about', nav: true, slicers: false,
    subtitle: 'Data sources, metric definitions and methodology notes.' },
  { key: 'country', name: 'Country Profile', nav: false, slicers: false, hidden: true, drillthrough: { entity: 'Countries', column: 'Country' },
    subtitle: 'Drill-through: right-click any country and choose Drill through > Country Profile.' },
  { key: 'tooltip', name: 'Country Tooltip', nav: false, slicers: false, hidden: true, tooltip: true, width: 320, height: 200 }
];
for (const p of PAGES) p.id = hid('page:' + p.key);

// ---------------------------------------------------------------- global slicers (synced)
const SLICERS = [
  { key: 'year', label: 'Year', entity: 'Date', column: 'Year', group: 'SyncYear' },
  { key: 'region', label: 'World Region', entity: 'Countries', column: 'World Region', group: 'SyncWorldRegion' },
  { key: 'country', label: 'Country', entity: 'Countries', column: 'Country', group: 'SyncCountry' },
  { key: 'sector', label: 'Sector', entity: 'Loans', column: 'sector', group: 'SyncSector' }
];

// ---------------------------------------------------------------- visual builders
// actionButton / navigators need a selector-less entry next to the id:'default' entry
// (formatting.md 'Dual-Entry Pattern'); without it the state overrides are silently dropped.
function dualEntry(objects) {
  for (const arr of Object.values(objects)) {
    const def = arr.find((e) => e.selector && e.selector.id === 'default');
    if (def && !arr.some((e) => !e.selector)) arr.unshift({ properties: JSON.parse(JSON.stringify(def.properties)) });
  }
  return objects;
}
let zCounter = 0;
const pos = (x, y, w, h, z) => ({ x, y, z: z ?? (zCounter += 100), height: h, width: w, tabOrder: z ?? zCounter });

function visualFile(page, key, position, visual, extra = {}) {
  return { name: hid(`${page.key}:${key}`), key, json: { $schema: L.SCHEMA.visual, name: hid(`${page.key}:${key}`), position, visual, ...extra } };
}

const shapeRect = ({ fill, radius = 0, outline }) => ({
  visualType: 'shape',
  objects: {
    shape: [withSel({ tileShape: Ls(radius ? 'rectangleRoundedByPixel' : 'rectangle'), ...(radius ? { roundEdge: Li(radius) } : {}) }, 'default')],
    fill: [withSel({ show: Lb(true), fillColor: fill, transparency: Ld(0) }, 'default')],
    outline: [withSel(outline ? { show: Lb(true), lineColor: outline, weight: Ld(1), transparency: Ld(0) } : { show: Lb(false) }, 'default')]
  },
  visualContainerObjects: bareVCO()
});

// Text label. Implemented as an action-less button: shape text and 'fill off' do not render
// reliably, while button text renders and its colour can follow the theme via a measure.
const shapeText = ({ text, size, color, bold = false, family = 'Segoe UI', align = 'left', valign = 'middle' }) => {
  const states = ['default', 'hover', 'selected'];
  const noFill = { show: Lb(true), fillColor: fillL('#FFFFFF'), transparency: Ld(100) };
  return {
    visualType: 'actionButton',
    objects: dualEntry({
      shape: [props({ tileShape: Ls('rectangle') })],
      fill: states.map((st) => withSel(noFill, st)),
      outline: states.map((st) => withSel({ show: Lb(false) }, st)),
      icon: states.map((st) => withSel({ show: Lb(false) }, st)),
      text: states.map((st) => withSel({
        show: Lb(true), text: Ls(text), fontFamily: Ls(bold && family === 'Segoe UI' ? 'Segoe UI Semibold' : family), fontSize: Ld(size), bold: Lb(false),
        fontColor: color, horizontalAlignment: Ls(align), verticalAlignment: Ls(valign),
        leftMargin: Li(0), rightMargin: Li(0), topMargin: Li(0), bottomMargin: Li(0)
      }, st))
    }),
    visualContainerObjects: bareVCO({ visualLink: [props({ show: Lb(false) })] })
  };
};

// Button with optional custom icon, label and action.
function button({ icon, text, action, fill, fillHover, textColor = fillL('#F1FAEE'), align = 'center', iconOnly = false, fontSize = 10, bold = false, tooltip }) {
  const states = ['default', 'hover', 'selected'];
  const objects = {
    shape: [props({ tileShape: Ls('rectangleRoundedByPixel'), roundEdge: Li(10) })],
    fill: [
      withSel(fill ? { show: Lb(true), fillColor: fill, transparency: Ld(0) } : { show: Lb(true), fillColor: fillL('#FFFFFF'), transparency: Ld(100) }, 'default'),
      withSel(fill ? { show: Lb(true), fillColor: fill, transparency: Ld(0) } : { show: Lb(true), fillColor: fillL('#FFFFFF'), transparency: Ld(100) }, 'selected'),
      withSel({ show: Lb(true), fillColor: fillHover || fillL('#A8DADC'), transparency: Ld(fillHover ? 0 : 82) }, 'hover')
    ],
    outline: states.map((s) => withSel({ show: Lb(false) }, s)),
    icon: states.map((s) => withSel(icon
      ? { show: Lb(true), shapeType: Ls('custom'), image: { image: { name: Ls(icon + '.svg'), url: imageRef(iconFile(icon)), scaling: Ls('Fit') } }, iconSize: Ld(22), placement: Ls(iconOnly ? 'custom' : 'left'), horizontalAlignment: Ls(iconOnly ? 'center' : 'left'), verticalAlignment: Ls('middle'), leftMargin: Li(iconOnly ? 0 : 12) }
      : { show: Lb(false) }, s)),
    text: states.map((s) => withSel(text && !iconOnly
      ? { show: Lb(true), text: Ls(text), fontColor: textColor, fontFamily: Ls(bold ? 'Segoe UI Semibold' : 'Segoe UI'), fontSize: Ld(fontSize), horizontalAlignment: Ls(align), verticalAlignment: Ls('middle'), leftMargin: Li(icon ? 8 : 14) }
      : { show: Lb(false) }, s))
  };
  const link = action
    ? { show: Lb(true), type: Ls(action.type), ...(action.page ? { navigationSection: Ls(action.page) } : {}), ...(action.bookmark ? { bookmark: Ls(action.bookmark) } : {}), ...(tooltip ? { tooltip: Ls(tooltip) } : {}) }
    : { show: Lb(false) };
  return { visualType: 'actionButton', objects: dualEntry(objects), visualContainerObjects: bareVCO({ visualLink: [props(link)] }), drillFilterOtherVisuals: true };
}

const htmlVisual = (measure) => ({
  visualType: L.HTML_VISUAL,
  query: { queryState: { content: { projections: [mProj(measure)] } } },
  objects: { contentFormatting: [props({ showRawHtml: Lb(false), noDataMessage: Ls(' ') })] },
  visualContainerObjects: bareVCO()
});

function dropdownSlicer(s) {
  return {
    visualType: 'slicer',
    syncGroup: { groupName: s.group, fieldChanges: true, filterChanges: true },
    query: { queryState: { Values: { projections: [cProj(s.entity, s.column)] } } },
    objects: {
      data: [props({ mode: Ls('Dropdown') })],
      header: [props({ show: Lb(true), text: Ls(s.label), fontColor: fillM('Color Text Muted'), textSize: Ld(9), fontFamily: Ls('Segoe UI Semibold') })],
      items: [props({ fontColor: fillM('Color Text'), background: fillM('Color Card'), textSize: Ld(10), fontFamily: Ls('Segoe UI') })]
    },
    visualContainerObjects: {
      background: [props({ show: Lb(true), color: fillM('Color Card'), transparency: Ld(0) })],
      border: [props({ show: Lb(true), color: fillM('Color Border'), radius: Ld(10), width: Ld(1) })],
      title: [props({ show: Lb(false) })],
      dropShadow: [props({ show: Lb(false) })],
      visualHeader: [props({ show: Lb(false) })],
      padding: [props({ top: Ld(6), bottom: Ld(6), left: Ld(10), right: Ld(10) })]
    }
  };
}

// Light/Dark toggle: two icon tiles (sun / moon), single-select, Light pre-selected, synced on every page.
function themeToggle() { return finishDual(themeToggleRaw()); }
function finishDual(v) { delete v.__dual; dualEntry(v.objects); return v; }
function themeToggleRaw() {
  const modeCol = L.columnField('Theme Mode', 'Mode');
  return {
    visualType: 'advancedSlicerVisual',
    __dual: true,
    syncGroup: { groupName: 'SyncThemeMode', fieldChanges: true, filterChanges: true },
    query: { queryState: {
      Values: { projections: [cProj('Theme Mode', 'Mode')] },
      Label: { projections: [mProj('Theme Mode Icon')] }
    } },
    objects: {
      selection: [props({ singleSelect: Lb(true), strictSingleSelect: Lb(true), selectAllCheckboxEnabled: Lb(false) })],
      layout: [props({ rowCount: Li(2), columnCount: Li(1), cellPadding: Li(6), backgroundShow: Lb(false), rectangleRoundedCurve: Li(10) })],
      value: [props({ show: Lb(false) })],
      label: [
        withSel({ show: Lb(true), fontSize: Ld(15), fontColor: fillL('#A8DADC'), horizontalAlignment: Ls('center'), position: Ls('aboveValue') }, 'default'),
        withSel({ show: Lb(true), fontSize: Ld(15), fontColor: fillL('#F1FAEE'), horizontalAlignment: Ls('center') }, 'selected')
      ],
      background: ['default', 'selected', 'hover'].map((st) => withSel({ show: Lb(false) }, st)),
      fillCustom: [props({ show: Lb(false) })],
      outline: ['default', 'selected', 'hover'].map((s) => withSel({ show: Lb(false) }, s)),
      shapeCustomRectangle: [props({ tileShape: Ls('rectangleRoundedByPixel'), rectangleRoundedCurve: Li(10) })],
      general: [props({
        filter: { filter: {
          Version: 2,
          From: [{ Name: 't', Entity: 'Theme Mode', Type: 0 }],
          Where: [{ Condition: { In: {
            Expressions: [{ Column: { Expression: { SourceRef: { Source: 't' } }, Property: 'Mode' } }],
            Values: [[{ Literal: { Value: `'${process.env.KIVA_MODE || 'Light'}'` } }]]
          } } }]
        } }
      })]
    },
    visualContainerObjects: {
      ...bareVCO(),
      visualTooltip: [props({ show: Lb(false) })]
    }
  };
}

// ---------------------------------------------------------------- icons
const iconFile = (name) => `kiva-icon-${name}.svg`;

// ---------------------------------------------------------------- chrome per page
function chrome(page, bookmarks) {
  const out = [];
  if (page.tooltip) return out;
  const add = (key, position, visual, extra) => out.push(visualFile(page, key, position, visual, extra));

  // Full-canvas background (the page background itself cannot take a measure colour).
  add('bg', pos(0, 0, W, H, 0), shapeRect({ fill: fillM('Color Page') }));

  // Rail
  add('rail', pos(0, 0, RAIL_W, H, 30000), shapeRect({ fill: fillM('Color Nav') }));
  add('logo', pos(12, 16, 40, 40, 30100), button({ icon: 'logo', iconOnly: true, fillHover: fillM('Color Nav'), action: { type: 'PageNavigation', page: PAGES[0].id }, tooltip: 'Home' }));
  add('menu', pos(8, 72, 48, NAV_H, 30200), button({ icon: 'menu', iconOnly: true, action: { type: 'Bookmark', bookmark: bookmarks.open }, tooltip: 'Expand menu' }));
  PAGES.filter((p) => p.nav).forEach((p, i) => {
    const current = p.key === page.key;
    add('rail-' + p.key, pos(8, NAV_Y0 + i * NAV_STEP, 48, NAV_H, 30300 + i),
      button({ icon: p.icon, iconOnly: true, fill: current ? fillL('#457B9D') : null, action: current ? null : { type: 'PageNavigation', page: p.id }, tooltip: p.name }));
  });
  add('theme-toggle', pos(8, 612, 48, 96, 30900), themeToggle());

  // Drawer (hidden group, opened/closed by this page's bookmarks). Child positions are relative to the group.
  const groupName = hid(`${page.key}:drawer`);
  out.push({ name: groupName, key: 'drawer', json: {
    $schema: L.SCHEMA.visual, name: groupName,
    position: { x: RAIL_W, y: 0, z: 40000, height: H, width: DRAWER_W, tabOrder: 40000 },
    visualGroup: { displayName: 'Nav drawer', groupMode: 'ScaleMode' },
    isHidden: !process.env.KIVA_DRAWER_OPEN
  } });
  const child = (key, position, visual) => add(key, position, visual, { parentGroupName: groupName });
  child('drawer-bg', pos(0, 0, DRAWER_W, H, 40010), shapeRect({ fill: fillM('Color Nav') }));
  child('drawer-title', pos(8, 16, DRAWER_W - 16, 40, 40020), shapeText({ text: 'Kiva Impact', size: 15, color: fillL('#F1FAEE'), bold: true, family: 'Segoe UI Semibold' }));
  child('drawer-close', pos(0, 72, DRAWER_W - 8, NAV_H, 40030), button({ icon: 'close', text: 'Collapse', align: 'left', textColor: fillL('#A8DADC'), action: { type: 'Bookmark', bookmark: bookmarks.close } }));
  PAGES.filter((p) => p.nav).forEach((p, i) => {
    const current = p.key === page.key;
    child('drawer-' + p.key, pos(0, NAV_Y0 + i * NAV_STEP, DRAWER_W - 8, NAV_H, 40100 + i),
      button({ text: p.name, align: 'left', bold: current, fontSize: 10.5, textColor: fillL(current ? '#F1FAEE' : '#A8DADC'), fill: current ? fillL('#457B9D') : null, action: current ? { type: 'Bookmark', bookmark: bookmarks.close } : { type: 'PageNavigation', page: p.id } }));
  });
  child('drawer-foot', pos(14, 640, DRAWER_W - 28, 56, 40200), shapeText({ text: 'Light / dark mode: use the toggle in the rail.', size: 8.5, color: fillL('#A8DADC') }));

  // Page header + synced slicers (analysis pages only)
  if (page.key !== 'home') {
    add('title', pos(CX, 14, 560, 34, 1000), shapeText({ text: page.name, size: 20, color: fillM('Color Text'), bold: true, family: 'Segoe UI Semibold', valign: 'top' }));
    add('subtitle', pos(CX, 50, 560, 34, 1010), shapeText({ text: page.subtitle || '', size: 9.5, color: fillM('Color Text Muted'), valign: 'top' }));
  }
  if (page.drillthrough) {
    add('back', pos(W - 16 - 132, 22, 132, 40, 1100), button({ icon: 'close', text: 'Back', align: 'left', fill: fillL('#457B9D'), fillHover: fillL('#30566E'), action: { type: 'Back' }, tooltip: 'Back to the previous page' }));
  }
  if (page.slicers) {
    const sw = 150, gap = 10, x0 = W - 16 - (SLICERS.length * sw + (SLICERS.length - 1) * gap);
    SLICERS.forEach((s, i) => add('slicer-' + s.key, pos(x0 + i * (sw + gap), 10, sw, 76, 1100 + i), dropdownSlicer(s)));
  }
  return out;
}

// ---------------------------------------------------------------- write
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }

function main() {
  // Icons -> RegisteredResources + report.json registration
  fs.mkdirSync(RR, { recursive: true });
  for (const f of fs.readdirSync(RR)) if (f.startsWith('kiva-icon-')) fs.unlinkSync(path.join(RR, f));
  for (const [name, svg] of Object.entries(icons)) fs.writeFileSync(path.join(RR, iconFile(name)), svg);
  const reportPath = path.join(DEF, 'report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const pkg = report.resourcePackages.find((p) => p.name === 'RegisteredResources');
  pkg.items = pkg.items.filter((it) => !it.name.startsWith('kiva-icon-'));
  for (const name of Object.keys(icons)) pkg.items.push({ name: iconFile(name), path: iconFile(name), type: 'Image' });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Pages
  const pagesDir = path.join(DEF, 'pages');
  for (const d of fs.readdirSync(pagesDir)) if (d !== 'pages.json') rmrf(path.join(pagesDir, d));
  const bookmarkDir = path.join(DEF, 'bookmarks');
  rmrf(bookmarkDir);
  fs.mkdirSync(bookmarkDir, { recursive: true });
  const bookmarkNames = [];

  for (const page of PAGES) {
    zCounter = 2000;
    const bm = { open: 'Bookmark' + hid(`bm-open:${page.key}`), close: 'Bookmark' + hid(`bm-close:${page.key}`) };
    const pageDir = path.join(pagesDir, page.id);
    fs.mkdirSync(path.join(pageDir, 'visuals'), { recursive: true });
    const pageJson = { $schema: L.SCHEMA.page, name: page.id, displayName: page.name, displayOption: 'FitToPage', height: page.height || H, width: page.width || W,
      objects: { outspace: [props({ color: fillL('#F1FAEE') })] } };
    if (page.hidden) pageJson.visibility = 'HiddenInViewMode';
    if (page.tooltip) {
      pageJson.type = 'Tooltip';
      pageJson.pageBinding = { name: 'Pod' + hid('tip:' + page.key), type: 'Tooltip', parameters: [] };
    }
    if (page.drillthrough) {
      const dt = page.drillthrough;
      const filterName = 'Filter' + hid('dt:' + page.key).slice(0, 20) + '0000';
      const fieldExpr = L.columnField(dt.entity, dt.column);
      pageJson.type = 'Drillthrough';
      pageJson.filterConfig = { filters: [{ name: filterName, field: fieldExpr, type: 'Categorical', howCreated: 'Drillthrough' }] };
      pageJson.pageBinding = { name: 'Pod' + hid('dtpod:' + page.key), type: 'Drillthrough', parameters: [{ name: 'Param_' + filterName, boundFilter: filterName, fieldExpr }] };
    }
    fs.writeFileSync(path.join(pageDir, 'page.json'), JSON.stringify(pageJson, null, 2));

    let content = [];
    const builderPath = path.join(__dirname, 'pages', page.key + '.js');
    if (fs.existsSync(builderPath)) {
      delete require.cache[require.resolve(builderPath)];
      content = require(builderPath)({ page, PAGES, L, pos, visualFile, htmlVisual, button, shapeRect, shapeText, dualEntry, CX, CW, W, H });
    }
    const drawer = hid(`${page.key}:drawer`);
    for (const v of [...chrome(page, bm), ...content]) {
      const dir = path.join(pageDir, 'visuals', v.name);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'visual.json'), JSON.stringify(v.json, null, 2));
    }

    // Nav drawer bookmarks: toggle only the drawer group, keep data/filters/theme untouched.
    for (const [kind, hidden] of (page.tooltip ? [] : [['open', false], ['close', true]])) {
      const b = {
        $schema: L.SCHEMA.bookmark,
        displayName: `Nav ${kind === 'open' ? 'Open' : 'Close'} - ${page.name}`,
        name: bm[kind],
        options: { targetVisualNames: [drawer], applyOnlyToTargetVisuals: true, suppressData: true, suppressActiveSection: true },
        explorationState: {
          version: '1.3',
          activeSection: page.id,
          sections: { [page.id]: { visualContainers: {}, visualContainerGroups: { [drawer]: { isHidden: hidden } } } }
        }
      };
      fs.writeFileSync(path.join(bookmarkDir, bm[kind] + '.bookmark.json'), JSON.stringify(b, null, 2));
      bookmarkNames.push(bm[kind]);
    }
  }
  fs.writeFileSync(path.join(bookmarkDir, 'bookmarks.json'), JSON.stringify({
    $schema: L.SCHEMA.bookmarks,
    items: [{ name: 'Bookmark' + hid('bm-group:nav'), displayName: 'Navigation (drawer)', children: bookmarkNames }]
  }, null, 2));

  fs.writeFileSync(path.join(pagesDir, 'pages.json'), JSON.stringify({
    $schema: L.SCHEMA.pages, pageOrder: PAGES.map((p) => p.id), activePageName: PAGES[0].id
  }, null, 2));
  console.log('pages:', PAGES.map((p) => `${p.name}=${p.id}`).join(', '));
}

main();
