// Funding Dynamics: KPI strip / days-to-fund histogram / funding speed by sector /
// lenders per loan vs average loan per sector (scatter with trend). All HTML.
module.exports = ({ page, pos, visualFile, htmlVisual, CX }) => {
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  add('kpis', pos(CX, 100, 1176, 112), htmlVisual('HTML Funding KPIs'));
  add('histogram', pos(CX, 224, 700, 236), htmlVisual('HTML Fund Time Histogram'));
  add('speed-sector', pos(CX + 712, 224, 464, 480), htmlVisual('HTML Speed By Sector'));
  add('lenders-scatter', pos(CX, 472, 700, 232), htmlVisual('HTML Lenders Scatter'));
  return out;
};
