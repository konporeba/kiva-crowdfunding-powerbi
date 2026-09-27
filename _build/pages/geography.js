// Geography & Poverty: KPI strip + MPI band bar (HTML) / bubble map (Azure Map) /
// MPI vs loan amount scatter (HTML SVG) / scrollable country ranking (HTML).
module.exports = ({ page, PAGES, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, fillL, mProj, cProj, cardVCO, measureField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));

  add('kpis', pos(CX, 100, 1176, 120), htmlVisual('HTML Geography KPIs'));

  add('map', pos(CX, 232, 560, 472), {
    visualType: 'azureMap',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Countries', 'Country'), active: true }] },
      Size: { projections: [{ ...mProj('Total Loan Amount'), active: true }] },
      Tooltips: { projections: [mProj('Total Loans'), mProj('Average Regional MPI'), mProj('Female Borrower %')] }
    } },
    objects: {
      mapControls: [props({ defaultStyle: Ls('grayscale_light'), showStylePicker: Lb(false), autoZoom: Lb(true), showLabels: Lb(false) })],
      bubbleLayer: [props({ bubbleRadius: L.Li(6), maxRadius: L.Li(34), fillColor: fillM('Color Series Primary'), strokeColor: fillM('Color Card'), bubbleStrokeWidth: L.Li(1) })],
      dataPoint: [props({ fill: fillM('Color Series Primary') })],
      legend: [props({ show: Lb(false) })]
    },
    visualContainerObjects: { ...cardVCO({ title: 'Loan amount by country', subtitle: 'Bubble size = amount requested. Hover for MPI and loan counts.', padding: 8 }), visualTooltip: [props({ show: Lb(true), type: Ls('Canvas'), section: Ls(PAGES.find((p) => p.key === 'tooltip').id) })] }
  });

  add('scatter', pos(CX + 572, 232, 604, 228), htmlVisual('HTML MPI Scatter'));

  add('matrix', pos(CX + 572, 472, 604, 232), htmlVisual('HTML Country Ranking'));
  return out;
};
