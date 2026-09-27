// Overview: KPI strip (HTML) / monthly trend (HTML SVG) + funding rings (HTML) /
// world map (native Azure Map) + top sectors (HTML) + insight (HTML).
// Content area: x 88..1264, y 100..704.
module.exports = ({ page, PAGES, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, Li, props, fillM, mProj, cProj, cardVCO } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));

  // Row 1: KPI strip
  add('kpis', pos(CX, 100, 1176, 128), htmlVisual('HTML Overview KPIs'));

  // Row 2: monthly trend + funding rings (HTML)
  add('trend', pos(CX, 240, 760, 236), htmlVisual('HTML Monthly Trend'));
  add('rings', pos(CX + 772, 240, 404, 240), htmlVisual('HTML Funding Rings'));

  // Row 3: map + top sectors + insight
  add('map', pos(CX, 492, 470, 208), {
    visualType: 'azureMap',
    query: {
      queryState: {
        Category: { projections: [{ ...cProj('Countries', 'Country'), active: true }] },
        Size: { projections: [{ ...mProj('Total Loan Amount'), active: true }] }
      }
    },
    objects: {
      mapControls: [props({ defaultStyle: Ls('grayscale_light'), showStylePicker: Lb(false), showNavigationControls: Lb(false), autoZoom: Lb(true), showLabels: Lb(false) })],
      bubbleLayer: [props({ bubbleRadius: Li(6), maxRadius: Li(28), fillColor: fillM('Color Series Primary'), mapTransparency: Ld(20), strokeColor: fillM('Color Card'), bubbleStrokeWidth: Li(1) })],
      dataPoint: [props({ fill: fillM('Color Series Primary') })],
      legend: [props({ show: Lb(false) })]
    },
    visualContainerObjects: { ...cardVCO({ title: 'Where the money goes', padding: 8 }), visualTooltip: [props({ show: Lb(true), type: Ls('Canvas'), section: Ls(PAGES.find((p) => p.key === 'tooltip').id) })] }
  });
  add('sectors', pos(CX + 482, 492, 390, 212), htmlVisual('HTML Top Sectors'));
  add('insight', pos(CX + 884, 492, 292, 212), htmlVisual('HTML Overview Insight'));
  return out;
};
