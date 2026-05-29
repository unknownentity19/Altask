/* =========================================================
   Altask v4 — Visual editor engine
   - Sectioned palette (Layouts / Elements) with search + thumbnails
   - Drag from palette, drag to reorder, drop indicators
   - Inline contentEditable text edits
   - Structured inspector (Spacing visualizer, Size, Position,
     Typography, Colors) with live styling + persistence
   - Undo/redo, device preview, zoom controls
   - Live preview iframe + clean HTML export
   ========================================================= */

(function () {
  "use strict";

  // ----- DOM helpers --------------------------------------------------------
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function escHtml(s) {
    return String(s == null ? "" : s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function escAttr(s) { return escHtml(s).replaceAll('"', "&quot;"); }
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  // ----- Component schema ---------------------------------------------------
  const TF = (key, label, type = "text", placeholder = "") => ({ key, label, type, placeholder });

  // Components are grouped under sections shown in the palette.
  // group: 'layouts' or 'elements'
  // category: section title within the tab
  const COMPONENTS = [
    {
      id: "navbar", label: "Navigation Bar", short: "Navigation Bar",
      group: "layouts", category: "Navigation",
      thumb: thumbNavbar(),
      defaults: {
        brand: "Talky",
        links: "Download, Features, Security, Support",
        cta: "Join Talky",
        ctaHref: "#",
      },
      fields: [
        TF("brand", "Brand"),
        TF("links", "Links (comma separated)"),
        TF("cta", "CTA label"),
        TF("ctaHref", "CTA link", "url"),
      ],
      render(p) {
        const links = (p.links || "").split(",").map(s => s.trim()).filter(Boolean);
        return el(`<nav class="blk blk--navbar">
          <strong class="blk--navbar__brand" data-edit="brand">${escHtml(p.brand)}</strong>
          <div class="blk--navbar__links">${links.map(l => `<a href="#">${escHtml(l)}</a>`).join("")}</div>
          <a class="blk--navbar__cta" href="${escAttr(p.ctaHref)}" data-edit="cta">${escHtml(p.cta)}</a>
        </nav>`);
      },
    },
    {
      id: "footer", label: "Footer", short: "Footer",
      group: "layouts", category: "Navigation",
      thumb: thumbFooter(),
      defaults: { brand: "Altask", note: "© 2026 Altask, Inc." },
      fields: [TF("brand", "Brand"), TF("note", "Copyright")],
      render(p) {
        return el(`<section class="blk blk--footer">
          <strong data-edit="brand">${escHtml(p.brand)}</strong> · <span data-edit="note">${escHtml(p.note)}</span>
        </section>`);
      },
    },

    {
      id: "hero", label: "Hero", short: "Hero",
      group: "layouts", category: "Content",
      thumb: thumbHero(),
      defaults: {
        title: "Stay connected with your friends and family",
        subtitle: "A short supporting line that tells visitors what you build, faster than they can scroll past it.",
        primaryLabel: "Get Started",
        primaryHref: "#",
        secondaryLabel: "Learn more",
        secondaryHref: "#",
        accent: "#3a64ff",
      },
      fields: [
        TF("title", "Title"),
        TF("subtitle", "Subtitle", "textarea"),
        TF("primaryLabel", "Primary button"),
        TF("primaryHref", "Primary link"),
        TF("secondaryLabel", "Secondary button"),
        TF("secondaryHref", "Secondary link"),
        TF("accent", "Accent color", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--hero blk--hero-split" style="--cta-color:${escAttr(p.accent)}">
          <div class="hero-grid">
            <div class="hero-copy">
              <span class="hero-eyebrow">Heading</span>
              <h1 data-edit="title">${escHtml(p.title)}</h1>
              <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
              <div class="ctas">
                <a class="b1" href="${escAttr(p.primaryHref)}" data-edit="primaryLabel">${escHtml(p.primaryLabel)}</a>
                <a class="b2" href="${escAttr(p.secondaryHref)}" data-edit="secondaryLabel">${escHtml(p.secondaryLabel)}</a>
              </div>
              <div class="hero-rating">
                <span class="hero-rating__avatars">
                  <span></span><span></span><span></span><span></span>
                </span>
                <span class="hero-rating__star">★ 4.8 ratings</span>
                <span class="hero-rating__sub">Trusted by 20+ million people</span>
              </div>
            </div>
            <div class="hero-visual">
              <div class="hero-mock">
                <div class="hero-mock__bar">
                  <span></span><span></span><span></span>
                </div>
                <div class="hero-mock__body">
                  <div class="hero-mock__sidebar">
                    <div class="hero-mock__title">Messages</div>
                    <div class="hero-mock__chat is-active"></div>
                    <div class="hero-mock__chat"></div>
                    <div class="hero-mock__chat"></div>
                    <div class="hero-mock__chat"></div>
                    <div class="hero-mock__chat"></div>
                  </div>
                  <div class="hero-mock__main">
                    <div class="hero-mock__head"></div>
                    <div class="hero-mock__bg"></div>
                    <div class="hero-mock__bubble hero-mock__bubble--in"></div>
                    <div class="hero-mock__bubble hero-mock__bubble--out"></div>
                    <div class="hero-mock__bubble hero-mock__bubble--in hero-mock__bubble--sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>`);
      },
    },
    {
      id: "heroOverlay", label: "Hero Overlay", short: "Hero Overlay",
      group: "layouts", category: "Content",
      thumb: thumbHeroOverlay(),
      defaults: {
        title: "Make your work move",
        subtitle: "Layered hero with a soft accent overlay.",
        primaryLabel: "Get the app", primaryHref: "#",
        secondaryLabel: "How it works", secondaryHref: "#",
        accent: "#3a64ff",
      },
      fields: [
        TF("title", "Title"),
        TF("subtitle", "Subtitle", "textarea"),
        TF("primaryLabel", "Primary button"), TF("primaryHref", "Primary link"),
        TF("secondaryLabel", "Secondary button"), TF("secondaryHref", "Secondary link"),
        TF("accent", "Accent", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--hero" style="--cta-color:${escAttr(p.accent)};background:linear-gradient(135deg,#eef2ff,#fff)">
          <h1 data-edit="title">${escHtml(p.title)}</h1>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
          <div class="ctas">
            <a class="b1" href="${escAttr(p.primaryHref)}" data-edit="primaryLabel">${escHtml(p.primaryLabel)}</a>
            <a class="b2" href="${escAttr(p.secondaryHref)}" data-edit="secondaryLabel">${escHtml(p.secondaryLabel)}</a>
          </div>
        </section>`);
      },
    },
    {
      id: "features", label: "Cards Section", short: "Cards Section",
      group: "layouts", category: "Content",
      thumb: thumbCards(),
      defaults: {
        title: "Why teams pick Altask",
        f1Title: "Drag & drop", f1Body: "Compose pages by dragging blocks onto a flexible canvas.",
        f2Title: "Real-time preview", f2Body: "See pixel-perfect changes the moment you make them.",
        f3Title: "One-click publish", f3Body: "Push to a global edge with HTTPS in a single click.",
      },
      fields: [
        TF("title", "Section title"),
        TF("f1Title", "Card 1 title"), TF("f1Body", "Card 1 body", "textarea"),
        TF("f2Title", "Card 2 title"), TF("f2Body", "Card 2 body", "textarea"),
        TF("f3Title", "Card 3 title"), TF("f3Body", "Card 3 body", "textarea"),
      ],
      render(p) {
        return el(`<section class="blk blk--features">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <div class="grid">
            <div class="feat"><div class="ic"></div><h3 data-edit="f1Title">${escHtml(p.f1Title)}</h3><p data-edit="f1Body">${escHtml(p.f1Body)}</p></div>
            <div class="feat"><div class="ic"></div><h3 data-edit="f2Title">${escHtml(p.f2Title)}</h3><p data-edit="f2Body">${escHtml(p.f2Body)}</p></div>
            <div class="feat"><div class="ic"></div><h3 data-edit="f3Title">${escHtml(p.f3Title)}</h3><p data-edit="f3Body">${escHtml(p.f3Body)}</p></div>
          </div>
        </section>`);
      },
    },
    {
      id: "columns", label: "Feature Section", short: "Feature Section",
      group: "layouts", category: "Content",
      thumb: thumbFeatureSection(),
      defaults: {
        title: "Built for the way you work",
        body: "Pair short copy with a striking visual. Two-column blocks are perfect for product highlights, testimonials, or feature walkthroughs.",
      },
      fields: [TF("title", "Title"), TF("body", "Body", "textarea")],
      render(p) {
        return el(`<section class="blk blk--columns">
          <div class="grid">
            <div>
              <h3 data-edit="title">${escHtml(p.title)}</h3>
              <p data-edit="body">${escHtml(p.body)}</p>
            </div>
            <div class="visual"></div>
          </div>
        </section>`);
      },
    },
    {
      id: "gallery", label: "Gallery", short: "Gallery",
      group: "layouts", category: "Content",
      thumb: thumbGallery(),
      defaults: { columns: "3", items: "6", caption: "Our recent work" },
      fields: [
        TF("caption", "Caption"),
        { key: "columns", label: "Columns", type: "number", placeholder: "3" },
        { key: "items", label: "Items", type: "number", placeholder: "6" },
      ],
      render(p) {
        const cols  = clamp(parseInt(p.columns) || 3, 1, 6);
        const count = clamp(parseInt(p.items) || 6, 1, 12);
        let cells = "";
        for (let i = 0; i < count; i++) cells += `<div class="blk--gallery__cell"></div>`;
        return el(`<section class="blk blk--gallery">
          <p class="blk--gallery__cap" data-edit="caption">${escHtml(p.caption)}</p>
          <div class="blk--gallery__grid" style="grid-template-columns:repeat(${cols},1fr)">${cells}</div>
        </section>`);
      },
    },
    {
      id: "form", label: "Subscribe Form", short: "Subscribe Form",
      group: "layouts", category: "Content",
      thumb: thumbForm(),
      defaults: {
        title: "Stay in the loop",
        subtitle: "Get product updates and design tips, monthly.",
        buttonLabel: "Subscribe",
        fields: "Name, Email",
      },
      fields: [
        TF("title", "Title"),
        TF("subtitle", "Subtitle"),
        TF("fields", "Fields (comma separated)"),
        TF("buttonLabel", "Button label"),
      ],
      render(p) {
        const fields = (p.fields || "").split(",").map(f => f.trim()).filter(Boolean);
        const fieldHtml = fields.map(f => {
          if (f.toLowerCase() === "message") return `<div class="blk--form__field"><label>${escHtml(f)}</label><textarea placeholder="Your ${f.toLowerCase()}"></textarea></div>`;
          const type = f.toLowerCase().includes("email") ? "email" : "text";
          return `<div class="blk--form__field"><label>${escHtml(f)}</label><input type="${type}" placeholder="Your ${f.toLowerCase()}" /></div>`;
        }).join("");
        return el(`<section class="blk blk--form">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
          <form onsubmit="event.preventDefault()">
            ${fieldHtml}
            <button type="submit" data-edit="buttonLabel">${escHtml(p.buttonLabel)}</button>
          </form>
        </section>`);
      },
    },
    {
      id: "contactForm", label: "Contact Form", short: "Contact Form",
      group: "layouts", category: "Content",
      thumb: thumbForm(),
      defaults: {
        title: "Get in touch",
        subtitle: "Fill out the form and we'll get back to you shortly.",
        buttonLabel: "Send message",
        fields: "Name, Email, Message",
      },
      fields: [
        TF("title", "Title"),
        TF("subtitle", "Subtitle"),
        TF("fields", "Fields (comma separated)"),
        TF("buttonLabel", "Button label"),
      ],
      render(p) {
        const fields = (p.fields || "").split(",").map(f => f.trim()).filter(Boolean);
        const fieldHtml = fields.map(f => {
          if (f.toLowerCase() === "message") return `<div class="blk--form__field"><label>${escHtml(f)}</label><textarea placeholder="Your ${f.toLowerCase()}"></textarea></div>`;
          const type = f.toLowerCase().includes("email") ? "email" : "text";
          return `<div class="blk--form__field"><label>${escHtml(f)}</label><input type="${type}" placeholder="Your ${f.toLowerCase()}" /></div>`;
        }).join("");
        return el(`<section class="blk blk--form">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
          <form onsubmit="event.preventDefault()">
            ${fieldHtml}
            <button type="submit" data-edit="buttonLabel">${escHtml(p.buttonLabel)}</button>
          </form>
        </section>`);
      },
    },
    {
      id: "cta", label: "CTA Banner", short: "CTA Banner",
      group: "layouts", category: "Content",
      thumb: thumbCTA(),
      defaults: {
        title: "Ship your next site this week",
        subtitle: "Start free. No credit card required.",
        label: "Open the editor",
        href: "#",
      },
      fields: [
        TF("title", "Title"),
        TF("subtitle", "Subtitle", "textarea"),
        TF("label", "Button label"),
        TF("href", "Button link", "url"),
      ],
      render(p) {
        return el(`<section class="blk blk--cta">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
          <a href="${escAttr(p.href)}" data-edit="label">${escHtml(p.label)}</a>
        </section>`);
      },
    },
    {
      id: "quote", label: "Testimonial", short: "Testimonial",
      group: "layouts", category: "Content",
      thumb: thumbQuote(),
      defaults: {
        body: "Altask replaced three tools and shipped our launch site in a single afternoon.",
        author: "Maya Chen, Founder at Northwind",
      },
      fields: [TF("body", "Quote", "textarea"), TF("author", "Attribution")],
      render(p) {
        return el(`<section class="blk blk--quote">
          <blockquote data-edit="body">"${escHtml(p.body)}"</blockquote>
          <cite data-edit="author">— ${escHtml(p.author)}</cite>
        </section>`);
      },
    },

    // ELEMENTS
    {
      id: "heading", label: "Heading", short: "Heading",
      group: "elements", category: "Text",
      thumb: thumbHeading(),
      defaults: {
        title: "A section heading",
        subtitle: "A short supporting line that explains what this section is about.",
      },
      fields: [TF("title", "Title"), TF("subtitle", "Subtitle", "textarea")],
      render(p) {
        return el(`<section class="blk blk--heading">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
        </section>`);
      },
    },
    {
      id: "text", label: "Paragraph", short: "Paragraph",
      group: "elements", category: "Text",
      thumb: thumbText(),
      defaults: {
        body: "Use this block for long-form content. Click the text to edit it inline. The Altask editor preserves your spacing and typography in the exported HTML.",
      },
      fields: [TF("body", "Body", "textarea")],
      render(p) {
        return el(`<section class="blk blk--text">
          <p data-edit="body">${escHtml(p.body)}</p>
        </section>`);
      },
    },
    {
      id: "image", label: "Image", short: "Image",
      group: "elements", category: "Media",
      thumb: thumbImage(),
      defaults: { url: "" },
      fields: [TF("url", "Image URL", "url", "https://...")],
      render(p) {
        const bg = p.url ? `url('${escAttr(p.url)}')` : "none";
        return el(`<section class="blk blk--image">
          <div class="img" style="--img-src:${bg}"></div>
        </section>`);
      },
    },
    {
      id: "button", label: "Button", short: "Button",
      group: "elements", category: "Interactive",
      thumb: thumbButton(),
      defaults: {
        label: "Get started",
        href: "#",
        variant: "primary",
        size: "md",
        align: "center",
        accent: "#3a64ff",
        icon: "none",
      },
      fields: [
        TF("label", "Label"),
        TF("href", "Link URL", "url"),
        { key: "variant", label: "Variant", type: "select", options: ["primary","secondary","outline","ghost","dark"] },
        { key: "size",    label: "Size",    type: "select", options: ["sm","md","lg"] },
        { key: "align",   label: "Align",   type: "select", options: ["left","center","right"] },
        { key: "icon",    label: "Trailing icon", type: "select", options: ["none","arrow","external","download"] },
        TF("accent", "Accent color", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--button" style="text-align:${escAttr(p.align || "center")}">
          <a href="${escAttr(p.href)}"
             class="btn btn--${escAttr(p.variant || "primary")} btn--${escAttr(p.size || "md")}"
             style="--cta-color:${escAttr(p.accent)}"
             data-edit="label">${escHtml(p.label)}${buttonIcon(p.icon)}</a>
        </section>`);
      },
    },
    {
      id: "buttonGroup", label: "Button Group", short: "Button Group",
      group: "elements", category: "Interactive",
      thumb: thumbButtonGroup(),
      defaults: {
        primaryLabel: "Get started",
        primaryHref: "#",
        primaryVariant: "primary",
        secondaryLabel: "Learn more",
        secondaryHref: "#",
        secondaryVariant: "outline",
        size: "md",
        align: "center",
        accent: "#3a64ff",
      },
      fields: [
        TF("primaryLabel",   "Primary label"),
        TF("primaryHref",    "Primary link", "url"),
        { key: "primaryVariant", label: "Primary variant", type: "select", options: ["primary","secondary","outline","ghost","dark"] },
        TF("secondaryLabel", "Secondary label"),
        TF("secondaryHref",  "Secondary link", "url"),
        { key: "secondaryVariant", label: "Secondary variant", type: "select", options: ["primary","secondary","outline","ghost","dark"] },
        { key: "size",  label: "Size",  type: "select", options: ["sm","md","lg"] },
        { key: "align", label: "Align", type: "select", options: ["left","center","right"] },
        TF("accent", "Accent color", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--btngroup" style="text-align:${escAttr(p.align || "center")};--cta-color:${escAttr(p.accent)}">
          <a href="${escAttr(p.primaryHref)}"
             class="btn btn--${escAttr(p.primaryVariant || "primary")} btn--${escAttr(p.size || "md")}"
             data-edit="primaryLabel">${escHtml(p.primaryLabel)}</a>
          <a href="${escAttr(p.secondaryHref)}"
             class="btn btn--${escAttr(p.secondaryVariant || "outline")} btn--${escAttr(p.size || "md")}"
             data-edit="secondaryLabel">${escHtml(p.secondaryLabel)}</a>
        </section>`);
      },
    },
    {
      id: "spacer", label: "Spacer", short: "Spacer",
      group: "elements", category: "Layout",
      thumb: thumbSpacer(),
      defaults: { height: "64" },
      fields: [{ key: "height", label: "Height (px)", type: "number", placeholder: "64" }],
      render(p) {
        const h = clamp(parseInt(p.height) || 64, 8, 800);
        return el(`<div class="blk blk--spacer" style="height:${h}px;padding:0"></div>`);
      },
    },
    {
      id: "divider", label: "Divider", short: "Divider",
      group: "elements", category: "Layout",
      thumb: thumbDivider(),
      defaults: { color: "#e6e8ee", thickness: "1" },
      fields: [
        TF("color", "Color", "color"),
        { key: "thickness", label: "Thickness (px)", type: "number", placeholder: "1" },
      ],
      render(p) {
        const t = clamp(parseInt(p.thickness) || 1, 1, 12);
        return el(`<div class="blk blk--divider" style="padding:16px 48px"><hr style="border:0;height:${t}px;background:${escAttr(p.color)};margin:0" /></div>`);
      },
    },
  ];

  const componentById = (id) => COMPONENTS.find((c) => c.id === id);

  // ----- State + persistence ------------------------------------------------
  const STORAGE_KEY = "altask:editor-state-v2";

  let state = loadState() || {
    blocks: defaultDemoBlocks(),
    selectedId: null,
    name: "Untitled site",
    siteUrl: "https://altask.dev",
    device: "desktop",
    zoom: 0.6,
    activeTab: "layouts",
    inspectorTab: "design",
  };
  // Backfill fields for older saved states
  state.device       = state.device || "desktop";
  state.zoom         = state.zoom   || 0.6;
  state.activeTab    = state.activeTab || "layouts";
  state.inspectorTab = state.inspectorTab || "design";

  function defaultDemoBlocks() {
    return [
      makeBlock("navbar", {
        brand: "Altask",
        links: "Product, Templates, Pricing, Docs",
        cta: "Open editor",
        ctaHref: "#",
      }),
      makeBlock("hero", {
        title: "Build websites visually, ship them in minutes",
        subtitle: "Drag premium components onto a canvas, edit text inline, and publish a clean static site — no code, no lock-in.",
        primaryLabel: "Start free",
        primaryHref: "#",
        secondaryLabel: "Watch demo",
        secondaryHref: "#",
        accent: "#3a64ff",
      }),
      makeBlock("features", {
        title: "Why teams pick Altask",
        f1Title: "Drag & drop",
        f1Body: "Compose pages by dragging blocks onto a flexible canvas with pixel-precise controls.",
        f2Title: "Real-time preview",
        f2Body: "See pixel-perfect changes the moment you make them. Resize for desktop, tablet, mobile.",
        f3Title: "One-click publish",
        f3Body: "Push to a global edge with HTTPS in a single click — or export clean HTML to host anywhere.",
      }),
      makeBlock("columns", {
        title: "Built for the way you work",
        body: "Pair short copy with a striking visual. Two-column blocks are perfect for product highlights, testimonials, or feature walkthroughs.",
      }),
      makeBlock("quote", {
        body: "Altask replaced three tools and shipped our launch site in a single afternoon.",
        author: "Maya Chen, Founder at Northwind",
      }),
      makeBlock("cta", {
        title: "Ship your next site this week",
        subtitle: "Start free. No credit card required.",
        label: "Open the editor",
        href: "#",
      }),
      makeBlock("footer", { brand: "Altask", note: "© 2026 Altask, Inc." }),
    ];
  }

  const history = { past: [], future: [] };

  function pushHistory() {
    history.past.push(JSON.stringify(state));
    if (history.past.length > 80) history.past.shift();
    history.future.length = 0;
    updateUndoRedoButtons();
  }
  function undo() {
    if (!history.past.length) return;
    history.future.push(JSON.stringify(state));
    state = JSON.parse(history.past.pop());
    afterStateChange("Undone", true);
  }
  function redo() {
    if (!history.future.length) return;
    history.past.push(JSON.stringify(state));
    state = JSON.parse(history.future.pop());
    afterStateChange("Redone", true);
  }
  function updateUndoRedoButtons() {
    const u = $("#undoBtn"), r = $("#redoBtn");
    if (u) u.disabled = history.past.length === 0;
    if (r) r.disabled = history.future.length === 0;
  }

  function loadState() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function makeBlock(typeId, overrides) {
    const def = componentById(typeId);
    if (!def) throw new Error("Unknown component: " + typeId);
    return {
      id: "b_" + Math.random().toString(36).slice(2, 9),
      type: typeId,
      props: Object.assign({}, def.defaults, overrides || {}),
    };
  }

  function afterStateChange(message, fullPalette) {
    saveState();
    renderCanvas();
    renderInspector();
    updateUndoRedoButtons();
    syncTopbar();
    if (fullPalette) renderPalette();
    // Recompute layout-aware zoom (canvas height may have changed)
    requestAnimationFrame(() => {
      applyZoom();
      scrollSelectedIntoView();
    });
    if (message) toast(message);
  }

  function scrollSelectedIntoView() {
    if (!state.selectedId) return;
    const node = document.querySelector(`.ed-block[data-id="${state.selectedId}"]`);
    const wrap = $("#canvasWrap");
    if (!node || !wrap) return;
    // Use a couple of frames so layout (esp. ResizeObserver-driven zoom) has
    // settled before we measure.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const wr = wrap.getBoundingClientRect();
      const nr = node.getBoundingClientRect();
      const visibleTop    = wr.top + 12;
      const visibleBottom = wr.bottom - 24;
      if (nr.top < visibleTop || nr.bottom > visibleBottom) {
        const delta = nr.top - visibleTop;
        wrap.scrollBy({ top: delta, behavior: "smooth" });
      }
    }));
  }

  // ============================================================
  //  TOP BAR
  // ============================================================
  function wireTopbar() {
    $("#nameInput").value = state.name;
    $("#nameInput").addEventListener("change", (e) => {
      pushHistory();
      state.name = e.target.value || "Untitled site";
      saveState();
    });

    // Device segment
    $$(".ed-segment__btn[data-device]").forEach((b) => {
      b.classList.toggle("is-on", b.dataset.device === state.device);
      b.addEventListener("click", () => {
        state.device = b.dataset.device;
        $$(".ed-segment__btn").forEach((x) => x.classList.toggle("is-on", x === b));
        $("#canvas").dataset.device = state.device;
        // Auto-fit zoom for this device width
        autoFitZoom();
        saveState();
        syncTopbar();
      });
    });

    // Zoom
    $("#zoomInBtn").addEventListener("click",  () => setZoom(state.zoom + 0.1));
    $("#zoomOutBtn").addEventListener("click", () => setZoom(state.zoom - 0.1));

    // Undo / redo / preview / publish
    $("#undoBtn").addEventListener("click", undo);
    $("#redoBtn").addEventListener("click", redo);
    $("#resetBtn").addEventListener("click", resetEditor);
    $("#previewBtn").addEventListener("click", openPreview);
    $("#closePreviewBtn").addEventListener("click", closePreview);
    $("#exportBtn").addEventListener("click", exportHtml);

    // Keyboard
    document.addEventListener("keydown", (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((meta && e.key.toLowerCase() === "y") || (meta && e.shiftKey && e.key.toLowerCase() === "z")) { e.preventDefault(); redo(); }
      else if (meta && (e.key === "=" || e.key === "+")) { e.preventDefault(); setZoom(state.zoom + 0.1); }
      else if (meta && e.key === "-") { e.preventDefault(); setZoom(state.zoom - 0.1); }
      else if (meta && e.key === "0") { e.preventDefault(); setZoom(1); }
      else if (e.key === "Delete" || e.key === "Backspace") {
        const ae = document.activeElement;
        if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return;
        if (!state.selectedId) return;
        e.preventDefault();
        pushHistory();
        state.blocks = state.blocks.filter((b) => b.id !== state.selectedId);
        state.selectedId = null;
        afterStateChange("Block deleted");
      }
    });

    // Rail buttons (visual only — could route panels later)
    $$(".ed-rail__btn").forEach((b) => {
      b.addEventListener("click", () => {
        $$(".ed-rail__btn").forEach((x) => x.classList.toggle("is-active", x === b));
      });
    });

    // Panel tabs
    $$(".ed-tab").forEach((t) => {
      t.addEventListener("click", () => {
        state.activeTab = t.dataset.tab;
        saveState();
        $$(".ed-tab").forEach((x) => {
          const on = x === t;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-selected", on ? "true" : "false");
        });
        renderPalette();
      });
    });

    // Palette search
    $("#paletteSearch").addEventListener("input", () => renderPalette());

    // Inspector tabs (only design tab is wired with content; others act as filters in future)
    $$(".ed-insp-tab").forEach((t) => {
      t.addEventListener("click", () => {
        state.inspectorTab = t.dataset.insptab;
        saveState();
        $$(".ed-insp-tab").forEach((x) => x.classList.toggle("is-active", x === t));
        renderInspector();
      });
    });
  }

  function setZoom(z) {
    state.zoom = clamp(Math.round(z * 100) / 100, 0.25, 2);
    applyZoom();
    saveState();
    syncTopbar();
  }
  function applyZoom() {
    const frame = $("#canvasFrame");
    const canvas = $("#canvas");
    if (!frame || !canvas) return;
    const widths = { desktop: 1440, tablet: 820, mobile: 390 };
    const w = widths[state.device] || 1440;
    // Real rendered height of the canvas at 100%
    const naturalH = Math.max(canvas.scrollHeight, 720);
    frame.style.setProperty("--canvas-w", (w * state.zoom) + "px");
    frame.style.setProperty("--canvas-h", (naturalH * state.zoom) + "px");
    frame.style.setProperty("--canvas-zoom", state.zoom);
  }
  function autoFitZoom() {
    const map = { desktop: 0.6, tablet: 0.85, mobile: 1 };
    state.zoom = map[state.device] || 0.6;
    applyZoom();
  }
  function syncTopbar() {
    const widths = { desktop: 1440, tablet: 820, mobile: 390 };
    const w = widths[state.device] || 1440;
    $("#zoomWidth").textContent = w + " PX";
    $("#zoomPct").textContent = Math.round(state.zoom * 100) + " %";
    const url = $("#siteUrl");
    if (url) url.textContent = state.siteUrl || "";
  }

  // ============================================================
  //  PALETTE  (sectioned, searchable, thumbnail cards)
  // ============================================================
  function renderPalette() {
    const list = $("#paletteList");
    list.innerHTML = "";

    const tab    = state.activeTab;
    const search = ($("#paletteSearch").value || "").trim().toLowerCase();

    const items = COMPONENTS.filter((c) => c.group === tab).filter((c) => {
      if (!search) return true;
      return (c.label + " " + c.category + " " + c.id).toLowerCase().includes(search);
    });

    if (items.length === 0) {
      list.appendChild(el(`<div class="ed-comp-empty">No components match "${escHtml(search)}".</div>`));
      return;
    }

    // Group by category
    const groups = {};
    for (const c of items) {
      (groups[c.category] = groups[c.category] || []).push(c);
    }

    Object.entries(groups).forEach(([cat, comps]) => {
      const section = el(`<div class="ed-section">
        <div class="ed-section__head">
          <h4>${escHtml(cat)}</h4>
          <span class="ed-section__chev">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </span>
        </div>
        <div class="ed-section__grid"></div>
      </div>`);

      const head = section.querySelector(".ed-section__head");
      head.addEventListener("click", () => section.classList.toggle("is-collapsed"));

      const grid = section.querySelector(".ed-section__grid");
      for (const c of comps) {
        const card = el(`<div class="ed-comp" draggable="true" data-comp="${c.id}" title="${escAttr(c.label)} — drag onto the canvas">
          <span class="ed-comp__cap">${escHtml(c.short || c.label)}</span>
          <span class="ed-comp__thumb">${c.thumb}</span>
        </div>`);
        card.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/altask-component", c.id);
          e.dataTransfer.effectAllowed = "copy";
          card.classList.add("is-dragging");
        });
        card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
        // Click to append at the end — predictable. Use inline "+" between
        // blocks for mid-document insertion.
        card.addEventListener("click", () => {
          pushHistory();
          const block = makeBlock(c.id);
          state.blocks.push(block);
          state.selectedId = block.id;
          afterStateChange(`${c.label} added`);
        });
        grid.appendChild(card);
      }
      list.appendChild(section);
    });
  }

  function getInsertIndex() {
    if (!state.selectedId) return state.blocks.length;
    const i = state.blocks.findIndex((b) => b.id === state.selectedId);
    return i === -1 ? state.blocks.length : i + 1;
  }

  // ============================================================
  //  CANVAS
  // ============================================================
  function renderCanvas() {
    const canvas = $("#canvas");
    canvas.innerHTML = "";
    canvas.dataset.device = state.device;

    if (state.blocks.length === 0) {
      canvas.appendChild(el(`<div class="ed-canvas__empty">
        <span class="icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18M8 14h8"/></svg>
        </span>
        <h2>Drag a component to start</h2>
        <p>Pick a layout or element from the left panel and drop it here. Or click any component to insert it.</p>
      </div>`));
      // Still wire one inserter so empty canvas accepts drops
      const slot = el(`<div class="ed-slot" data-index="0"><hr class="ed-dropline" data-index="0" /></div>`);
      canvas.appendChild(slot);
      return;
    }

    // Slot at the very top
    canvas.appendChild(makeSlot(0));

    state.blocks.forEach((b, i) => {
      const def = componentById(b.type);
      if (!def) return;
      const wrap = el(`<div class="ed-block" data-id="${b.id}" data-type="${b.type}"></div>`);
      wrap.appendChild(def.render(b.props));
      wrap.prepend(makeBlockBar(def.label));
      if (b.id === state.selectedId) wrap.classList.add("is-selected");

      wrap.addEventListener("click", (e) => {
        if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
        e.stopPropagation();
        state.selectedId = b.id;
        renderCanvas();
        renderInspector();
      });

      wireInlineEditing(wrap, b);
      applyStyleOverrides(b);

      canvas.appendChild(wrap);
      canvas.appendChild(makeSlot(i + 1));
    });

    canvas.addEventListener("click", () => {
      if (state.selectedId !== null) {
        state.selectedId = null;
        renderCanvas();
        renderInspector();
      }
    }, { once: true });
  }

  function makeSlot(idx) {
    const slot = el(`<div class="ed-slot" data-index="${idx}">
      <hr class="ed-dropline" data-index="${idx}" />
      <button class="ed-slot__add" type="button" title="Insert here">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        <span>Insert</span>
      </button>
    </div>`);
    slot.querySelector(".ed-slot__add").addEventListener("click", (e) => {
      e.stopPropagation();
      openInsertMenu(slot, idx);
    });
    return slot;
  }

  function openInsertMenu(slot, idx) {
    // Close any existing menu
    $$(".ed-insert-menu").forEach((m) => m.remove());

    const menu = el(`<div class="ed-insert-menu">
      <input type="search" placeholder="Search components" />
      <div class="ed-insert-menu__list"></div>
    </div>`);
    const search = menu.querySelector("input");
    const list = menu.querySelector(".ed-insert-menu__list");

    function renderItems() {
      const q = (search.value || "").toLowerCase();
      list.innerHTML = "";
      const filtered = COMPONENTS.filter((c) => !q || (c.label + " " + c.category).toLowerCase().includes(q));
      if (filtered.length === 0) {
        list.appendChild(el(`<div class="ed-insert-menu__empty">No matches</div>`));
        return;
      }
      for (const c of filtered) {
        const row = el(`<button class="ed-insert-menu__item" type="button">
          <span class="ed-insert-menu__thumb">${c.thumb}</span>
          <span class="ed-insert-menu__meta">
            <strong>${escHtml(c.label)}</strong>
            <span>${escHtml(c.category)}</span>
          </span>
        </button>`);
        row.addEventListener("click", () => {
          pushHistory();
          const block = makeBlock(c.id);
          state.blocks.splice(idx, 0, block);
          state.selectedId = block.id;
          menu.remove();
          afterStateChange(`${c.label} added`);
        });
        list.appendChild(row);
      }
    }
    search.addEventListener("input", renderItems);
    renderItems();

    slot.appendChild(menu);
    setTimeout(() => search.focus(), 0);

    const close = (ev) => {
      if (menu.contains(ev.target)) return;
      menu.remove();
      document.removeEventListener("mousedown", close, true);
    };
    setTimeout(() => document.addEventListener("mousedown", close, true), 0);
  }

  function makeBlockBar(label) {
    const bar = el(`<div class="ed-block__bar" contenteditable="false">
      <span class="label">${escHtml(label)}</span>
      <button type="button" data-act="up" title="Move up">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
      <button type="button" data-act="down" title="Move down">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </button>
      <button type="button" data-act="dup" title="Duplicate">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></svg>
      </button>
      <button type="button" data-act="del" title="Delete" class="danger">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>
      </button>
    </div>`);
    bar.addEventListener("click", (e) => {
      e.stopPropagation();
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const blockEl = bar.parentElement;
      const id = blockEl.dataset.id;
      const idx = state.blocks.findIndex((x) => x.id === id);
      if (idx === -1) return;
      pushHistory();
      const action = btn.dataset.act;
      if (action === "up" && idx > 0) {
        [state.blocks[idx - 1], state.blocks[idx]] = [state.blocks[idx], state.blocks[idx - 1]];
      } else if (action === "down" && idx < state.blocks.length - 1) {
        [state.blocks[idx + 1], state.blocks[idx]] = [state.blocks[idx], state.blocks[idx + 1]];
      } else if (action === "dup") {
        const copy = JSON.parse(JSON.stringify(state.blocks[idx]));
        copy.id = "b_" + Math.random().toString(36).slice(2, 9);
        state.blocks.splice(idx + 1, 0, copy);
        state.selectedId = copy.id;
      } else if (action === "del") {
        state.blocks.splice(idx, 1);
        if (state.selectedId === id) state.selectedId = null;
      }
      afterStateChange();
    });
    return bar;
  }

  function wireInlineEditing(wrap, block) {
    $$('[data-edit]', wrap).forEach((node) => {
      node.setAttribute("contenteditable", "true");
      node.spellcheck = false;
      let prev = "";
      node.addEventListener("focus", () => {
        prev = node.textContent;
        state.selectedId = block.id;
        $$(".ed-block").forEach((b) => b.classList.toggle("is-selected", b.dataset.id === block.id));
        renderInspector();
        // restore focus to the editable node after inspector re-render
        setTimeout(() => node.focus(), 0);
      });
      node.addEventListener("input", () => {
        const key = node.getAttribute("data-edit");
        const value = node.textContent.replace(/^"|"$/g, "").replace(/^—\s/, "");
        block.props[key] = value;
        saveState();
        if (state.selectedId === block.id) {
          const input = document.querySelector(`[data-insp-key="${key}"]`);
          if (input && document.activeElement !== input) input.value = value;
        }
      });
      node.addEventListener("blur", () => {
        if (node.textContent !== prev) pushHistory();
      });
    });
  }

  // ----- Drag & drop --------------------------------------------------------
  function wireCanvasPan() {
    const wrap = $("#canvasWrap");
    let isPanning = false;
    let isSpaceDown = false;
    let startX = 0, startY = 0, startScrollLeft = 0, startScrollTop = 0;

    const setHandCursor = (on) => {
      wrap.classList.toggle("is-hand", on);
    };

    document.addEventListener("keydown", (e) => {
      if (e.code !== "Space") return;
      const ae = document.activeElement;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return;
      if (isSpaceDown) return;
      isSpaceDown = true;
      setHandCursor(true);
      e.preventDefault();
    });
    document.addEventListener("keyup", (e) => {
      if (e.code !== "Space") return;
      isSpaceDown = false;
      if (!isPanning) setHandCursor(false);
    });

    wrap.addEventListener("mousedown", (e) => {
      // Pan when: middle mouse, OR space-held + left button
      const middle = e.button === 1;
      const spaceLeft = isSpaceDown && e.button === 0;
      if (!middle && !spaceLeft) return;
      // Don't pan when clicking interactive chrome
      if (e.target.closest && e.target.closest(".ed-block__bar, .ed-slot__add, .ed-insert-menu")) return;

      e.preventDefault();
      isPanning = true;
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = wrap.scrollLeft;
      startScrollTop  = wrap.scrollTop;
      setHandCursor(true);
      wrap.classList.add("is-panning");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanning) return;
      wrap.scrollLeft = startScrollLeft - (e.clientX - startX);
      wrap.scrollTop  = startScrollTop  - (e.clientY - startY);
    });
    window.addEventListener("mouseup", () => {
      if (!isPanning) return;
      isPanning = false;
      wrap.classList.remove("is-panning");
      if (!isSpaceDown) setHandCursor(false);
    });

    // Trackpad pinch-to-zoom (ctrl + wheel) — Figma-style precise zoom
    wrap.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(state.zoom + dir);
    }, { passive: false });
  }

  // ----- Drag & drop --------------------------------------------------------
  function wireCanvasDnD() {
    const wrap = $("#canvasWrap");

    function clearActiveLines() {
      $$(".ed-dropline").forEach((l) => l.classList.remove("is-active"));
    }
    function nearestDropline(clientY) {
      const lines = $$(".ed-dropline");
      let best = null, bestDist = Infinity;
      for (const l of lines) {
        const r = l.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - clientY);
        if (d < bestDist) { bestDist = d; best = l; }
      }
      return best;
    }

    wrap.addEventListener("dragover", (e) => {
      if (
        e.dataTransfer.types.includes("text/altask-component") ||
        e.dataTransfer.types.includes("text/altask-block")
      ) {
        e.preventDefault();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes("text/altask-component") ? "copy" : "move";
      } else { return; }
      clearActiveLines();
      const line = nearestDropline(e.clientY);
      if (line) line.classList.add("is-active");
    });

    wrap.addEventListener("dragleave", (e) => { if (e.target === wrap) clearActiveLines(); });

    wrap.addEventListener("drop", (e) => {
      const compId = e.dataTransfer.getData("text/altask-component");
      const blockId = e.dataTransfer.getData("text/altask-block");
      if (!compId && !blockId) return;
      e.preventDefault();
      const line = nearestDropline(e.clientY);
      const idx = line ? Number(line.dataset.index) : state.blocks.length;

      pushHistory();
      if (compId) {
        const block = makeBlock(compId);
        state.blocks.splice(idx, 0, block);
        state.selectedId = block.id;
      } else if (blockId) {
        const fromIdx = state.blocks.findIndex((b) => b.id === blockId);
        if (fromIdx === -1) return;
        const [moved] = state.blocks.splice(fromIdx, 1);
        const adjust = fromIdx < idx ? idx - 1 : idx;
        state.blocks.splice(adjust, 0, moved);
        state.selectedId = moved.id;
      }
      clearActiveLines();
      afterStateChange();
    });

    wrap.addEventListener("mousedown", (e) => {
      const blockEl = e.target.closest && e.target.closest(".ed-block");
      if (!blockEl) return;
      if (e.target.closest("[contenteditable='true']")) return;
      if (e.target.closest("button")) return;
      blockEl.setAttribute("draggable", "true");
    });
    wrap.addEventListener("dragstart", (e) => {
      const blockEl = e.target.closest && e.target.closest(".ed-block");
      if (!blockEl) return;
      e.dataTransfer.setData("text/altask-block", blockEl.dataset.id);
      e.dataTransfer.effectAllowed = "move";
    });
  }

  // ============================================================
  //  INSPECTOR
  // ============================================================
  function renderInspector() {
    const insp = $("#inspector");
    insp.innerHTML = "";
    const block = state.blocks.find((b) => b.id === state.selectedId);

    if (!block) {
      insp.appendChild(el(`<div class="ed-insp__empty">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-10 10H4v-6z"/><path d="M14 4l3-3 6 6-3 3"/></svg>
        <p>Select a block on the canvas</p>
        <small>Spacing, size, and styles will appear here.</small>
      </div>`));
      return;
    }

    const def = componentById(block.type);

    // Block name header
    insp.appendChild(el(`<div class="ip-block-head">
      <h3>${escHtml(def.label)}</h3>
      <p>Adjust layout, content and styles</p>
    </div>`));

    insp.appendChild(buildSpacingPanel(block));
    insp.appendChild(buildSizePanel(block));
    insp.appendChild(buildPositionPanel(block));
    insp.appendChild(buildTypographyPanel(block));
    insp.appendChild(buildColorsPanel(block));
    insp.appendChild(buildContentPanel(block, def));
  }

  // ----- Panel: Spacing -----------------------------------------------------
  function buildSpacingPanel(block) {
    const p = block.props;
    // Use single _padding/_margin where present, else 4-edge values
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Spacing</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body">
        <div class="ip-spacing">
          <span class="ip-spacing__lbl ip-spacing__lbl--m">MARGIN</span>
          <div class="ip-spacing__ring">
            <span class="ip-spacing__lbl ip-spacing__lbl--p">PADDING</span>
            <div class="ip-spacing__inner">
              <span class="ip-spacing__chain">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l3.54-3.54a5 5 0 1 0-7.07-7.07L11.41 4M14 11a5 5 0 0 0-7.07 0l-3.54 3.54a5 5 0 1 0 7.07 7.07L12.59 20"/></svg>
              </span>
            </div>
            <input type="text" data-edge="pt" placeholder="0" value="${escAttr(p._pt ?? "")}" />
            <input type="text" data-edge="pb" placeholder="0" value="${escAttr(p._pb ?? "")}" />
            <input type="text" data-edge="pl" placeholder="0" value="${escAttr(p._pl ?? "")}" />
            <input type="text" data-edge="pr" placeholder="0" value="${escAttr(p._pr ?? "")}" />
          </div>
          <input type="text" data-edge="mt" placeholder="Auto" value="${escAttr(p._mt ?? "")}" />
          <input type="text" data-edge="mb" placeholder="Auto" value="${escAttr(p._mb ?? "")}" />
          <input type="text" data-edge="ml" placeholder="Auto" value="${escAttr(p._ml ?? "")}" />
          <input type="text" data-edge="mr" placeholder="Auto" value="${escAttr(p._mr ?? "")}" />
        </div>
      </div>
    </section>`);

    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));

    $$('input[data-edge]', panel).forEach((inp) => {
      let pushed = false;
      inp.addEventListener("focus", () => { pushed = false; });
      inp.addEventListener("input", () => {
        if (!pushed) { pushHistory(); pushed = true; }
        const edge = inp.dataset.edge;
        block.props["_" + edge] = inp.value;
        applyStyleOverrides(block);
        saveState();
      });
    });
    return panel;
  }

  // ----- Panel: Size --------------------------------------------------------
  function buildSizePanel(block) {
    const p = block.props;
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Size</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body">
        <div class="ip-row">
          <div class="ip-field">
            <span class="ip-field__lbl">Width</span>
            <span class="ip-input"><input type="text" data-insp-key="_width" value="${escAttr(p._width ?? "")}" placeholder="Auto" /><span class="ip-input__suffix">PX</span></span>
          </div>
          <div class="ip-field">
            <span class="ip-field__lbl">Height</span>
            <span class="ip-input"><input type="text" data-insp-key="_height" value="${escAttr(p._height ?? "")}" placeholder="Auto" /><span class="ip-input__suffix">PX</span></span>
          </div>
        </div>
        <div class="ip-section">
          <span class="ip-field__lbl" style="display:block;margin-bottom:6px;">Overflow</span>
          <div class="ip-seg" data-prop="_overflow">
            <button class="ip-seg__btn ${p._overflow === "visible" || !p._overflow ? "is-on" : ""}" data-val="visible" title="Visible">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="ip-seg__btn ${p._overflow === "hidden" ? "is-on" : ""}" data-val="hidden" title="Hidden">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a17.3 17.3 0 0 1-2.06 3.05M6.61 6.61A17.5 17.5 0 0 0 2 11s3 7 10 7a9.12 9.12 0 0 0 5.4-1.6"/></svg>
            </button>
            <button class="ip-seg__btn ${p._overflow === "scroll" ? "is-on" : ""}" data-val="scroll" title="Scroll">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5-5 5 5M7 14l5 5 5-5"/></svg>
            </button>
            <button class="ip-seg__btn ${p._overflow === "auto" ? "is-on" : ""}" data-val="auto" title="Auto">
              <span style="font-size:11px;font-weight:600;color:inherit;">Auto</span>
            </button>
          </div>
        </div>
      </div>
    </section>`);
    wirePanelInputs(panel, block);
    wireSegments(panel, block);
    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));
    return panel;
  }

  // ----- Panel: Position ----------------------------------------------------
  function buildPositionPanel(block) {
    const p = block.props;
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Position</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body">
        <div class="ip-row">
          <div class="ip-field ip-input--full" style="grid-column:1/-1;">
            <span class="ip-field__lbl">Type</span>
            <span class="ip-input">
              <select data-insp-key="_position">
                ${["static","relative","absolute","fixed","sticky"].map(v => `<option value="${v}" ${p._position === v ? "selected" : ""}>${v}</option>`).join("")}
              </select>
            </span>
          </div>
        </div>
      </div>
    </section>`);
    wirePanelInputs(panel, block);
    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));
    return panel;
  }

  // ----- Panel: Typography --------------------------------------------------
  function buildTypographyPanel(block) {
    const p = block.props;
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Typography</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body">
        <div class="ip-field" style="margin-bottom:8px;">
          <span class="ip-field__lbl">Typeface</span>
          <span class="ip-input">
            <select data-insp-key="_fontFamily">
              ${["Inter","Urbanist","Playfair Display","System UI","Georgia","Helvetica"].map(f => `<option value="${f}" ${p._fontFamily === f ? "selected" : ""}>${f}</option>`).join("")}
            </select>
          </span>
        </div>
        <div class="ip-row">
          <div class="ip-field">
            <span class="ip-field__lbl">Font weight</span>
            <span class="ip-input">
              <select data-insp-key="_fontWeight">
                ${["Regular","Medium","Semibold","Bold","Extrabold"].map(w => `<option value="${w}" ${p._fontWeight === w ? "selected" : ""}>${w}</option>`).join("")}
              </select>
            </span>
          </div>
          <div class="ip-field">
            <span class="ip-field__lbl">Font size</span>
            <span class="ip-input"><input type="text" data-insp-key="_fontSize" value="${escAttr(p._fontSize ?? "")}" placeholder="—" /><span class="ip-input__suffix">PX</span></span>
          </div>
        </div>
        <div class="ip-section">
          <span class="ip-field__lbl" style="display:block;margin-bottom:6px;">Align</span>
          <div class="ip-seg" data-prop="_textAlign">
            ${[
              { v: "left",    t: "Left",   svg: '<path d="M3 6h18M3 12h12M3 18h18"/>' },
              { v: "center",  t: "Center", svg: '<path d="M3 6h18M6 12h12M3 18h18"/>' },
              { v: "right",   t: "Right",  svg: '<path d="M3 6h18M9 12h12M3 18h18"/>' },
              { v: "justify", t: "Justify",svg: '<path d="M3 6h18M3 12h18M3 18h18"/>' },
            ].map(o => `<button class="ip-seg__btn ${p._textAlign === o.v ? "is-on" : ""}" data-val="${o.v}" title="${o.t}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${o.svg}</svg>
            </button>`).join("")}
          </div>
        </div>
      </div>
    </section>`);
    wirePanelInputs(panel, block);
    wireSegments(panel, block);
    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));
    return panel;
  }

  // ----- Panel: Colors ------------------------------------------------------
  function buildColorsPanel(block) {
    const p = block.props;
    const swatches = ["#3a64ff","#181024","#10b981","#f59e0b","#ef4444","#8b5cf6"];
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Colors</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body">
        <div class="ip-row">
          <div class="ip-field">
            <span class="ip-field__lbl">Text</span>
            <span class="ip-input">
              <input type="color" data-insp-key="_color" value="${escAttr(p._color || "#181024")}" style="width:24px;height:24px;border:0;padding:0;background:none;" />
              <input type="text" data-insp-key="_color" value="${escAttr(p._color || "")}" placeholder="—" style="margin-left:6px;" />
            </span>
          </div>
          <div class="ip-field">
            <span class="ip-field__lbl">Background</span>
            <span class="ip-input">
              <input type="color" data-insp-key="_bgColor" value="${escAttr(p._bgColor || "#ffffff")}" style="width:24px;height:24px;border:0;padding:0;background:none;" />
              <input type="text" data-insp-key="_bgColor" value="${escAttr(p._bgColor || "")}" placeholder="—" style="margin-left:6px;" />
            </span>
          </div>
        </div>
        <div class="ip-section">
          <span class="ip-field__lbl" style="display:block;margin-bottom:6px;">Quick swatches</span>
          <div class="ip-colors">
            ${swatches.map(c => `<button class="ip-color" data-swatch="${c}" style="background:${c}" title="${c}"></button>`).join("")}
          </div>
        </div>
      </div>
    </section>`);

    wirePanelInputs(panel, block);
    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));

    // Swatch quick-set background
    $$('[data-swatch]', panel).forEach((b) => {
      b.addEventListener("click", () => {
        pushHistory();
        block.props._bgColor = b.dataset.swatch;
        applyStyleOverrides(block);
        renderInspector();
      });
    });
    return panel;
  }

  // ----- Panel: Content (component-specific fields) -------------------------
  function buildContentPanel(block, def) {
    const panel = el(`<section class="ip-panel">
      <div class="ip-panel__head">
        <h4>Content</h4>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      <div class="ip-panel__body"></div>
    </section>`);
    const body = panel.querySelector(".ip-panel__body");

    for (const f of def.fields) {
      const value = block.props[f.key] ?? "";
      let inputHtml;
      if (f.type === "textarea") {
        inputHtml = `<span class="ip-input ip-input--textarea ip-input--full"><textarea data-insp-key="${f.key}" placeholder="${escAttr(f.placeholder || "")}">${escHtml(value)}</textarea></span>`;
      } else if (f.type === "color") {
        inputHtml = `<span class="ip-input ip-input--full">
          <input type="color" data-insp-key="${f.key}" value="${escAttr(value || "#3a64ff")}" style="width:24px;height:24px;border:0;padding:0;background:none;" />
          <input type="text" data-insp-key="${f.key}" value="${escAttr(value)}" style="margin-left:6px;" />
        </span>`;
      } else {
        inputHtml = `<span class="ip-input ip-input--full"><input type="${f.type || "text"}" data-insp-key="${f.key}" value="${escAttr(value)}" placeholder="${escAttr(f.placeholder || "")}" /></span>`;
      }
      const field = el(`<div class="ip-field" style="margin-bottom:10px;">
        <span class="ip-field__lbl">${escHtml(f.label)}</span>
      </div>`);
      field.appendChild(el(inputHtml));
      body.appendChild(field);
    }

    wirePanelInputs(panel, block);
    panel.querySelector(".ip-panel__head").addEventListener("click", () => panel.classList.toggle("is-collapsed"));
    return panel;
  }

  // ----- Inspector wiring ---------------------------------------------------
  function wirePanelInputs(panel, block) {
    $$('[data-insp-key]', panel).forEach((inp) => {
      let pushed = false;
      inp.addEventListener("focus", () => { pushed = false; });
      inp.addEventListener("input", () => {
        if (!pushed) { pushHistory(); pushed = true; }
        const key = inp.getAttribute("data-insp-key");
        block.props[key] = inp.value;
        // Sync paired hex/text inputs (color picker + text)
        const pair = panel.querySelectorAll(`[data-insp-key="${CSS.escape(key)}"]`);
        pair.forEach((other) => { if (other !== inp) other.value = inp.value; });
        saveState();
        if (key.startsWith("_")) applyStyleOverrides(block);
        else replaceBlockInCanvas(block);
      });
    });
  }
  function wireSegments(panel, block) {
    $$('.ip-seg', panel).forEach((seg) => {
      const prop = seg.dataset.prop;
      seg.addEventListener("click", (e) => {
        const btn = e.target.closest(".ip-seg__btn");
        if (!btn) return;
        pushHistory();
        block.props[prop] = btn.dataset.val;
        $$('.ip-seg__btn', seg).forEach((b) => b.classList.toggle("is-on", b === btn));
        applyStyleOverrides(block);
        saveState();
      });
    });
  }

  function applyStyleOverrides(block) {
    const node = document.querySelector(`.ed-block[data-id="${block.id}"]`);
    if (!node) return;
    const blk = node.querySelector(".blk") || node.querySelector("[class*='blk--']") || node.firstElementChild;
    if (!blk) return;
    const p = block.props;

    // Clear previous overrides cleanly
    const propsToClear = [
      "padding","padding-top","padding-bottom","padding-left","padding-right",
      "margin","margin-top","margin-bottom","margin-left","margin-right",
      "width","height","overflow","position","font-family","font-weight","font-size",
      "text-align","color","background-color"
    ];
    propsToClear.forEach((k) => blk.style.removeProperty(k));

    // Spacing — per-edge if any edge set, else legacy _padding
    const edges = ["pt","pr","pb","pl","mt","mr","mb","ml"];
    const hasEdge = edges.some((e) => p["_" + e] != null && p["_" + e] !== "");
    if (hasEdge) {
      if (p._pt) blk.style.paddingTop    = px(p._pt);
      if (p._pr) blk.style.paddingRight  = px(p._pr);
      if (p._pb) blk.style.paddingBottom = px(p._pb);
      if (p._pl) blk.style.paddingLeft   = px(p._pl);
      if (p._mt) blk.style.marginTop     = px(p._mt);
      if (p._mr) blk.style.marginRight   = px(p._mr);
      if (p._mb) blk.style.marginBottom  = px(p._mb);
      if (p._ml) blk.style.marginLeft    = px(p._ml);
    } else if (p._padding) {
      blk.style.padding = px(p._padding);
    }

    if (p._width)   blk.style.width    = px(p._width);
    if (p._height)  blk.style.height   = px(p._height);
    if (p._overflow) blk.style.overflow = p._overflow;
    if (p._position) blk.style.position = p._position;

    if (p._fontFamily) blk.style.fontFamily = p._fontFamily.replace(/^System UI$/i, "system-ui");
    if (p._fontWeight) blk.style.fontWeight = mapFontWeight(p._fontWeight);
    if (p._fontSize)   blk.style.fontSize   = px(p._fontSize);
    if (p._textAlign)  blk.style.textAlign  = p._textAlign;
    if (p._color)      blk.style.color           = p._color;
    if (p._bgColor && p._bgColor.toLowerCase() !== "#ffffff") blk.style.backgroundColor = p._bgColor;
  }

  function px(v) {
    if (v == null || v === "") return "";
    const s = String(v).trim();
    if (/^[0-9]+(\.[0-9]+)?$/.test(s)) return s + "px";
    return s; // already includes a unit or "auto"
  }
  function mapFontWeight(w) {
    return ({ Regular: 400, Medium: 500, Semibold: 600, Bold: 700, Extrabold: 800 })[w] || w;
  }

  function replaceBlockInCanvas(block) {
    const node = document.querySelector(`.ed-block[data-id="${block.id}"]`);
    if (!node) return;
    const def = componentById(block.type);
    node.innerHTML = "";
    node.appendChild(def.render(block.props));
    node.prepend(makeBlockBar(def.label));
    if (block.id === state.selectedId) node.classList.add("is-selected");
    wireInlineEditing(node, block);
    applyStyleOverrides(block);
    node.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      e.stopPropagation();
      state.selectedId = block.id;
      renderCanvas();
      renderInspector();
    });
  }

  // ============================================================
  //  PREVIEW + EXPORT
  // ============================================================
  function buildExportedHtml() {
    const doc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(state.name)} · Built with Altask</title>
  <style>${exportedCss()}</style>
</head>
<body>
${state.blocks.map((b) => renderForExport(b)).join("\n")}
</body>
</html>`;
    return doc;
  }
  function renderForExport(block) {
    const def = componentById(block.type);
    if (!def) return "";
    const node = def.render(block.props);
    const p = block.props;

    // Apply style overrides as inline styles
    if (p._pt) node.style.paddingTop    = px(p._pt);
    if (p._pr) node.style.paddingRight  = px(p._pr);
    if (p._pb) node.style.paddingBottom = px(p._pb);
    if (p._pl) node.style.paddingLeft   = px(p._pl);
    if (p._mt) node.style.marginTop     = px(p._mt);
    if (p._mr) node.style.marginRight   = px(p._mr);
    if (p._mb) node.style.marginBottom  = px(p._mb);
    if (p._ml) node.style.marginLeft    = px(p._ml);
    if (p._padding && !p._pt && !p._pr && !p._pb && !p._pl) node.style.padding = px(p._padding);
    if (p._width)     node.style.width     = px(p._width);
    if (p._height)    node.style.height    = px(p._height);
    if (p._overflow)  node.style.overflow  = p._overflow;
    if (p._position)  node.style.position  = p._position;
    if (p._fontFamily) node.style.fontFamily = p._fontFamily;
    if (p._fontWeight) node.style.fontWeight = mapFontWeight(p._fontWeight);
    if (p._fontSize)   node.style.fontSize   = px(p._fontSize);
    if (p._textAlign)  node.style.textAlign  = p._textAlign;
    if (p._color)      node.style.color      = p._color;
    if (p._bgColor && p._bgColor.toLowerCase() !== "#ffffff") node.style.backgroundColor = p._bgColor;

    node.querySelectorAll("[data-edit]").forEach((n) => n.removeAttribute("data-edit"));
    node.querySelectorAll("[contenteditable]").forEach((n) => n.removeAttribute("contenteditable"));
    return node.outerHTML;
  }
  function exportedCss() {
    return `
      *,*::before,*::after{box-sizing:border-box}
      body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#181024;line-height:1.55;background:#fff}
      .blk{padding:64px 48px}
      @media (max-width:640px){.blk{padding:48px 22px}}
      .blk--hero{text-align:center;background:linear-gradient(180deg,#eef2ff,#fff);padding:96px 32px}
      .blk--hero h1{font-size:clamp(2rem,1.4rem + 2.5vw,3.4rem);font-weight:700;letter-spacing:-.02em;margin:0 0 14px;line-height:1.1}
      .blk--hero p{color:#6b7280;max-width:640px;margin:0 auto;font-size:16px}
      .blk--hero .ctas{display:inline-flex;gap:10px;margin-top:24px;flex-wrap:wrap;justify-content:center}
      .blk--hero .b1,.blk--hero .b2{padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;border:1px solid transparent}
      .blk--hero .b1{background:var(--cta-color,#3a64ff);color:#fff}
      .blk--hero .b2{background:#fff;color:#181024;border-color:#d8dbe4}
      .blk--hero-split{text-align:left;padding:64px 56px 80px;background:linear-gradient(180deg,#fff,#f7f9ff)}
      .blk--hero-split .hero-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:48px;align-items:center;max-width:1240px;margin:0 auto}
      @media (max-width:880px){.blk--hero-split .hero-grid{grid-template-columns:1fr;gap:28px}}
      .blk--hero-split .hero-eyebrow{display:inline-block;padding:4px 10px;background:#fff5e6;color:#b86e00;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-bottom:14px}
      .blk--hero-split h1{font-size:clamp(2.2rem,1.6rem + 2.6vw,3.6rem);font-weight:800;letter-spacing:-.025em;color:#181024;margin:0 0 16px;line-height:1.05}
      .blk--hero-split p{color:#6b7280;font-size:16px;line-height:1.55;margin:0 0 22px;max-width:520px}
      .blk--hero-split .ctas{display:inline-flex;gap:10px}
      .blk--hero-split .b1{display:inline-block;padding:12px 22px;border-radius:999px;background:var(--cta-color,#3a64ff);color:#fff;font-weight:600;font-size:14px;text-decoration:none;box-shadow:0 8px 22px -8px rgba(58,100,255,.55)}
      .blk--hero-split .b2{display:inline-block;padding:12px 22px;border-radius:999px;background:transparent;color:#181024;border:1px solid #d8dbe4;font-weight:600;font-size:14px;text-decoration:none}
      .blk--hero-split .hero-rating{display:flex;align-items:center;gap:12px;margin-top:36px;flex-wrap:wrap}
      .blk--hero-split .hero-rating__avatars{display:inline-flex}
      .blk--hero-split .hero-rating__avatars span{width:28px;height:28px;border-radius:50%;border:2px solid #fff;margin-left:-8px;background:linear-gradient(135deg,#fda4af,#f472b6)}
      .blk--hero-split .hero-rating__avatars span:nth-child(1){margin-left:0}
      .blk--hero-split .hero-rating__avatars span:nth-child(2){background:linear-gradient(135deg,#a5b4fc,#818cf8)}
      .blk--hero-split .hero-rating__avatars span:nth-child(3){background:linear-gradient(135deg,#fde68a,#fb923c)}
      .blk--hero-split .hero-rating__avatars span:nth-child(4){background:linear-gradient(135deg,#86efac,#22c55e)}
      .blk--hero-split .hero-rating__star{font-size:13px;color:#181024;font-weight:700}
      .blk--hero-split .hero-rating__sub{font-size:12px;color:#6b7280}
      .blk--hero-split .hero-mock{width:100%;max-width:540px;border-radius:18px;overflow:hidden;background:#fff;border:1px solid #e6e8ee;box-shadow:0 30px 60px -20px rgba(15,23,42,.18);margin:0 auto;transform:rotate(-1.5deg)}
      .blk--hero-split .hero-mock__bar{display:flex;align-items:center;gap:6px;padding:10px 14px;background:#f6f7fb;border-bottom:1px solid #e6e8ee}
      .blk--hero-split .hero-mock__bar span{width:10px;height:10px;border-radius:50%;background:#ff5f57}
      .blk--hero-split .hero-mock__bar span:nth-child(2){background:#febc2e}
      .blk--hero-split .hero-mock__bar span:nth-child(3){background:#28c840}
      .blk--hero-split .hero-mock__body{display:grid;grid-template-columns:130px 1fr;height:280px}
      .blk--hero-split .hero-mock__sidebar{background:#f9fafe;border-right:1px solid #e6e8ee;padding:14px 12px;display:flex;flex-direction:column;gap:6px}
      .blk--hero-split .hero-mock__title{font-size:11px;font-weight:700;color:#181024;margin-bottom:4px}
      .blk--hero-split .hero-mock__chat{height:32px;border-radius:8px;background:#fff;border:1px solid #ececf3;position:relative}
      .blk--hero-split .hero-mock__chat.is-active{border-color:#3a64ff;background:#eef2ff}
      .blk--hero-split .hero-mock__main{position:relative;background:radial-gradient(ellipse at 80% 20%,#cdb4ff 0,transparent 55%),radial-gradient(ellipse at 20% 90%,#5bd7c2 0,transparent 55%),linear-gradient(180deg,#d0c5fd,#0e1430);overflow:hidden}
      .blk--hero-split .hero-mock__head{height:30px;background:rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.12)}
      .blk--hero-split .hero-mock__bubble{position:absolute;height:32px;border-radius:16px}
      .blk--hero-split .hero-mock__bubble--in{left:14px;background:rgba(255,255,255,.92);width:140px;top:60px}
      .blk--hero-split .hero-mock__bubble--out{right:14px;background:#3a64ff;width:120px;top:110px}
      .blk--hero-split .hero-mock__bubble--sm{left:14px;width:80px;top:160px;background:rgba(255,255,255,.92)}
      .blk--heading h2{font-size:clamp(1.6rem,1.2rem + 1.5vw,2.2rem);font-weight:700;letter-spacing:-.02em;margin:0 0 8px}
      .blk--heading p{color:#6b7280}
      .blk--text p{color:#2a1f3d;line-height:1.65;font-size:16px;max-width:720px}
      .blk--button{padding:32px}
      .blk--btngroup{padding:32px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
      .blk--btngroup[style*="text-align:left"]{justify-content:flex-start}
      .blk--btngroup[style*="text-align:right"]{justify-content:flex-end}
      .btn{display:inline-flex;align-items:center;gap:8px;font-family:inherit;font-weight:600;text-decoration:none;border-radius:10px;border:1px solid transparent;transition:transform .15s,background .15s,border-color .15s,box-shadow .15s,color .15s;white-space:nowrap}
      .btn:hover{transform:translateY(-1px)} .btn:active{transform:translateY(0)}
      .btn__icon{display:inline-grid;place-items:center;opacity:.9}
      .btn--sm{padding:8px 14px;font-size:13px;border-radius:8px}
      .btn--md{padding:11px 20px;font-size:14px;border-radius:10px}
      .btn--lg{padding:14px 26px;font-size:15px;border-radius:12px}
      .btn--primary{background:var(--cta-color,#3a64ff);color:#fff;box-shadow:0 6px 18px -8px rgba(58,100,255,.55)}
      .btn--secondary{background:#f5f6f8;color:#181024;border-color:#d8dbe4}
      .btn--secondary:hover{background:#fff;border-color:#b8bcc7}
      .btn--outline{background:transparent;color:var(--cta-color,#3a64ff);border-color:currentColor}
      .btn--outline:hover{background:rgba(58,100,255,.06)}
      .btn--ghost{background:transparent;color:#181024;border-color:transparent}
      .btn--ghost:hover{background:#f5f6f8}
      .btn--dark{background:#181024;color:#fff;box-shadow:0 6px 18px -8px rgba(15,23,42,.45)}
      .btn--dark:hover{background:#2a1f3d}
      .blk--features h2{text-align:center;font-size:26px;margin:0 0 32px;font-weight:700}
      .blk--features .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      @media (max-width:720px){.blk--features .grid{grid-template-columns:1fr}}
      .blk--features .feat{background:#fafbff;border:1px solid #e6e8ee;border-radius:12px;padding:24px}
      .blk--features .ic{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#3a64ff,#8b5cf6);margin-bottom:14px}
      .blk--features h3{font-size:16px;margin:0 0 6px;font-weight:700}
      .blk--features p{font-size:14px;color:#6b7280}
      .blk--cta{text-align:center;background:linear-gradient(135deg,#181024,#2a1f3d);color:#fff;padding:80px 32px}
      .blk--cta h2{color:#fff;font-size:32px;margin:0;font-weight:700}
      .blk--cta p{color:rgba(255,255,255,.7);max-width:520px;margin:14px auto 0}
      .blk--cta a{display:inline-block;margin-top:22px;padding:12px 24px;background:#fff;color:#181024;border-radius:10px;font-weight:600;text-decoration:none;font-size:14px}
      .blk--image .img{width:100%;aspect-ratio:16/9;border-radius:12px;background:linear-gradient(135deg,#eef2ff,#dbe4ff);background-size:cover;background-position:center}
      .blk--columns .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center}
      @media (max-width:720px){.blk--columns .grid{grid-template-columns:1fr}}
      .blk--columns h3{font-size:22px;margin:0 0 10px;font-weight:700}
      .blk--columns p{color:#2a1f3d;line-height:1.65}
      .blk--columns .visual{aspect-ratio:4/3;border-radius:12px;background:linear-gradient(135deg,#3a64ff,#8b5cf6)}
      .blk--quote{text-align:center;padding:72px 32px;background:#fafbff}
      .blk--quote blockquote{font-size:22px;font-weight:500;max-width:640px;margin:0 auto;line-height:1.45}
      .blk--quote cite{display:block;margin-top:18px;color:#6b7280;font-style:normal;font-size:14px}
      .blk--footer{background:#181024;color:rgba(255,255,255,.6);padding:36px 48px;text-align:center;font-size:13px}
      .blk--footer a{color:#fff} .blk--footer strong{color:#fff}
      .blk--navbar{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;background:#fff;border-bottom:1px solid #e6e8ee}
      .blk--navbar__brand{font-size:16px;font-weight:700;color:#181024}
      .blk--navbar__links{display:flex;gap:28px}
      .blk--navbar__links a{font-size:14px;color:#6b7280;text-decoration:none;font-weight:500}
      .blk--navbar__cta{display:inline-block;padding:9px 16px;border-radius:8px;background:#181024;color:#fff;font-size:13px;font-weight:600;text-decoration:none}
      .blk--form{padding:64px 48px;max-width:580px}
      .blk--form h2{font-size:24px;font-weight:700;margin:0 0 8px}
      .blk--form p{color:#6b7280;margin:0 0 22px;font-size:14px}
      .blk--form form{display:grid;gap:14px}
      .blk--form__field{display:grid;gap:5px}
      .blk--form__field label{font-size:12px;color:#2a1f3d;font-weight:500}
      .blk--form__field input,.blk--form__field textarea{font-family:inherit;font-size:14px;padding:11px 13px;border:1px solid #d8dbe4;border-radius:8px;background:#fff;color:#181024;outline:none}
      .blk--form__field textarea{min-height:90px;resize:vertical}
      .blk--form button[type=submit]{display:inline-block;padding:12px 22px;background:#3a64ff;color:#fff;border:0;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit;width:max-content}
      .blk--gallery{padding:56px 48px}
      .blk--gallery__cap{font-size:14px;color:#6b7280;margin:0 0 18px;text-align:center}
      .blk--gallery__grid{display:grid;gap:12px}
      .blk--gallery__cell{aspect-ratio:1;border-radius:8px;background:linear-gradient(135deg,#eef2ff,#dbe4ff);border:1px solid #e6e8ee}
      .blk--spacer{display:block}
      .blk--divider{padding:16px 48px}
      .blk--divider hr{border:0;margin:0}
    `;
  }

  function openPreview() {
    const overlay = $("#preview");
    const frame = $("#previewFrame");
    frame.srcdoc = buildExportedHtml();
    overlay.classList.add("is-open");
  }
  function closePreview() { $("#preview").classList.remove("is-open"); }

  function exportHtml() {
    if (state.blocks.length === 0) {
      toast("Nothing to export — add a block first.");
      return;
    }
    const html = buildExportedHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (state.name || "altask-page").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Exported as HTML");
  }

  function resetEditor() {
    const ok = window.confirm("Reset the editor? All blocks and settings will be cleared. This is undoable with ⌘Z.");
    if (!ok) return;
    pushHistory();
    state = {
      blocks: [],
      selectedId: null,
      name: "Untitled site",
      siteUrl: "https://altask.dev",
      device: "desktop",
      zoom: 0.6,
      activeTab: "layouts",
      inspectorTab: "design",
    };
    // Reflect new state in chrome
    $("#nameInput").value = state.name;
    $$(".ed-segment__btn[data-device]").forEach((b) =>
      b.classList.toggle("is-on", b.dataset.device === state.device)
    );
    $$(".ed-tab").forEach((t) => {
      const on = t.dataset.tab === state.activeTab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".ed-insp-tab").forEach((t) =>
      t.classList.toggle("is-active", t.dataset.insptab === state.inspectorTab)
    );
    const search = $("#paletteSearch");
    if (search) search.value = "";
    $("#canvasWrap").scrollTo({ top: 0 });
    afterStateChange("Canvas reset", true);
  }

  // ----- Toast --------------------------------------------------------------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 1800);
  }

  // ============================================================
  //  THUMBNAILS (inline SVG line drawings shown on palette cards)
  // ============================================================
  function thumbWrap(inner) {
    return `<svg viewBox="0 0 120 64" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#3a64ff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }
  function thumbNavbar()  { return thumbWrap('<rect x="6" y="22" width="108" height="20" rx="4"/><circle cx="14" cy="32" r="2"/><line x1="22" y1="32" x2="60" y2="32"/><rect x="86" y="28" width="22" height="8" rx="2"/>'); }
  function thumbFooter()  { return thumbWrap('<rect x="6" y="14" width="108" height="36" rx="4"/><line x1="14" y1="24" x2="60" y2="24"/><line x1="14" y1="32" x2="50" y2="32"/><line x1="14" y1="40" x2="40" y2="40"/>'); }
  function thumbHero()    { return thumbWrap('<rect x="6" y="10" width="50" height="44" rx="3"/><rect x="62" y="10" width="52" height="44" rx="3"/><line x1="12" y1="20" x2="48" y2="20"/><line x1="12" y1="28" x2="42" y2="28"/><rect x="12" y="38" width="22" height="8" rx="2"/>'); }
  function thumbHeroOverlay() { return thumbWrap('<rect x="6" y="10" width="108" height="44" rx="3"/><line x1="14" y1="22" x2="60" y2="22"/><line x1="14" y1="30" x2="56" y2="30"/><rect x="14" y="40" width="22" height="6" rx="2"/>'); }
  function thumbCards()   { return thumbWrap('<rect x="6" y="14" width="32" height="36" rx="3"/><rect x="44" y="14" width="32" height="36" rx="3"/><rect x="82" y="14" width="32" height="36" rx="3"/>'); }
  function thumbFeatureSection() { return thumbWrap('<rect x="6" y="14" width="50" height="36" rx="3"/><line x1="64" y1="22" x2="110" y2="22"/><line x1="64" y1="30" x2="100" y2="30"/><line x1="64" y1="38" x2="92" y2="38"/>'); }
  function thumbGallery() { return thumbWrap('<rect x="6" y="10" width="22" height="22" rx="2"/><rect x="32" y="10" width="22" height="22" rx="2"/><rect x="58" y="10" width="22" height="22" rx="2"/><rect x="84" y="10" width="30" height="22" rx="2"/><rect x="6" y="36" width="22" height="18" rx="2"/><rect x="32" y="36" width="48" height="18" rx="2"/><rect x="84" y="36" width="30" height="18" rx="2"/>'); }
  function thumbForm()    { return thumbWrap('<rect x="14" y="12" width="92" height="10" rx="2"/><rect x="14" y="26" width="92" height="10" rx="2"/><rect x="14" y="40" width="40" height="10" rx="2"/>'); }
  function thumbCTA()     { return thumbWrap('<rect x="6" y="14" width="108" height="36" rx="4"/><line x1="22" y1="26" x2="98" y2="26"/><rect x="46" y="34" width="28" height="10" rx="3"/>'); }
  function thumbQuote()   { return thumbWrap('<path d="M16 22c-4 0-8 4-8 8v6h12v-6h-6c0-2 2-4 4-4v-4z"/><line x1="36" y1="26" x2="106" y2="26"/><line x1="36" y1="36" x2="96" y2="36"/>'); }
  function thumbHeading() { return thumbWrap('<line x1="14" y1="22" x2="60" y2="22"/><line x1="14" y1="34" x2="80" y2="34"/><line x1="14" y1="44" x2="50" y2="44"/>'); }
  function thumbText()    { return thumbWrap('<line x1="14" y1="20" x2="106" y2="20"/><line x1="14" y1="28" x2="100" y2="28"/><line x1="14" y1="36" x2="106" y2="36"/><line x1="14" y1="44" x2="80" y2="44"/>'); }
  function thumbImage()   { return thumbWrap('<rect x="10" y="10" width="100" height="44" rx="3"/><circle cx="32" cy="28" r="4"/><path d="M10 50l28-22 32 22"/>'); }
  function thumbButton()  { return thumbWrap('<rect x="36" y="22" width="48" height="20" rx="10"/>'); }
  function thumbButtonGroup() { return thumbWrap('<rect x="20" y="22" width="38" height="20" rx="10"/><rect x="62" y="22" width="38" height="20" rx="10" fill="#fff"/>'); }
  function thumbSpacer()  { return thumbWrap('<line x1="60" y1="14" x2="60" y2="50"/><path d="M54 18l6-4 6 4M54 46l6 4 6-4"/>'); }
  function thumbDivider() { return thumbWrap('<line x1="10" y1="32" x2="110" y2="32"/>'); }

  // Trailing icon for a button. `kind` matches the schema option set.
  function buttonIcon(kind) {
    if (!kind || kind === "none") return "";
    const ic = {
      arrow:    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      external: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M10 14L21 3"/><path d="M19 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>',
      download: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 11l6 6 6-6"/><path d="M5 21h14"/></svg>',
    }[kind];
    return ic ? `<span class="btn__icon">${ic}</span>` : "";
  }

  // ============================================================
  //  BOOT
  // ============================================================
  function boot() {
    syncTopbar();
    renderPalette();
    wireCanvasDnD();
    wireCanvasPan();
    wireTopbar();
    renderCanvas();
    renderInspector();
    updateUndoRedoButtons();
    requestAnimationFrame(() => applyZoom());
    window.addEventListener("resize", () => applyZoom());
    // ResizeObserver on the canvas keeps the frame height in sync as inline
    // edits or style overrides change content height
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => applyZoom());
      ro.observe($("#canvas"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
