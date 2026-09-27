// Explore: decomposition tree (break down loan amount by any dimension) + key influencers
// (what makes a loan more likely to be fully funded).
module.exports = ({ page, L, pos, visualFile, CX }) => {
  const { props, fillM, mProj, cProj, cardVCO } = L;
  const explainBy = [
    ['Countries', 'World Region', 'World region'], ['Countries', 'Country', 'Country'], ['Loans', 'sector', 'Sector'],
    ['Loans', 'activity', 'Activity'], ['Loans', 'borrower_group_type', 'Borrower make-up'],
    ['Loans', 'repayment_interval', 'Repayment'], ['Loans', 'loan_theme_type', 'Loan theme'], ['Field Partners', 'Field Partner Name', 'Field partner']
  ];
  const out = [];
  out.push(visualFile(page, 'decomp', pos(CX, 100, 1176, 300), {
    visualType: 'decompositionTreeVisual',
    query: { queryState: {
      Analyze: { projections: [{ ...mProj('Total Loan Amount'), displayName: 'Loan amount' }] },
      ExplainBy: { projections: explainBy.map(([e, c, n]) => ({ ...cProj(e, c), displayName: n })) }
    } },
    objects: {
      dataBars: [props({ positiveBarColor: fillM('Color Series Primary'), dataBarBackgroundColor: fillM('Color Gridline') })],
      categoryLabels: [props({ categoryLabelFontColor: fillM('Color Text') })],
      dataLabels: [props({ dataLabelFontColor: fillM('Color Text Muted') })],
      levelHeader: [props({ levelTitleFontColor: fillM('Color Text'), levelSubtitleFontColor: fillM('Color Text Muted') })],
      tree: [props({ accentColor: fillM('Color Series Primary'), connectorDefaultColor: fillM('Color Border') })]
    },
    visualContainerObjects: cardVCO({ title: 'Break down lending your way', subtitle: 'Click + on a bar and pick a dimension, or let the tree choose the high or low value split' })
  }));
  out.push(visualFile(page, 'influencers', pos(CX, 412, 1176, 292), {
    visualType: 'keyDriversVisual',
    query: { queryState: {
      Target: { projections: [{ ...cProj('Loans', 'is_fully_funded'), displayName: 'Fully funded' }] },
      ExplainBy: { projections: [
        { ...cProj('Loans', 'sector'), displayName: 'Sector' }, { ...cProj('Loans', 'borrower_group_type'), displayName: 'Borrower make-up' },
        { ...cProj('Loans', 'repayment_interval'), displayName: 'Repayment' }, { ...cProj('Countries', 'World Region'), displayName: 'World region' },
        { ...cProj('Loans', 'term_in_months'), displayName: 'Term (months)' }, { ...cProj('Loans', 'is_pre_disbursed'), displayName: 'Pre-disbursed' }
      ] }
    } },
    visualContainerObjects: cardVCO({ title: 'What drives a loan to be fully funded?', subtitle: 'Key influencers on whether a loan was fully funded. Switch the target value inside the visual to explore unfunded loans' })
  }));
  return out;
};
