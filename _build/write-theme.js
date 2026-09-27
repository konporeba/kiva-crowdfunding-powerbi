// Writes the Kiva light theme (green role-based palette) (default mode) and registers it in report.json.
// Dark mode is NOT a second theme: Power BI cannot switch themes at runtime, so
// dark mode is driven by the 'Theme Mode' slicer + colour measures instead.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPORT = 'X:/Data Science for Good Kiva Crowdfunding/Data Science for Good Kiva Crowdfunding With AI.Report';
const THEME_NAME = 'KivaImpact';

// Design-system tokens (light mode, role-based green palette). Keep in sync with the Color * measures.
const T = {
  page: '#F1F7F6',    // Anti-Flash White: page background
  card: '#FFFFFF',    // White: cards / visuals
  header: '#03624C',  // Bangladesh Green: header bar / elevated panel
  text: '#021B1A',    // Rich Black: primary text
  muted: '#707D7D',   // Stone: secondary text, axes
  border: '#AACBC4',  // Pistachio: borders & gridlines
  grid: '#DCE7E4',    // Pistachio tint: subtle gridlines / banding inside tables
  accent: '#03624C',  // Bangladesh Green: slicers, selected state, links
  hover: '#17876D',   // Frog: hover / secondary accent
  good: '#17876D', warning: '#D99A1E', bad: '#C8414B'
};
// Light series order from the style guide (alternating dark/light), then palette-derived extras
// so Power BI never auto-generates off-palette hues.
const SERIES = ['#03624C', '#2CC295', '#707D7D', '#06302B', '#AACBC4', '#17876D', '#0B453A', '#5C6868', '#00DF81', '#032221', '#CFE0DB', '#2E7D6A'];

const solid = (c) => ({ solid: { color: c } });
const FONT = 'Segoe UI';
const FONT_SEMI = 'Segoe UI Semibold';

const theme = {
  $schema: 'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-2.157.json',
  name: null, // set below
  dataColors: SERIES,
  good: T.good,
  neutral: T.warning,
  bad: T.bad,
  maximum: T.header,
  center: '#2CC295',
  minimum: T.grid,
  null: T.muted,
  firstLevelElements: T.text,
  secondLevelElements: T.muted,
  thirdLevelElements: T.grid,
  fourthLevelElements: T.muted,
  background: T.card,
  secondaryBackground: T.page,
  tableAccent: T.accent,
  textClasses: {
    callout: { fontSize: 28, fontFace: FONT_SEMI, color: T.text },
    title: { fontSize: 12, fontFace: FONT_SEMI, color: T.text },
    header: { fontSize: 12, fontFace: FONT_SEMI, color: T.text },
    label: { fontSize: 10, fontFace: FONT, color: T.text }
  },
  visualStyles: {
    '*': {
      '*': {
        title: [{ show: true, fontFamily: FONT_SEMI, fontSize: 12, fontColor: solid(T.text), alignment: 'left' }],
        subTitle: [{ fontFamily: FONT, fontSize: 9, fontColor: solid(T.muted) }],
        background: [{ show: true, color: solid(T.card), transparency: 0 }],
        border: [{ show: true, color: solid(T.border), radius: 8, width: 1 }],
        dropShadow: [{ show: false }],
        padding: [{ top: 12, bottom: 12, left: 14, right: 14 }],
        visualHeader: [{ show: true, background: solid(T.card), foreground: solid(T.muted), border: solid(T.card) }],
        visualTooltip: [{ background: solid(T.text), titleFontColor: solid(T.border), valueFontColor: solid(T.page), fontSize: 10 }],
        categoryAxis: [{ labelColor: solid(T.muted), fontFamily: FONT, fontSize: 9, titleColor: solid(T.muted), gridlineColor: solid(T.grid), showAxisTitle: false }],
        valueAxis: [{ labelColor: solid(T.muted), fontFamily: FONT, fontSize: 9, titleColor: solid(T.muted), gridlineColor: solid(T.grid), gridlineStyle: 'dotted', showAxisTitle: false }],
        legend: [{ labelColor: solid(T.text), fontFamily: FONT, fontSize: 9, position: 'Top' }],
        labels: [{ color: solid(T.text), fontFamily: FONT, fontSize: 9 }]
      }
    },
    page: {
      '*': {
        background: [{ color: solid(T.page), transparency: 0 }],
        outspace: [{ color: solid(T.page), transparency: 0 }],
        outspacePane: [{
          backgroundColor: solid(T.card), foregroundColor: solid(T.text), transparency: 0,
          titleSize: 12, headerSize: 10, fontFamily: FONT,
          border: true, borderColor: solid(T.border),
          checkboxAndApplyColor: solid(T.accent), inputBoxColor: solid(T.card), searchTextSize: 10
        }],
        filterCard: [
          { $id: 'Applied', backgroundColor: solid(T.page), foregroundColor: solid(T.text), border: true, borderColor: solid(T.border), inputBoxColor: solid(T.card), transparency: 0, textSize: 10 },
          { $id: 'Available', backgroundColor: solid(T.card), foregroundColor: solid(T.text), border: true, borderColor: solid(T.border), inputBoxColor: solid(T.card), transparency: 0, textSize: 10 }
        ]
      }
    },
    // Textboxes, shapes, images and buttons sit on the canvas/nav: no card chrome by default.
    textbox: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }], padding: [{ top: 0, bottom: 0, left: 0, right: 0 }] } },
    shape: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }] } },
    image: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }] } },
    actionButton: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }], visualHeader: [{ show: false }] } },
    pageNavigator: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }], visualHeader: [{ show: false }] } },
    bookmarkNavigator: { '*': { background: [{ show: false }], border: [{ show: false }], title: [{ show: false }], visualHeader: [{ show: false }] } },
    tableEx: {
      '*': {
        stylePreset: [{ name: 'None' }],
        grid: [{ gridVertical: false, gridHorizontal: true, gridHorizontalColor: solid(T.grid), outlineColor: solid(T.border), rowPadding: 4 }],
        columnHeaders: [{ fontColor: solid(T.text), backColor: solid(T.card), fontFamily: FONT_SEMI, fontSize: 10, columnAdjustment: 'growToFit', autoSizeColumnWidth: true }],
        values: [{ fontColorPrimary: solid(T.text), backColorPrimary: solid(T.card), fontColorSecondary: solid(T.text), backColorSecondary: solid(T.page), fontSize: 10 }]
      }
    },
    pivotTable: {
      '*': {
        stylePreset: [{ name: 'None' }],
        grid: [{ gridVertical: false, gridHorizontal: true, gridHorizontalColor: solid(T.grid), outlineColor: solid(T.border), rowPadding: 4 }],
        columnHeaders: [{ fontColor: solid(T.text), backColor: solid(T.card), fontFamily: FONT_SEMI, fontSize: 10, columnAdjustment: 'growToFit', autoSizeColumnWidth: true }],
        rowHeaders: [{ fontColor: solid(T.text), backColor: solid(T.card), fontSize: 10 }],
        values: [{ fontColorPrimary: solid(T.text), backColorPrimary: solid(T.card), fontColorSecondary: solid(T.text), backColorSecondary: solid(T.page), fontSize: 10 }],
        subTotals: [{ fontColor: solid(T.text), backColor: solid(T.page) }]
      }
    },
    advancedSlicerVisual: { '*': { title: [{ show: false }] } },
    filterSlicer: { '*': { title: [{ show: false }] } }
  }
};

// --- Write theme with a fresh cache-busting suffix, removing any previous version ---
const rrDir = path.join(REPORT, 'StaticResources', 'RegisteredResources');
fs.mkdirSync(rrDir, { recursive: true });
const fileName = `${THEME_NAME}-${crypto.randomBytes(4).toString('hex')}.json`;
theme.name = fileName;
for (const f of fs.readdirSync(rrDir)) {
  if (f.startsWith(THEME_NAME + '-') && f.endsWith('.json')) fs.unlinkSync(path.join(rrDir, f));
}
fs.writeFileSync(path.join(rrDir, fileName), JSON.stringify(theme, null, 2));

// --- Register in report.json ---
const reportPath = path.join(REPORT, 'definition', 'report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
report.themeCollection.customTheme = {
  name: fileName,
  reportVersionAtImport: report.themeCollection.baseTheme.reportVersionAtImport,
  type: 'RegisteredResources'
};
report.resourcePackages = report.resourcePackages.filter((p) => p.name !== 'RegisteredResources');
report.resourcePackages.push({
  name: 'RegisteredResources',
  type: 'RegisteredResources',
  items: [{ name: fileName, path: fileName, type: 'CustomTheme' }]
});
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('theme written:', fileName);
