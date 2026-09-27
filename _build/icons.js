// Nav-rail icons: 24x24 line icons, stroked in honeydew (#F1FAEE) because the rail
// is navy in both light and dark mode. Drawn by hand for this report.
const wrap = (body, color = '#F1FAEE') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

module.exports = {
  menu: wrap('<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>'),
  close: wrap('<path d="M15 6l-6 6 6 6"/>'),
  home: wrap('<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>'),
  overview: wrap('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  geography: wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>'),
  sectors: wrap('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  borrowers: wrap('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5.5"/>'),
  funding: wrap('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/>'),
  partners: wrap('<path d="M4 21V4"/><path d="M4 4h13l-2.5 4L17 12H4"/>'),
  explore: wrap('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  about: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5v.01"/>'),
  // Brand mark: rounded square with a rising-bar glyph.
  logo: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="11" fill="#457B9D"/><rect x="10" y="22" width="4.5" height="8" rx="1.5" fill="#F1FAEE"/><rect x="17.75" y="16" width="4.5" height="14" rx="1.5" fill="#F1FAEE"/><rect x="25.5" y="10" width="4.5" height="20" rx="1.5" fill="#A8DADC"/></svg>`
};
