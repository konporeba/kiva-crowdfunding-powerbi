// Geography & Poverty: KPI strip + MPI band bar (HTML) / bubble map (Azure Map) /
// MPI vs loan amount scatter (native) / country ranking matrix with data bars (native).
module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const { Ls, Ld, Lb, props, fillM, fillL, mProj, cProj, cardVCO, measureField } = L;
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  const axisText = { labelColor: fillM('Color Text Muted'), fontSize: Ld(9) };

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
    visualContainerObjects: cardVCO({ title: 'Loan amount by country', subtitle: 'Bubble size = amount requested. Hover for MPI and loan counts.', padding: 8 })
  });

  add('scatter', pos(CX + 572, 232, 604, 228), {
    visualType: 'scatterChart',
    query: { queryState: {
      Category: { projections: [{ ...cProj('Countries', 'Country'), active: true }] },
      X: { projections: [{ ...mProj('Average Regional MPI'), displayName: 'Average MPI' }] },
      Y: { projections: [{ ...mProj('Total Loan Amount'), displayName: 'Loan amount' }] },
      Size: { projections: [{ ...mProj('Total Loans'), displayName: 'Loans' }] }
    } },
    objects: {
      dataPoint: [props({ fill: fillM('Color Series Primary') })],
      categoryAxis: [props({ ...axisText, showAxisTitle: Lb(true), titleText: Ls('Average MPI (higher = poorer)'), titleColor: fillM('Color Text Muted'), titleFontSize: Ld(9), gridlineShow: Lb(false) })],
      valueAxis: [props({ ...axisText, showAxisTitle: Lb(false), gridlineShow: Lb(true), gridlineColor: fillM('Color Gridline'), gridlineStyle: Ls('dotted'), labelDisplayUnits: Ld(1000000) })],
      categoryLabels: [props({ show: Lb(false) })],
      legend: [props({ show: Lb(false) })]
    },
    visualContainerObjects: cardVCO({ title: 'Poverty vs lending, per country', subtitle: 'Only the 58 loan countries with an MPI score are plotted.' })
  });

  const values = [
    ['Total Loan Amount', 'Amount'], ['Total Loans', 'Loans'], ['Average Regional MPI', 'Avg MPI'],
    ['Female Borrower %', 'Women'], ['Median Days To Fund', 'Median days']
  ];
  add('matrix', pos(CX + 572, 472, 604, 232), {
    visualType: 'pivotTable',
    query: {
      queryState: {
        Rows: { projections: [{ ...cProj('Countries', 'Country'), active: true }] },
        Values: { projections: values.map(([m, n]) => ({ ...mProj(m), displayName: n })) }
      },
      sortDefinition: { sort: [{ field: measureField('Total Loan Amount'), direction: 'Descending' }] }
    },
    objects: {
      columnHeaders: [props({ fontColor: fillM('Color Text Muted'), backColor: fillM('Color Card'), fontSize: Ld(9), columnAdjustment: Ls('growToFit'), autoSizeColumnWidth: Lb(true) })],
      rowHeaders: [props({ fontColor: fillM('Color Text'), backColor: fillM('Color Card'), fontSize: Ld(9.5) })],
      values: [props({ fontColorPrimary: fillM('Color Text'), backColorPrimary: fillM('Color Card'), fontColorSecondary: fillM('Color Text'), backColorSecondary: fillM('Color Card'), fontSize: Ld(9.5) })],
      grid: [props({ gridHorizontal: Lb(true), gridHorizontalColor: fillM('Color Gridline'), gridVertical: Lb(false), outlineColor: fillM('Color Border'), rowPadding: Ld(3) })],
      subTotals: [props({ rowSubtotals: Lb(false), columnSubtotals: Lb(false) })],
      columnFormatting: [
        { properties: { dataBars: {
          positiveColor: fillL('#A8DADC'), negativeColor: fillL('#E63946'), axisColor: fillL('#A8DADC'),
          reverseDirection: Lb(false), hideText: Lb(false)
        }, labelDisplayUnits: Ld(1000000), labelPrecision: L.Li(1) }, selector: { metadata: '_Measures.Total Loan Amount' } },
        { properties: { dataBars: {
          positiveColor: fillL('#A8DADC'), negativeColor: fillL('#E63946'), axisColor: fillL('#A8DADC'),
          reverseDirection: Lb(false), hideText: Lb(false)
        } }, selector: { metadata: '_Measures.Average Regional MPI' } }
      ]
    },
    visualContainerObjects: { ...cardVCO({ title: 'Country ranking', subtitle: 'Sorted by amount. Bars: loan amount and average MPI.' }), stylePreset: [props({ name: Ls('None') })] }
  });
  return out;
};
