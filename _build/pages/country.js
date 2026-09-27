// Country Profile (drill-through on Countries[Country]): profile card / monthly trend / sectors /
// borrower make-up donut. All HTML.
module.exports = ({ page, pos, visualFile, htmlVisual, CX }) => {
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  add('profile', pos(CX, 100, 380, 604), htmlVisual('HTML Country Profile'));
  add('trend', pos(CX + 392, 100, 784, 292), htmlVisual('HTML Country Trend'));
  add('sectors', pos(CX + 392, 404, 388, 300), htmlVisual('HTML Country Sectors'));
  add('makeup', pos(CX + 792, 404, 384, 300), htmlVisual('HTML Country Makeup'));
  return out;
};
