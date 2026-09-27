// Partners & Themes: KPI strip (HTML) / partner leaderboard (HTML) /
// loan theme mix (HTML: composition strip + next 5 themes) / rural reach by sector (HTML bar list).
module.exports = ({ page, L, pos, visualFile, htmlVisual, CX }) => {
  const out = [];
  const add = (key, p, visual, extra) => out.push(visualFile(page, key, p, visual, extra));

  add('kpis', pos(CX, 100, 1176, 112), htmlVisual('HTML Partners KPIs'));
  add('leaderboard', pos(CX, 224, 640, 480), htmlVisual('HTML Partner Leaderboard'));
  // Theme mix (HTML): the leading theme (General, 46%) flattened every other bar in a top-10 chart.
  add('themes', pos(CX + 652, 224, 524, 236), htmlVisual('HTML Theme Mix'));
  // Rural reach (HTML): a native bar chart could not fit all 11 categories without scrolling.
  add('rural', pos(CX + 652, 472, 524, 232), htmlVisual('HTML Rural By Sector'));
  return out;
};
