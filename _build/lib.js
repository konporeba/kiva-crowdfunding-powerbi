// PBIR helpers shared by the report generator.
const crypto = require('crypto');

const SCHEMA = {
  page: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json',
  pages: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json',
  visual: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json',
  bookmark: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmark/2.1.0/schema.json',
  bookmarks: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmarksMetadata/1.0.0/schema.json'
};

const HTML_VISUAL = 'htmlContent443BE3AD55E043BF878BED274D3A6855';
const MEASURES = '_Measures';

// Deterministic 20-hex id so regenerating keeps visual/page/bookmark names stable.
const hid = (seed) => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 20);

// --- Literal / expression encoders (PBIR encoding) ---
const Ls = (s) => ({ expr: { Literal: { Value: `'${String(s).replace(/'/g, "''")}'` } } });
const Ld = (n) => ({ expr: { Literal: { Value: `${n}D` } } });
const Li = (n) => ({ expr: { Literal: { Value: `${n}L` } } });
const Lb = (b) => ({ expr: { Literal: { Value: b ? 'true' : 'false' } } });

const measureField = (name, entity = MEASURES) => ({ Measure: { Expression: { SourceRef: { Entity: entity } }, Property: name } });
const columnField = (entity, prop) => ({ Column: { Expression: { SourceRef: { Entity: entity } }, Property: prop } });

// Colour bound to a measure (fx field value) or a literal hex.
const fillM = (measure) => ({ solid: { color: { expr: measureField(measure) } } });
const fillL = (hex) => ({ solid: { color: Ls(hex) } });

const props = (obj) => ({ properties: obj });
const withSel = (obj, id) => ({ properties: obj, selector: { id } });

const projection = (field, queryRef, nativeQueryRef) => ({ field, queryRef, nativeQueryRef });
const mProj = (name, entity = MEASURES) => projection(measureField(name, entity), `${entity}.${name}`, name);
const cProj = (entity, col) => projection(columnField(entity, col), `${entity}.${col}`, col);

const imageRef = (fileName) => ({
  expr: { ResourcePackageItem: { PackageName: 'RegisteredResources', PackageType: 1, ItemName: fileName } }
});

// Container chrome for native "card" visuals: every colour follows the theme toggle.
const cardVCO = ({ title, subtitle, padding = 12, showTitle = true } = {}) => {
  const vco = {
    background: [props({ show: Lb(true), color: fillM('Color Card'), transparency: Ld(0) })],
    border: [props({ show: Lb(true), color: fillM('Color Border'), radius: Ld(12), width: Ld(1) })],
    dropShadow: [props({ show: Lb(false) })],
    padding: [props({ top: Ld(padding), bottom: Ld(padding), left: Ld(padding + 2), right: Ld(padding + 2) })],
    visualHeader: [props({ show: Lb(true), background: fillM('Color Card'), foreground: fillM('Color Text Muted'), border: fillM('Color Card') })],
    title: [props(showTitle && title
      ? { show: Lb(true), text: Ls(title), fontColor: fillM('Color Text'), fontSize: Ld(12), fontFamily: Ls('Segoe UI Semibold') }
      : { show: Lb(false) })]
  };
  vco.subTitle = [props(subtitle ? { show: Lb(true), text: Ls(subtitle), fontColor: fillM('Color Text Muted'), fontSize: Ld(9) } : { show: Lb(false) })];
  return vco;
};

// Bare chrome: no background, border, title or header (HTML visuals, shapes, buttons).
const bareVCO = (extra = {}) => ({
  background: [props({ show: Lb(false) })],
  border: [props({ show: Lb(false) })],
  dropShadow: [props({ show: Lb(false) })],
  title: [props({ show: Lb(false) })],
  visualHeader: [props({ show: Lb(false) })],
  padding: [props({ top: Ld(0), bottom: Ld(0), left: Ld(0), right: Ld(0) })],
  ...extra
});

module.exports = { SCHEMA, HTML_VISUAL, MEASURES, hid, Ls, Ld, Li, Lb, measureField, columnField, fillM, fillL, props, withSel, projection, mProj, cProj, imageRef, cardVCO, bareVCO };
