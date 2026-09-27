// Explore: funding drivers panel (HTML: riskiest vs safest group per factor, replaces key influencers)
// + unfunded-rate heatmap region x sector (HTML, replaces the decomposition tree).
module.exports = ({ page, pos, visualFile, htmlVisual, CX }) => {
  const out = [];
  out.push(visualFile(page, 'decomp', pos(CX, 100, 1176, 300), htmlVisual('HTML Funding Drivers')));
  out.push(visualFile(page, 'influencers', pos(CX, 412, 1176, 292), htmlVisual('HTML Funding Heatmap')));
  return out;
};
