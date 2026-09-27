// Country Profile (drill-through on Countries[Country]): HTML profile card / monthly trend /
// sectors / borrower make-up donut.
module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, mProj, cProj, cardVCO, measureField, columnField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  const axis = { labelColor: fillM('Color Text Muted'), fontSize: Ld(9), showAxisTitle: Lb(false) };

  add('profile', pos(CX, 100, 380, 604), htmlVisual('HTML Country Profile'));
  add('trend', pos(CX + 392, 100, 784, 292), {
    visualType: 'areaChart',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj('Date', 'Month Start'), active: true }] },
        Y: { projections: [{ ...mProj('Total Loan Amount'), displayName: 'Requested' }] }
      },
      sortDefinition: { sort: [{ field: columnField('Date', 'Month Start'), direction: 'Ascending' }] }
    },
    objects: {
      dataPoint: [{ properties: { fill: fillM('Color Series Primary') }, selector: { metadata: '_Measures.Total Loan Amount' } }],
      lineStyles: [props({ strokeWidth: Ld(2), lineChartType: Ls('smooth'), showMarker: Lb(false) })],
      legend: [props({ show: Lb(false) })],
      categoryAxis: [props({ ...axis, gridlineShow: Lb(false) })],
      valueAxis: [props({ ...axis, gridlineShow: Lb(true), gridlineColor: fillM('Color Gridline'), gridlineStyle: Ls('dotted') })]
    },
    visualContainerObjects: cardVCO({ title: 'Monthly lending', subtitle: 'Amount requested by posting month' })
  });
  add('sectors', pos(CX + 392, 404, 388, 300), {
    visualType: 'clusteredBarChart',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj('Loans', 'sector'), displayName: 'Sector', active: true }] },
        Y: { projections: [{ ...mProj('Total Loan Amount'), displayName: 'Amount' }] }
      },
      sortDefinition: { sort: [{ field: measureField('Total Loan Amount'), direction: 'Descending' }] }
    },
    objects: {
      dataPoint: [props({ defaultColor: fillM('Color Series Primary') })],
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(8.5), labelPosition: Ls('OutsideEnd'), labelDisplayUnits: Ld(1000000) })],
      categoryAxis: [props({ ...axis, labelColor: fillM('Color Text'), fontSize: Ld(8.5) })],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(14) })]
    },
    visualContainerObjects: cardVCO({ title: 'Sectors', subtitle: 'Loan amount by sector' })
  });
  add('makeup', pos(CX + 792, 404, 384, 300), {
    visualType: 'donutChart',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Loans', 'borrower_group_type'), displayName: 'Borrower make-up', active: true }] },
      Y: { projections: [{ ...mProj('Total Loans'), displayName: 'Loans' }] }
    } },
    objects: {
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(8.5), labelStyle: Ls('Category, percent of total') })],
      legend: [props({ show: Lb(false) })],
      slices: [props({ innerRadiusRatio: Ld(62) })],
      centerValue: [props({ show: Lb(false) })]
    },
    visualContainerObjects: cardVCO({ title: 'Borrower make-up', subtitle: 'Share of loans' })
  });
  return out;
};
