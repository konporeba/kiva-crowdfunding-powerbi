// Home: one full-bleed HTML hero plus transparent buttons over its six section cards
// (the HTML Content visual cannot navigate). Card grid must match [HTML Home]:
// cards at y=452 and 578 (relative), x=0/397/794, 381x110.
module.exports = ({ page, PAGES, L, pos, visualFile, htmlVisual, button, CX }) => {
  const Y0 = 16;
  const out = [visualFile(page, 'hero', pos(CX, Y0, 1176, 688), htmlVisual('HTML Home'))];
  // Right-hand hero panel: the life of a typical loan (separate measure, drawn over the empty area).
  out.push(visualFile(page, 'loan-journey', pos(CX + 760, Y0 + 18, 416, 412), htmlVisual('HTML Loan Journey')));
  const targets = ['overview', 'geography', 'sectors', 'borrowers', 'funding', 'partners'];
  targets.forEach((key, i) => {
    const target = PAGES.find((p) => p.key === key);
    const x = CX + (i % 3) * 397, y = Y0 + (i < 3 ? 452 : 578);
    out.push(visualFile(page, 'card-link-' + key, pos(x, y, 381, 110),
      button({ action: { type: 'PageNavigation', page: target.id }, fillHover: L.fillL('#03624C'), tooltip: 'Open ' + target.name })));
  });
  // Hover fill on the overlay buttons should be a faint wash, not a solid block.
  for (const v of out.slice(2)) {
    const hover = v.json.visual.objects.fill.find((f) => f.selector && f.selector.id === 'hover');
    hover.properties.transparency = L.Ld(90);
  }
  return out;
};
