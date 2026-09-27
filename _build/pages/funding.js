// Funding Dynamics: KPI strip (HTML) / Days To Fund histogram (native column on a bin table) /
// funding speed by sector (native bar) / lender count vs loan amount per country (scatter).
module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, mProj, cProj, cardVCO, measureField, columnField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  const axis = { labelColor: fillM('Color Text Muted'), fontSize: Ld(9), showAxisTitle: Lb(false) };

  add('kpis', pos(CX, 100, 1176, 112), htmlVisual('HTML Funding KPIs'));

  add('histogram', pos(CX, 224, 700, 236), {
    visualType: 'clusteredColumnChart',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj('Fund Time Bins', 'Bin'), displayName: 'Days to fund', active: true }] },
        Y: { projections: [{ ...mProj('Loans In Fund Time Bin'), displayName: 'Loans' }] }
      },
      sortDefinition: { sort: [{ field: columnField('Fund Time Bins', 'Bin'), direction: 'Ascending' }] }
    },
    objects: {
      dataPoint: [props({ defaultColor: fillM('Color Series Primary') })],
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(8.5), labelDisplayUnits: Ld(1000) })],
      categoryAxis: [props(axis)],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(12) })]
    },
    visualContainerObjects: cardVCO({ title: 'How long until a loan is fully funded?', subtitle: 'Fully funded loans by days from posting to full funding' })
  });

  add('speed-sector', pos(CX + 712, 224, 464, 480), {
    visualType: 'clusteredBarChart',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj('Loans', 'sector'), displayName: 'Sector', active: true }] },
        Y: { projections: [{ ...mProj('Median Days To Fund'), displayName: 'Median days' }] }
      },
      sortDefinition: { sort: [{ field: measureField('Median Days To Fund'), direction: 'Ascending' }] }
    },
    objects: {
      dataPoint: [props({ defaultColor: fillM('Color Series Primary') })],
      labels: [props({ show: Lb(true), color: fillM('Color Text'), fontSize: Ld(9), labelPosition: Ls('OutsideEnd') })],
      categoryAxis: [props({ ...axis, labelColor: fillM('Color Text') })],
      valueAxis: [props({ show: Lb(false), gridlineShow: Lb(false) })],
      layout: [props({ clusteredGapSize: Ld(22) })]
    },
    visualContainerObjects: cardVCO({ title: 'Funding speed by sector', subtitle: 'Median days from posting to full funding (fastest first)' })
  });

  add('lenders-scatter', pos(CX, 472, 700, 232), {
    visualType: 'scatterChart',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Loans', 'sector'), displayName: 'Sector', active: true }] },
      X: { projections: [{ ...mProj('Average Loan Amount'), displayName: 'Average loan' }] },
      Y: { projections: [{ ...mProj('Average Lenders per Loan'), displayName: 'Lenders per loan' }] },
      Size: { projections: [{ ...mProj('Total Loans'), displayName: 'Loans' }] }
    } },
    objects: {
      dataPoint: [props({ fill: fillM('Color Series Primary') })],
      categoryAxis: [props({ ...axis, showAxisTitle: Lb(true), titleText: Ls('Average loan amount (USD)'), titleColor: fillM('Color Text Muted'), titleFontSize: Ld(9), gridlineShow: Lb(false) })],
      valueAxis: [props({ ...axis, showAxisTitle: Lb(true), titleText: Ls('Lenders per loan'), titleColor: fillM('Color Text Muted'), titleFontSize: Ld(9), gridlineShow: Lb(true), gridlineColor: fillM('Color Gridline'), gridlineStyle: Ls('dotted') })],
      categoryLabels: [props({ show: Lb(true), color: fillM('Color Text Muted'), fontSize: Ld(8) })],
      legend: [props({ show: Lb(false) })]
    },
    visualContainerObjects: cardVCO({ title: 'Bigger loans need more lenders', subtitle: 'Per sector; bubble size = number of loans' })
  });
  return out;
};
