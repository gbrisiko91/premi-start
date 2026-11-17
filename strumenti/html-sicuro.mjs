// Sanificazione in fase di build dell'HTML generato da Marked.
// Non fidarsi di Markdown, HTML grezzo, URL o attributi provenienti dagli articoli.
import sanitizeHtml from "sanitize-html";

const TAGS = Array.from(new Set([
  ...sanitizeHtml.defaults.allowedTags,
  "img", "div", "span", "figure", "figcaption", "picture", "video", "audio", "source", "time", "section"
]));

const ATTR = {
  "*": ["class", "id", "title", "lang", "dir", "role", "aria-label", "aria-hidden"],
  a: ["href", "name", "target", "rel", "download", "hreflang"],
  img: ["src", "alt", "width", "height", "loading", "decoding", "referrerpolicy", "fetchpriority"],
  div: ["tabindex"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
  ol: ["start", "type"],
  time: ["datetime"],
  video: ["controls", "preload", "poster", "width", "height", "playsinline", "muted", "loop", "autoplay"],
  audio: ["controls", "preload"],
  source: ["src", "type", "media"],
};

/**
 * Trasforma HTML non attendibile in un sottoinsieme di markup presentazionale.
 * Non consente script, iframe, SVG, inline style, on* o protocolli attivi.
 * Il fallback onerror del generatore immagini non sopravvive intenzionalmente
 * alla sanificazione dei contenuti editoriali.
 */
export function sanificaHtml(html) {
  return sanitizeHtml(String(html ?? ""), {
    allowedTags: TAGS,
    allowedAttributes: ATTR,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
      video: ["http", "https"],
      audio: ["http", "https"],
      source: ["http", "https"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src", "poster"],
    allowProtocolRelative: false,
    nonTextTags: ["script", "style", "textarea", "option", "iframe", "svg", "math", "template"],
    transformTags: {
      // Avvio automatico ammesso (decisione di Gianmarco, 17/11/2026) solo per video muti:
      // senza muted l'attributo autoplay viene rimosso. Con autoplay si aggiunge playsinline.
      video: (tagName, attribs) => {
        const out = { ...attribs };
        if ("autoplay" in out && !("muted" in out)) delete out.autoplay;
        if ("autoplay" in out && !("playsinline" in out)) out.playsinline = "";
        return { tagName, attribs: out };
      },
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  });
}
