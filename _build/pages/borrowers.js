// Borrowers & Gender: gender impact panel / borrower make-up waffle + outcomes /
// women's share by sector (dot plot) / by world region (ring grid) / repayment interval donut. All HTML.
module.exports = ({ page, pos, visualFile, htmlVisual, CX }) => {
  const out = [];
  const add = (key, p, visual) => out.push(visualFile(page, key, p, visual));
  add('gender', pos(CX, 100, 576, 300), htmlVisual('HTML Gender Impact'));
  add('group-type', pos(CX + 588, 100, 588, 300), htmlVisual('HTML Borrower Makeup'));
  add('female-sector', pos(CX, 412, 576, 292), htmlVisual('HTML Women By Sector'));
  add('female-region', pos(CX + 588, 412, 288, 292), htmlVisual('HTML Women By Region'));
  add('repayment', pos(CX + 888, 412, 288, 292), htmlVisual('HTML Repayment Donut'));
  return out;
};
