// Partners & Themes: KPI strip (HTML) / partner leaderboard (HTML) /
// top-10 loan theme types (native bar + TopN filter) / rural share by sector (native bar, Themes By Region).
const crypto = require('crypto');

// Visual-level Top N filter on a column, ranked by a _Measures measure (filters.md template).
function topNFilter(entity, column, measure, n) {
  const col = (src) => ({ Column: { Expression: { SourceRef: { Source: src } }, Property: column } });
  return {
    name: 'Filter' + crypto.createHash('sha1').update(`topn:${entity}:${column}:${measure}:${n}`).digest('hex').slice(0, 24),
    field: { Column: { Expression: { SourceRef: { Entity: entity } }, Property: column } },
    type: 'TopN',
    filter: {
      Version: 2,
      From: [
        { Name: 'subquery', Expression: { Subquery: { Query: {
          Version: 2,
          From: [{ Name: 'l', Entity: entity, Type: 0 }, { Name: 'm', Entity: '_Measures', Type: 0 }],
          Select: [{ ...col('l'), Name: 'field' }],
          OrderBy: [{ Direction: 2, Expression: { Measure: { Expression: { SourceRef: { Source: 'm' } }, Property: measure } } }],
          Top: n
        } } }, Type: 2 },
        { Name: 'a', Entity: entity, Type: 0 }
      ],
      Where: [{ Condition: { In: { Expressions: [col('a')], Table: { SourceRef: { Source: 'subquery' } } } } }]
    },
    howCreated: 'User'
  };
}

module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, mProj, cProj, cardVCO, measureField } = L;
  const out = [];
  const add = (key, p, visual, extra) => out.push(visualFile(page, key, p, visual, extra));
  const bars = ({ entity, column, label, measure, measureLabel, title, subtitle, gap = 20, units }) => ({
    visualType: 'clusteredBarChart',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj(entity, column), displayName: label, active: true }] },
        Y: { projections: [{ ...mProj(measure), displayName: measureLabel }] }
      },
      sortDefinition: { sort: [{ field: measureField(measure), direction: 'Descending' }] }
    },
    objects: {
      dataPoint: [props({ defaultColor: fillM('Color Series Primary') })],
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(8.5), labelPosition: Ls('OutsideEnd'), ...(units ? { labelDisplayUnits: Ld(units) } : {}) })],
      categoryAxis: [props({ labelColor: fillM('Color Text'), fontSize: Ld(8.5), showAxisTitle: Lb(false) })],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(gap) })]
    },
    visualContainerObjects: cardVCO({ title, subtitle })
  });

  add('kpis', pos(CX, 100, 1176, 112), htmlVisual('HTML Partners KPIs'));
  add('leaderboard', pos(CX, 224, 640, 480), htmlVisual('HTML Partner Leaderboard'));
  add('themes', pos(CX + 652, 224, 524, 236), bars({
    entity: 'Loans', column: 'loan_theme_type', label: 'Theme', measure: 'Total Loan Amount', measureLabel: 'Amount',
    title: 'Top 10 loan theme types', subtitle: 'Loan amount by theme type (loan_theme_ids)', gap: 12, units: 1000000
  }), { filterConfig: { filters: [topNFilter('Loans', 'loan_theme_type', 'Total Loan Amount', 10)] } });
  add('rural', pos(CX + 652, 472, 524, 232), bars({
    entity: 'Themes By Region', column: 'sector', label: 'Sector', measure: 'Rural Borrower %', measureLabel: 'Rural',
    title: 'How rural is each sector?', subtitle: 'Amount-weighted rural share (partner-reported; follows country and region filters)', gap: 12
  }));
  return out;
};
