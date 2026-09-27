// Sectors & Activities: metric switcher (field parameter) driving every visual on the page:
// HTML vs-average lollipop ranking, HTML sector mosaic (size = amount, colour = metric) and the HTML leaderboard.
// All three read [Selected Sector Metric], so the switcher is a page-wide lens, not a single-chart toggle.
module.exports = ({ page, L, pos, visualFile, htmlVisual, dualEntry, CX }) => {
  const { Ls, Ld, Lb, props, fillM, fillL, mProj, cProj, cardVCO } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  const PARAM = { entity: 'Sector Metric', column: 'Sector Metric' };

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

  // Vs-average lollipop ranking for the selected metric (replaces the field-parameter bar chart).
  const ranking = htmlVisual('HTML Sector Vs Average');
  ranking.query.queryState.content.projections[0].displayName = 'Sector ranking';
  add('bars', pos(CX, 164, 580, 540), ranking);

  add('treemap', pos(CX + 592, 100, 584, 292), htmlVisual('HTML Sector Mosaic'));

  add('leaderboard', pos(CX + 592, 404, 584, 300), htmlVisual('HTML Sector Leaderboard'));
  return out;
};
