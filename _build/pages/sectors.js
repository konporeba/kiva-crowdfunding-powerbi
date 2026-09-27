// Sectors & Activities: metric switcher (field parameter tiles) + sector bar chart driven by it /
// sector -> activity treemap / HTML sector leaderboard.
// Treemap colours: darker palette shades only, so white category labels stay readable in both themes.
const SECTOR_COLORS = [
  ['Agriculture', '#03624C'], ['Food', '#06302B'], ['Retail', '#17876D'], ['Services', '#2E7D6A'], ['Clothing', '#0B453A'],
  ['Education', '#032221'], ['Housing', '#5C6868'], ['Personal Use', '#707D7D'], ['Arts', '#03624C'], ['Transportation', '#06302B'],
  ['Health', '#17876D'], ['Construction', '#2E7D6A'], ['Manufacturing', '#0B453A'], ['Entertainment', '#032221'], ['Wholesale', '#5C6868']
];

module.exports = ({ page, L, pos, visualFile, htmlVisual, dualEntry, CX }) => {
  const { Ls, Ld, Li, Lb, props, withSel, fillM, fillL, mProj, cProj, cardVCO, columnField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  const PARAM = { entity: 'Sector Metric', column: 'Sector Metric' };

  // Metric switcher: one tile per field-parameter option, single select, 'Amount' pre-selected.
  // Metric switcher: classic slicer as a single-select horizontal list ('Amount' pre-selected).
  // (A tile slicer on a field parameter dropped the selected tile's text, and a Label measure errored.)
  const metric = {
    visualType: 'slicer',
    query: { queryState: { Values: { projections: [{ ...cProj(PARAM.entity, PARAM.column), displayName: 'Metric' }] } } },
    objects: {
      data: [props({ mode: Ls('Basic') })],
      selection: [props({ singleSelect: Lb(true), strictSingleSelect: Lb(true), selectAllCheckboxEnabled: Lb(false) })],
      header: [props({ show: Lb(false) })],
      items: [props({ fontColor: fillM('Color Text'), background: fillM('Color Card'), textSize: Ld(10.5), fontFamily: Ls('Segoe UI Semibold'), padding: Ld(4) })],
      general: [props({ orientation: Ld(1), filter: { filter: {
        Version: 2,
        From: [{ Name: 'p', Entity: PARAM.entity, Type: 0 }],
        Where: [{ Condition: { In: {
          Expressions: [{ Column: { Expression: { SourceRef: { Source: 'p' } }, Property: PARAM.column } }],
          Values: [[{ Literal: { Value: "'Amount'" } }]]
        } } }]
      } } })]
    },
    visualContainerObjects: {
      background: [props({ show: Lb(true), color: fillM('Color Card'), transparency: Ld(0) })],
      border: [props({ show: Lb(true), color: fillM('Color Border'), radius: Ld(8), width: Ld(1) })],
      title: [props({ show: Lb(false) })],
      visualHeader: [props({ show: Lb(false) })],
      dropShadow: [props({ show: Lb(false) })],
      padding: [props({ top: Ld(6), bottom: Ld(6), left: Ld(10), right: Ld(10) })]
    }
  };
  add('metric', pos(CX, 100, 580, 52), metric);

  // Bar chart: Y bound to the field parameter (Desktop re-projects the selected measure on render).
  add('bars', pos(CX, 164, 580, 540), {
    visualType: 'clusteredBarChart',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Loans', 'sector'), displayName: 'Sector', active: true }] },
      Y: {
        projections: [mProj('Total Loan Amount')],
        fieldParameters: [{ parameterExpr: { Column: { Expression: { SourceRef: { Entity: PARAM.entity } }, Property: PARAM.column } }, index: 0, length: 1, sortDirection: 'Descending' }]
      }
    } },
    objects: {
      dataPoint: [props({ defaultColor: fillM('Color Series Primary') })],
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(9), labelPosition: Ls('OutsideEnd') })],
      categoryAxis: [props({ labelColor: fillM('Color Text'), fontSize: Ld(9.5), showAxisTitle: Lb(false) })],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(35) })]
    },
    visualContainerObjects: cardVCO({ title: 'Sectors ranked by the selected metric', subtitle: 'Pick a metric above: amount, loans, average loan, women %, days to fund or funded %.' })
  });

  add('treemap', pos(CX + 592, 100, 584, 292), {
    visualType: 'treemap',
    query: { queryState: {
      Group: { projections: [{ ...cProj('Loans', 'sector'), displayName: 'Sector', active: true }] },
      Details: { projections: [{ ...cProj('Loans', 'activity'), displayName: 'Activity', active: true }] },
      Values: { projections: [{ ...mProj('Total Loan Amount'), displayName: 'Amount' }] }
    } },
    objects: {
      dataPoint: SECTOR_COLORS.map(([sector, hex]) => ({ properties: { fill: fillL(hex) }, selector: { data: [{ scopeId: { Comparison: { ComparisonKind: 0, Left: columnField('Loans', 'sector'), Right: { Literal: { Value: "'" + sector + "'" } } } } }] } })),
      categoryLabels: [props({ show: Lb(true), color: fillL('#FFFFFF'), fontSize: Ld(9) })],
      labels: [props({ show: Lb(false) })],
      legend: [props({ show: Lb(false) })]
    },
    visualContainerObjects: cardVCO({ title: 'What the money pays for', subtitle: 'Loan amount by sector and activity. Click a sector to filter the page.' })
  });

  add('leaderboard', pos(CX + 592, 404, 584, 300), htmlVisual('HTML Sector Leaderboard'));
  return out;
};
