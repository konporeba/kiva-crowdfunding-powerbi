// Country Tooltip (320x200 report-page tooltip): one HTML card.
module.exports = ({ page, pos, visualFile, htmlVisual }) => [
  visualFile(page, 'card', pos(0, 0, 320, 200, 100), htmlVisual('HTML Country Tooltip'))
];
