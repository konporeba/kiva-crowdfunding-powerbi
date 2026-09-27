// Borrowers & Gender: gender impact panel (HTML) / borrower group type bars /
// women's share by sector / women's share by world region / repayment interval donut.
module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, mProj, cProj, cardVCO, measureField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));

  // Horizontal bar chart helper: one measure by one category, sorted by the measure.
  const bars = ({ entity, column, label, measure, measureLabel, title, subtitle, gap = 30, units, font = 9 }) => ({
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
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(font), labelPosition: Ls('OutsideEnd'), ...(units ? { labelDisplayUnits: Ld(units) } : {}) })],
      categoryAxis: [props({ labelColor: fillM('Color Text'), fontSize: Ld(font), showAxisTitle: Lb(false) })],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(gap) })]
    },
    visualContainerObjects: cardVCO({ title, subtitle })
  });

  add('gender', pos(CX, 100, 576, 300), htmlVisual('HTML Gender Impact'));
  add('group-type', pos(CX + 588, 100, 588, 300), bars({
    entity: 'Loans', column: 'borrower_group_type', label: 'Borrower make-up', measure: 'Total Loans', measureLabel: 'Loans',
    title: 'Borrower make-up', subtitle: 'Loans by borrower group type (from borrower_genders)', units: 1000
  }));
  add('female-sector', pos(CX, 412, 576, 292), bars({
    entity: 'Loans', column: 'sector', label: 'Sector', measure: 'Female Borrower %', measureLabel: 'Women',
    title: "Women's share of borrowers, by sector", subtitle: 'Share of borrowers with known gender', gap: 8, font: 8.5
  }));
  add('female-region', pos(CX + 588, 412, 288, 292), bars({
    entity: 'Countries', column: 'World Region', label: 'World region', measure: 'Female Borrower %', measureLabel: 'Women',
    title: 'By world region', subtitle: "Women's share of borrowers"
  }));
  add('repayment', pos(CX + 888, 412, 288, 292), {
    visualType: 'donutChart',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Loans', 'repayment_interval'), displayName: 'Repayment', active: true }] },
      Y: { projections: [{ ...mProj('Total Loans'), displayName: 'Loans' }] }
    } },
    objects: {
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(9), labelStyle: Ls('Category, percent of total') })],
      legend: [props({ show: Lb(false) })],
      slices: [props({ innerRadiusRatio: Ld(62) })],
      centerValue: [props({ show: Lb(false) })]
    },
    visualContainerObjects: cardVCO({ title: 'Repayment interval', subtitle: 'Share of loans' })
  });
  return out;
};
