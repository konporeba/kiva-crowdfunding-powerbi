// Writes the Kiva light theme (default mode) and registers it in report.json.
// Dark mode is NOT a second theme: Power BI cannot switch themes at runtime, so
// dark mode is driven by the 'Theme Mode' slicer + colour measures instead.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPORT = 'X:/Data Science for Good Kiva Crowdfunding/Data Science for Good Kiva Crowdfunding With AI.Report';
const THEME_NAME = 'KivaImpact';

// Design-system tokens (light mode). Keep in sync with the colour measures.
const T = {
  punchRed: '#E63946',
  honeydew: '#F1FAEE',
  frostedBlue: '#A8DADC',
  cerulean: '#457B9D',
  oxfordNavy: '#1D3557',
  white: '#FFFFFF',
  frostedTint: '#D4EDEE',   // frosted blue +50% (gridlines, subtle fills)
  ceruleanTint: '#86A9BF',  // cerulean +35%
  ceruleanShade: '#30566E', // cerulean -30%
  frostedShade: '#6D8E8F',  // frosted blue -35%
  navyTint: '#8E9AAB'       // navy +50%
};

const solid = (c) => ({ solid: { color: c } });
const FONT = 'Segoe UI';
const FONT_SEMI = 'Segoe UI Semibold';

const theme = {
  $schema: 'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-2.157.json',
  name: null, // set below
  dataColors: [T.cerulean, T.frostedBlue, T.oxfordNavy, T.ceruleanTint, T.ceruleanShade, T.frostedShade, T.navyTint, T.frostedTint],
  good: T.cerulean,
  neutral: T.frostedBlue,
  bad: T.punchRed,
  maximum: T.oxfordNavy,
  center: T.cerulean,
  minimum: T.frostedTint,
  null: T.navyTint,
  firstLevelElements: T.oxfordNavy,
  secondLevelElements: T.cerulean,
  thirdLevelElements: T.frostedTint,
  fourthLevelElements: T.navyTint,
  background: T.white,
  secondaryBackground: T.honeydew,
  tableAccent: T.cerulean,
  textClasses: {
    callout: { fontSize: 28, fontFace: FONT_SEMI, color: T.oxfordNavy },
    title: { fontSize: 12, fontFace: FONT_SEMI, color: T.oxfordNavy },
    header: { fontSize: 12, fontFace: FONT_SEMI, color: T.oxfordNavy },
    label: { fontSize: 10, fontFace: FONT, color: T.oxfordNavy }
  },
  visualStyles: {
    '*': {
      '*': {
        title: [{ show: true, fontFamily: FONT_SEMI, fontSize: 12, fontColor: solid(T.oxfordNavy), alignment: 'left' }],
        subTitle: [{ fontFamily: FONT, fontSize: 9, fontColor: solid(T.cerulean) }],
        background: [{ show: true, color: solid(T.white), transparency: 0 }],
        border: [{ show: true, color: solid(T.frostedBlue), radius: 12, width: 1 }],
        dropShadow: [{ show: false }],
        padding: [{ top: 12, bottom: 12, left: 14, right: 14 }],
        visualHeader: [{ show: true, background: solid(T.white), foreground: solid(T.cerulean), border: solid(T.white) }],
        visualTooltip: [{ background: solid(T.oxfordNavy), titleFontColor: solid(T.frostedBlue), valueFontColor: solid(T.honeydew), fontSize: 10 }],
        categoryAxis: [{ labelColor: solid(T.cerulean), fontFamily: FONT, fontSize: 9, titleColor: solid(T.cerulean), gridlineColor: solid(T.frostedTint), showAxisTitle: false }],
        valueAxis: [{ labelColor: solid(T.cerulean), fontFamily: FONT, fontSize: 9, titleColor: solid(T.cerulean), gridlineColor: solid(T.frostedTint), gridlineStyle: 'dotted', showAxisTitle: false }],
        legend: [{ labelColor: solid(T.oxfordNavy), fontFamily: FONT, fontSize: 9, position: 'Top' }],
        labels: [{ color: solid(T.oxfordNavy), fontFamily: FONT, fontSize: 9 }]
      }
    },
    page: {
      '*': {
        background: [{ color: solid(T.honeydew), transparency: 0 }],
        outspace: [{ color: solid(T.honeydew), transparency: 0 }],
        outspacePane: [{
          backgroundColor: solid(T.white), foregroundColor: solid(T.oxfordNavy), transparency: 0,
          titleSize: 12, headerSize: 10, fontFamily: FONT,
          border: true, borderColor: solid(T.frostedBlue),
          checkboxAndApplyColor: solid(T.cerulean), inputBoxColor: solid(T.white), searchTextSize: 10
        }],
        filterCard: [
          { $id: 'Applied', backgroundColor: solid(T.honeydew), foregroundColor: solid(T.oxfordNavy), border: true, borderColor: solid(T.frostedBlue), inputBoxColor: solid(T.white), transparency: 0, textSize: 10 },
          { $id: 'Available', backgroundColor: solid(T.white), foregroundColor: solid(T.oxfordNavy), border: true, borderColor: solid(T.frostedBlue), inputBoxColor: solid(T.white), transparency: 0, textSize: 10 }
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
        grid: [{ gridVertical: false, gridHorizontal: true, gridHorizontalColor: solid(T.frostedTint), outlineColor: solid(T.frostedBlue), rowPadding: 4 }],
        columnHeaders: [{ fontColor: solid(T.oxfordNavy), backColor: solid(T.white), fontFamily: FONT_SEMI, fontSize: 10, columnAdjustment: 'growToFit', autoSizeColumnWidth: true }],
        values: [{ fontColorPrimary: solid(T.oxfordNavy), backColorPrimary: solid(T.white), fontColorSecondary: solid(T.oxfordNavy), backColorSecondary: solid(T.honeydew), fontSize: 10 }]
      }
    },
    pivotTable: {
      '*': {
        stylePreset: [{ name: 'None' }],
        grid: [{ gridVertical: false, gridHorizontal: true, gridHorizontalColor: solid(T.frostedTint), outlineColor: solid(T.frostedBlue), rowPadding: 4 }],
        columnHeaders: [{ fontColor: solid(T.oxfordNavy), backColor: solid(T.white), fontFamily: FONT_SEMI, fontSize: 10, columnAdjustment: 'growToFit', autoSizeColumnWidth: true }],
        rowHeaders: [{ fontColor: solid(T.oxfordNavy), backColor: solid(T.white), fontSize: 10 }],
        values: [{ fontColorPrimary: solid(T.oxfordNavy), backColorPrimary: solid(T.white), fontColorSecondary: solid(T.oxfordNavy), backColorSecondary: solid(T.honeydew), fontSize: 10 }],
        subTotals: [{ fontColor: solid(T.oxfordNavy), backColor: solid(T.honeydew) }]
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
