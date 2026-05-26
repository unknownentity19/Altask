/* =========================================================
   Altask — Visual editor engine
   - Component palette with drag from sidebar
   - Canvas as drop target with insertion indicator
   - Selection, reorder, duplicate, delete
   - Inspector wired to selected block
   - Undo / redo with full state snapshots
   - Device preview (desktop / tablet / mobile)
   - Live preview overlay (rendered in iframe)
   - Export to a clean standalone .html file
   - Persistence in localStorage
   ========================================================= */

(function () {
  "use strict";

  // -------- Component schema -------------------------------------------------
  // Each component declares: id, label, icon, default props, fields shown in
  // the inspector, and a `render(props) -> HTMLElement` function.
  // Keeping data and render in one place makes adding new blocks trivial.

  const TextField = (key, label, type = "text", placeholder = "") => ({
    key, label, type, placeholder
  });

  // Universal style fields added to every component's inspector
  const STYLE_FIELDS = [
    { key: "_padding", label: "Padding (px)", type: "number", placeholder: "" },
    { key: "_fontSize", label: "Font size (px)", type: "number", placeholder: "" },
    { key: "_textAlign", label: "Text align", type: "select", options: ["left", "center", "right"] },
    { key: "_bgColor", label: "Background", type: "color", placeholder: "" },
  ];

  const COMPONENTS = [
    {
      id: "hero",
      label: "Hero",
      sub: "Headline + CTAs",
      icon: heroIcon(),
      defaults: {
        title: "Build websites visually",
        subtitle: "Drag premium components onto a canvas and ship a beautiful site in minutes.",
        primaryLabel: "Get Started",
        primaryHref: "#",
        secondaryLabel: "Learn more",
        secondaryHref: "#",
        accent: "#3a64ff",
      },
      fields: [
        TextField("title", "Title"),
        TextField("subtitle", "Subtitle", "textarea"),
        TextField("primaryLabel", "Primary button"),
        TextField("primaryHref", "Primary link"),
        TextField("secondaryLabel", "Secondary button"),
        TextField("secondaryHref", "Secondary link"),
        TextField("accent", "Accent color", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--hero" style="--cta-color:${escAttr(p.accent)}">
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
      id: "heading",
      label: "Heading",
      sub: "Section title + lede",
      icon: headingIcon(),
      defaults: {
        title: "A section heading",
        subtitle: "A short supporting line that explains what this section is about.",
      },
      fields: [
        TextField("title", "Title"),
        TextField("subtitle", "Subtitle", "textarea"),
      ],
      render(p) {
        return el(`<section class="blk blk--heading">
          <h2 data-edit="title">${escHtml(p.title)}</h2>
          <p data-edit="subtitle">${escHtml(p.subtitle)}</p>
        </section>`);
      },
    },

    {
      id: "text",
      label: "Text",
      sub: "Paragraph block",
      icon: textIcon(),
      defaults: {
        body:
          "Use this block for long-form content. Click the text to edit it inline. The Altask editor preserves your spacing and typography in the exported HTML.",
      },
      fields: [TextField("body", "Body", "textarea")],
      render(p) {
        return el(`<section class="blk blk--text">
          <p data-edit="body">${escHtml(p.body)}</p>
        </section>`);
      },
    },

    {
      id: "image",
      label: "Image",
      sub: "Hero image / banner",
      icon: imageIcon(),
      defaults: {
        url: "",
      },
      fields: [
        TextField("url", "Image URL", "url", "https://..."),
      ],
      render(p) {
        const bg = p.url
          ? `url('${escAttr(p.url)}')`
          : "none";
        return el(`<section class="blk blk--image">
          <div class="img" style="--img-src:${bg}"></div>
        </section>`);
      },
    },

    {
      id: "features",
      label: "Features",
      sub: "3-column grid",
      icon: featuresIcon(),
      defaults: {
        title: "Why teams pick Altask",
        f1Title: "Drag & drop",
        f1Body: "Compose pages by dragging blocks onto a flexible canvas.",
        f2Title: "Real-time preview",
        f2Body: "See pixel-perfect changes the moment you make them.",
        f3Title: "One-click publish",
        f3Body: "Push to a global edge with HTTPS in a single click.",
      },
      fields: [
        TextField("title", "Section title"),
        TextField("f1Title", "Feature 1 title"),
        TextField("f1Body", "Feature 1 body", "textarea"),
        TextField("f2Title", "Feature 2 title"),
        TextField("f2Body", "Feature 2 body", "textarea"),
        TextField("f3Title", "Feature 3 title"),
        TextField("f3Body", "Feature 3 body", "textarea"),
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
      id: "columns",
      label: "Two columns",
      sub: "Image + text",
      icon: columnsIcon(),
      defaults: {
        title: "Built for the way you work",
        body:
          "Pair short copy with a striking visual. Two-column blocks are perfect for product highlights, testimonials, or feature walkthroughs.",
      },
      fields: [
        TextField("title", "Title"),
        TextField("body", "Body", "textarea"),
      ],
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
      id: "quote",
      label: "Quote",
      sub: "Pull quote / testimonial",
      icon: quoteIcon(),
      defaults: {
        body:
          "Altask replaced three tools and shipped our launch site in a single afternoon.",
        author: "Maya Chen, Founder at Northwind",
      },
      fields: [
        TextField("body", "Quote", "textarea"),
        TextField("author", "Attribution"),
      ],
      render(p) {
        return el(`<section class="blk blk--quote">
          <blockquote data-edit="body">“${escHtml(p.body)}”</blockquote>
          <cite data-edit="author">— ${escHtml(p.author)}</cite>
        </section>`);
      },
    },

    {
      id: "button",
      label: "Button",
      sub: "Call to action",
      icon: buttonIcon(),
      defaults: { label: "Get started", href: "#", accent: "#3a64ff" },
      fields: [
        TextField("label", "Label"),
        TextField("href", "Link URL", "url"),
        TextField("accent", "Color", "color"),
      ],
      render(p) {
        return el(`<section class="blk blk--button">
          <a href="${escAttr(p.href)}" style="--cta-color:${escAttr(p.accent)};background:${escAttr(p.accent)}" data-edit="label">${escHtml(p.label)}</a>
        </section>`);
      },
    },

    {
      id: "cta",
      label: "CTA Banner",
      sub: "Closing call to action",
      icon: ctaIcon(),
      defaults: {
        title: "Ship your next site this week",
        subtitle: "Start free. No credit card required.",
        label: "Open the editor",
        href: "#",
      },
      fields: [
        TextField("title", "Title"),
        TextField("subtitle", "Subtitle", "textarea"),
        TextField("label", "Button label"),
        TextField("href", "Button link", "url"),
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
      id: "footer",
      label: "Footer",
      sub: "Brand + copyright",
      icon: footerIcon(),
      defaults: { brand: "Altask", note: "© 2026 Altask, Inc." },
      fields: [
        TextField("brand", "Brand"),
        TextField("note", "Copyright"),
      ],
      render(p) {
        return el(`<section class="blk blk--footer">
          <strong data-edit="brand">${escHtml(p.brand)}</strong> · <span data-edit="note">${escHtml(p.note)}</span>
        </section>`);
      },
    },

    // --- NEW COMPONENTS ---
    {
      id: "navbar",
      label: "Navbar",
      sub: "Logo + navigation links",
      icon: svgWrap('<path d="M4 6h16M4 12h10M18 12h2"/>'),
      defaults: {
        brand: "Altask",
        links: "Home, Features, Pricing, Contact",
        cta: "Get Started",
        ctaHref: "#",
      },
      fields: [
        TextField("brand", "Brand name"),
        TextField("links", "Links (comma separated)"),
        TextField("cta", "CTA button label"),
        TextField("ctaHref", "CTA link", "url"),
      ],
      render(p) {
        const links = (p.links || "").split(",").map(l => l.trim()).filter(Boolean);
        return el(`<nav class="blk blk--navbar">
          <strong class="blk--navbar__brand" data-edit="brand">${escHtml(p.brand)}</strong>
          <div class="blk--navbar__links">${links.map(l => `<a href="#">${escHtml(l)}</a>`).join("")}</div>
          <a class="blk--navbar__cta" href="${escAttr(p.ctaHref)}" data-edit="cta">${escHtml(p.cta)}</a>
        </nav>`);
      },
    },

    {
      id: "form",
      label: "Form",
      sub: "Contact / signup form",
      icon: svgWrap('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h8"/>'),
      defaults: {
        title: "Get in touch",
        subtitle: "Fill out the form and we'll get back to you shortly.",
        buttonLabel: "Send message",
        fields: "Name, Email, Message",
      },
      fields: [
        TextField("title", "Title"),
        TextField("subtitle", "Subtitle"),
        TextField("fields", "Fields (comma separated)"),
        TextField("buttonLabel", "Button label"),
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
      id: "gallery",
      label: "Gallery",
      sub: "Image grid (2-4 cols)",
      icon: svgWrap('<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>'),
      defaults: {
        columns: "3",
        items: "6",
        caption: "Our recent work",
      },
      fields: [
        TextField("caption", "Caption"),
        { key: "columns", label: "Columns", type: "number", placeholder: "3" },
        { key: "items", label: "Number of items", type: "number", placeholder: "6" },
      ],
      render(p) {
        const cols = Math.min(6, Math.max(1, parseInt(p.columns) || 3));
        const count = Math.min(12, Math.max(1, parseInt(p.items) || 6));
        let cells = "";
        for (let i = 0; i < count; i++) cells += `<div class="blk--gallery__cell"></div>`;
        return el(`<section class="blk blk--gallery">
          <p class="blk--gallery__cap" data-edit="caption">${escHtml(p.caption)}</p>
          <div class="blk--gallery__grid" style="grid-template-columns:repeat(${cols},1fr)">${cells}</div>
        </section>`);
      },
    },

    {
      id: "spacer",
      label: "Spacer",
      sub: "Vertical spacing",
      icon: svgWrap('<path d="M12 5v14M5 8l7-3 7 3M5 16l7 3 7-3"/>'),
      defaults: { height: "64" },
      fields: [
        { key: "height", label: "Height (px)", type: "number", placeholder: "64" },
      ],
      render(p) {
        const h = Math.max(8, parseInt(p.height) || 64);
        return el(`<div class="blk blk--spacer" style="height:${h}px;padding:0"></div>`);
      },
    },

    {
      id: "divider",
      label: "Divider",
      sub: "Horizontal line",
      icon: svgWrap('<path d="M3 12h18"/>'),
      defaults: { color: "#ececf0", thickness: "1" },
      fields: [
        TextField("color", "Color", "color"),
        { key: "thickness", label: "Thickness (px)", type: "number", placeholder: "1" },
      ],
      render(p) {
        const t = Math.max(1, parseInt(p.thickness) || 1);
        return el(`<div class="blk blk--divider" style="padding:16px 40px"><hr style="border:0;height:${t}px;background:${escAttr(p.color)};margin:0" /></div>`);
      },
    },
  ];

  const componentById = (id) => COMPONENTS.find((c) => c.id === id);

  // -------- State + persistence ---------------------------------------------
  const STORAGE_KEY = "altask:editor-state-v1";

  /** @type {{ blocks: Array<{id:string, type:string, props:Record<string,string>}>, selectedId: string|null, name: string }} */
  let state = loadState() || {
    blocks: [
      makeBlock("hero"),
      makeBlock("features"),
      makeBlock("cta"),
    ],
    selectedId: null,
    name: "Untitled site",
  };

  const history = { past: [], future: [] };
  let suppressHistory = false;

  function pushHistory() {
    if (suppressHistory) return;
    history.past.push(JSON.stringify(state));
    if (history.past.length > 80) history.past.shift();
    history.future.length = 0;
    updateUndoRedoButtons();
  }
  function undo() {
    if (!history.past.length) return;
    history.future.push(JSON.stringify(state));
    state = JSON.parse(history.past.pop());
    afterStateChange("Undone");
  }
  function redo() {
    if (!history.future.length) return;
    history.past.push(JSON.stringify(state));
    state = JSON.parse(history.future.pop());
    afterStateChange("Redone");
  }
  function updateUndoRedoButtons() {
    $("#undoBtn").disabled = history.past.length === 0;
    $("#redoBtn").disabled = history.future.length === 0;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function makeBlock(typeId, overrides) {
    const def = componentById(typeId);
    return {
      id: "b_" + Math.random().toString(36).slice(2, 9),
      type: typeId,
      props: Object.assign({}, def.defaults, overrides || {}),
    };
  }

  function afterStateChange(message) {
    saveState();
    renderCanvas();
    renderInspector();
    updateUndoRedoButtons();
    if (message) toast(message);
  }

  // -------- DOM utilities ---------------------------------------------------
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (d.firstElementChild);
  }
  function escHtml(s) {
    return String(s == null ? "" : s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function escAttr(s) {
    return escHtml(s).replaceAll('"', "&quot;");
  }

  // -------- Sidebar (palette) -----------------------------------------------
  function renderPalette() {
    const list = $("#paletteList");
    list.innerHTML = "";
    for (const c of COMPONENTS) {
      const item = el(`<div class="ed-comp" draggable="true" data-comp="${c.id}" title="Drag onto the canvas">
        <span class="ed-comp__icon">${c.icon}</span>
        <span class="ed-comp__meta"><strong>${escHtml(c.label)}</strong><span>${escHtml(c.sub)}</span></span>
      </div>`);
      item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/altask-component", c.id);
        e.dataTransfer.effectAllowed = "copy";
        item.classList.add("is-dragging");
      });
      item.addEventListener("dragend", () => item.classList.remove("is-dragging"));
      // Click to append at end (mobile-friendly fallback)
      item.addEventListener("click", () => {
        pushHistory();
        state.blocks.push(makeBlock(c.id));
        state.selectedId = state.blocks[state.blocks.length - 1].id;
        afterStateChange(`${c.label} added`);
      });
      list.appendChild(item);
    }
  }

  // -------- Canvas ----------------------------------------------------------
  function renderCanvas() {
    const canvas = $("#canvas");
    canvas.innerHTML = "";

    if (state.blocks.length === 0) {
      canvas.appendChild(el(`<div class="ed-canvas__empty">
        <span class="icon">${heroIcon(true)}</span>
        <h2>Drag a component to start</h2>
        <p>Pick any block from the left sidebar and drop it here. You can also click a component to add it.</p>
      </div>`));
      return;
    }

    const dropline = (idx) => {
      const hr = el(`<hr class="ed-dropline" data-dropline data-index="${idx}" />`);
      return hr;
    };

    canvas.appendChild(dropline(0));

    state.blocks.forEach((b, i) => {
      const def = componentById(b.type);
      if (!def) return;

      const wrap = el(`<div class="ed-block" data-id="${b.id}" data-type="${b.type}"></div>`);
      wrap.appendChild(def.render(b.props));
      wrap.prepend(makeBlockBar(def.label));
      if (b.id === state.selectedId) wrap.classList.add("is-selected");

      // Selection
      wrap.addEventListener("click", (e) => {
        // text edits shouldn't change selection mid-edit
        if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
        e.stopPropagation();
        state.selectedId = b.id;
        renderCanvas();
        renderInspector();
      });

      // Inline contentEditable
      wireInlineEditing(wrap, b);

      // Apply style overrides
      applyStyleOverrides(b);

      canvas.appendChild(wrap);
      canvas.appendChild(dropline(i + 1));
    });

    // Click on empty canvas area clears selection
    canvas.addEventListener("click", () => {
      if (state.selectedId !== null) {
        state.selectedId = null;
        renderCanvas();
        renderInspector();
      }
    }, { once: true });
  }

  function makeBlockBar(label) {
    const bar = el(`<div class="ed-block__bar" contenteditable="false">
      <span class="label">${escHtml(label)}</span>
      <button type="button" data-act="up" title="Move up">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
      <button type="button" data-act="down" title="Move down">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
      </button>
      <button type="button" data-act="dup" title="Duplicate">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></svg>
      </button>
      <button type="button" data-act="del" title="Delete" class="danger">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>
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
      node.addEventListener("input", () => {
        const key = node.getAttribute("data-edit");
        const value = node.textContent.replace(/^“|”$/g, "").replace(/^—\s/, "");
        block.props[key] = value;
        // Don't push history per keystroke — debounce on blur instead.
        saveState();
        // Mirror to inspector if currently selected
        if (state.selectedId === block.id) {
          const input = document.querySelector(`[data-insp-key="${key}"]`);
          if (input && document.activeElement !== input) input.value = value;
        }
      });
      node.addEventListener("focus", () => {
        state.selectedId = block.id;
        // re-render only to add selected class without losing focus
        $$(".ed-block").forEach((b) => b.classList.toggle("is-selected", b.dataset.id === block.id));
        renderInspector();
        // restore focus to the editable node
        node.focus();
      });
      let prev = "";
      node.addEventListener("focus", () => { prev = node.textContent; });
      node.addEventListener("blur", () => {
        if (node.textContent !== prev) {
          // Push a single history entry per edit session
          pushHistory();
        }
      });
    });
  }

  // -------- Drag & drop onto the canvas -------------------------------------
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
      // Allow palette drops and reorder drops
      if (
        e.dataTransfer.types.includes("text/altask-component") ||
        e.dataTransfer.types.includes("text/altask-block")
      ) {
        e.preventDefault();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes("text/altask-component")
          ? "copy" : "move";
      } else {
        return;
      }
      clearActiveLines();
      const line = nearestDropline(e.clientY);
      if (line) line.classList.add("is-active");
    });

    wrap.addEventListener("dragleave", (e) => {
      if (e.target === wrap) clearActiveLines();
    });

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

    // Make rendered blocks draggable for reordering — delegate via mousedown
    // because contentEditable children steal events.
    wrap.addEventListener("mousedown", (e) => {
      const blockEl = e.target.closest && e.target.closest(".ed-block");
      if (!blockEl) return;
      // Only start drag when grabbing the bar's left side, not edits / buttons
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

  // -------- Inspector -------------------------------------------------------
  function renderInspector() {
    const insp = $("#inspector");
    insp.innerHTML = "";
    const block = state.blocks.find((b) => b.id === state.selectedId);
    if (!block) {
      insp.appendChild(el(`<div class="ed-insp__empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-10 10H4v-6z"/><path d="M14 4l3-3 6 6-3 3"/></svg>
        <p style="font-size:13px;">Click any block on the canvas to edit its properties.</p>
      </div>`));
      return;
    }
    const def = componentById(block.type);
    insp.appendChild(el(`<div>
      <h4 style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:4px;">${escHtml(def.label)}</h4>
      <p style="font-size:12px;color:var(--fg-muted);">${escHtml(def.sub)}</p>
    </div>`));

    for (const f of def.fields) {
      const id = `f_${block.id}_${f.key}`;
      const value = block.props[f.key] ?? "";
      let input;
      if (f.type === "textarea") {
        input = el(`<textarea id="${id}" data-insp-key="${f.key}" placeholder="${escAttr(f.placeholder || "")}">${escHtml(value)}</textarea>`);
      } else if (f.type === "color") {
        input = el(`<input id="${id}" type="color" data-insp-key="${f.key}" value="${escAttr(value)}" />`);
      } else if (f.type === "select") {
        const opts = (f.options || []).map(o => `<option value="${o}" ${value === o ? "selected" : ""}>${o}</option>`).join("");
        input = el(`<select id="${id}" data-insp-key="${f.key}">${opts}</select>`);
      } else {
        input = el(`<input id="${id}" type="${f.type}" data-insp-key="${f.key}" value="${escAttr(value)}" placeholder="${escAttr(f.placeholder || "")}" />`);
      }

      let pushed = false;
      input.addEventListener("focus", () => { pushed = false; });
      input.addEventListener("input", () => {
        if (!pushed) { pushHistory(); pushed = true; }
        block.props[f.key] = input.value;
        saveState();
        // Targeted re-render: replace just this block in the canvas to keep
        // focus inside the inspector input.
        replaceBlockInCanvas(block);
      });

      const field = el(f.type === "color"
        ? `<div class="ed-field ed-field--row"><label for="${id}">${escHtml(f.label)}</label></div>`
        : `<div class="ed-field"><label for="${id}">${escHtml(f.label)}</label></div>`);
      field.appendChild(input);
      insp.appendChild(field);
    }

    // --- Universal style fields ---
    insp.appendChild(el(`<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border,#ececf0);">
      <h4 style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-dim);margin:0 0 10px;">Style overrides</h4>
    </div>`));

    for (const sf of STYLE_FIELDS) {
      const id = `sf_${block.id}_${sf.key}`;
      const value = block.props[sf.key] ?? "";
      let input;
      if (sf.type === "color") {
        input = el(`<input id="${id}" type="color" data-insp-key="${sf.key}" value="${escAttr(value || '#ffffff')}" />`);
      } else if (sf.type === "select") {
        const opts = (sf.options || []).map(o => `<option value="${o}" ${value === o ? "selected" : ""}>${o}</option>`).join("");
        input = el(`<select id="${id}" data-insp-key="${sf.key}">${opts}</select>`);
      } else {
        input = el(`<input id="${id}" type="${sf.type}" data-insp-key="${sf.key}" value="${escAttr(value)}" placeholder="${escAttr(sf.placeholder || "")}" />`);
      }

      let pushed = false;
      input.addEventListener("focus", () => { pushed = false; });
      input.addEventListener("input", () => {
        if (!pushed) { pushHistory(); pushed = true; }
        block.props[sf.key] = input.value;
        saveState();
        applyStyleOverrides(block);
      });

      const field = el(sf.type === "color"
        ? `<div class="ed-field ed-field--row"><label for="${id}">${escHtml(sf.label)}</label></div>`
        : `<div class="ed-field"><label for="${id}">${escHtml(sf.label)}</label></div>`);
      field.appendChild(input);
      insp.appendChild(field);
    }
  }

  function applyStyleOverrides(block) {
    const node = document.querySelector(`.ed-block[data-id="${block.id}"]`);
    if (!node) return;
    const blk = node.querySelector(".blk") || node.querySelector("[class*='blk--']") || node.firstElementChild;
    if (!blk) return;
    const p = block.props;
    if (p._padding) blk.style.padding = p._padding + "px";
    else blk.style.removeProperty("padding");
    if (p._fontSize) blk.style.fontSize = p._fontSize + "px";
    else blk.style.removeProperty("font-size");
    if (p._textAlign) blk.style.textAlign = p._textAlign;
    else blk.style.removeProperty("text-align");
    if (p._bgColor && p._bgColor !== "#ffffff") blk.style.backgroundColor = p._bgColor;
    else blk.style.removeProperty("background-color");
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
    // Reattach selection click
    node.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      e.stopPropagation();
      state.selectedId = block.id;
      renderCanvas();
      renderInspector();
    });
  }

  // -------- Topbar actions --------------------------------------------------
  function wireTopbar() {
    $("#nameInput").value = state.name;
    $("#nameInput").addEventListener("change", (e) => {
      pushHistory();
      state.name = e.target.value || "Untitled site";
      saveState();
    });

    $("#undoBtn").addEventListener("click", undo);
    $("#redoBtn").addEventListener("click", redo);

    $$("[data-device]").forEach((b) => {
      b.addEventListener("click", () => {
        $$("[data-device]").forEach((x) => x.classList.toggle("is-on", x === b));
        $("#canvas").dataset.device = b.dataset.device;
      });
    });

    $("#previewBtn").addEventListener("click", openPreview);
    $("#closePreviewBtn").addEventListener("click", closePreview);

    $("#exportBtn").addEventListener("click", exportHtml);
    $("#clearBtn").addEventListener("click", () => {
      if (!confirm("Clear the canvas? This will remove all blocks.")) return;
      pushHistory();
      state.blocks = [];
      state.selectedId = null;
      afterStateChange("Canvas cleared");
    });

    document.addEventListener("keydown", (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((meta && e.key.toLowerCase() === "y") || (meta && e.shiftKey && e.key.toLowerCase() === "z")) { e.preventDefault(); redo(); }
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
        if (!state.selectedId) return;
        pushHistory();
        state.blocks = state.blocks.filter((b) => b.id !== state.selectedId);
        state.selectedId = null;
        afterStateChange("Block deleted");
      }
    });
  }

  // -------- Preview & export ------------------------------------------------
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
    // Apply style overrides as inline styles
    const p = block.props;
    if (p._padding) node.style.padding = p._padding + "px";
    if (p._fontSize) node.style.fontSize = p._fontSize + "px";
    if (p._textAlign) node.style.textAlign = p._textAlign;
    if (p._bgColor && p._bgColor !== "#ffffff") node.style.backgroundColor = p._bgColor;
    // Strip editor-only attributes
    node.querySelectorAll("[data-edit]").forEach((n) => n.removeAttribute("data-edit"));
    node.querySelectorAll("[contenteditable]").forEach((n) => n.removeAttribute("contenteditable"));
    return node.outerHTML;
  }

  function exportedCss() {
    // A trimmed, dependency-free stylesheet for exported pages.
    return `
      *,*::before,*::after{box-sizing:border-box}
      body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0b0d12;line-height:1.55;background:#fff}
      .blk{padding:64px 48px}
      @media (max-width:640px){.blk{padding:48px 22px}}
      .blk--hero{text-align:center;background:linear-gradient(180deg,#f6f8ff,#eef2ff);padding:96px 32px}
      .blk--hero h1{font-size:clamp(2rem,1.4rem + 2.5vw,3.4rem);font-weight:700;letter-spacing:-.02em;margin:0 0 14px;line-height:1.1}
      .blk--hero p{color:#4b5563;max-width:640px;margin:0 auto;font-size:17px}
      .blk--hero .ctas{display:inline-flex;gap:10px;margin-top:22px;flex-wrap:wrap;justify-content:center}
      .blk--hero .b1,.blk--hero .b2{padding:11px 18px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;border:1px solid transparent}
      .blk--hero .b1{background:var(--cta-color,#3a64ff);color:#fff}
      .blk--hero .b2{background:#fff;color:#0b0d12;border-color:#d4d8e3}
      .blk--heading h2{font-size:clamp(1.6rem,1.2rem + 1.5vw,2.2rem);font-weight:600;letter-spacing:-.02em;margin:0 0 8px}
      .blk--heading p{color:#4b5563}
      .blk--text p{color:#374151;line-height:1.65;font-size:16px;max-width:720px}
      .blk--button{text-align:center;padding:32px}
      .blk--button a{display:inline-block;padding:12px 22px;background:var(--cta-color,#3a64ff);color:#fff;border-radius:10px;font-weight:600;text-decoration:none;font-size:14px}
      .blk--features h2{text-align:center;font-size:28px;margin:0 0 32px}
      .blk--features .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
      @media (max-width:720px){.blk--features .grid{grid-template-columns:1fr}}
      .blk--features .feat{background:#f6f8ff;border:1px solid #e1e6f3;border-radius:14px;padding:22px}
      .blk--features .ic{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#3a64ff,#8b5cf6);margin-bottom:14px}
      .blk--features h3{font-size:16px;margin:0 0 6px}
      .blk--features p{font-size:14px;color:#4b5563}
      .blk--cta{text-align:center;background:linear-gradient(135deg,#0b0d12,#1f2347);color:#fff;padding:72px 32px}
      .blk--cta h2{color:#fff;font-size:32px;margin:0}
      .blk--cta p{color:#b7bcce;max-width:520px;margin:14px auto 0}
      .blk--cta a{display:inline-block;margin-top:22px;padding:12px 22px;background:#fff;color:#0b0d12;border-radius:10px;font-weight:600;text-decoration:none;font-size:14px}
      .blk--image .img{width:100%;aspect-ratio:16/9;border-radius:14px;background:linear-gradient(135deg,rgba(58,100,255,.25),rgba(139,92,246,.25));background-size:cover;background-position:center}
      .blk--columns .grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center}
      @media (max-width:720px){.blk--columns .grid{grid-template-columns:1fr}}
      .blk--columns h3{font-size:22px;margin:0 0 8px}
      .blk--columns p{color:#4b5563;line-height:1.65}
      .blk--columns .visual{aspect-ratio:4/3;border-radius:14px;background:linear-gradient(135deg,#3a64ff,#8b5cf6)}
      .blk--quote{text-align:center;padding:64px 32px;background:#fafbff}
      .blk--quote blockquote{font-size:22px;font-weight:500;max-width:640px;margin:0 auto;line-height:1.4}
      .blk--quote cite{display:block;margin-top:18px;color:#6b7280;font-style:normal;font-size:14px}
      .blk--footer{background:#0b0d12;color:#b7bcce;padding:40px 48px;text-align:center;font-size:13px}
      .blk--footer a{color:#fff}
      .blk--navbar{display:flex;align-items:center;justify-content:space-between;padding:16px 28px;background:#fff;border-bottom:1px solid #ececf0}
      .blk--navbar__brand{font-size:16px;font-weight:700;color:#0a0a0a}
      .blk--navbar__links{display:flex;gap:20px}
      .blk--navbar__links a{font-size:14px;color:#5b5b65;text-decoration:none;font-weight:500}
      .blk--navbar__cta{display:inline-block;padding:8px 14px;border-radius:8px;background:#7c3aed;color:#fff;font-size:13px;font-weight:600;text-decoration:none}
      .blk--form{padding:56px 40px;max-width:560px}
      .blk--form h2{font-size:22px;font-weight:700;margin:0 0 8px}
      .blk--form p{color:#5b5b65;margin:0 0 20px;font-size:14px}
      .blk--form form{display:grid;gap:14px}
      .blk--form__field{display:grid;gap:4px}
      .blk--form__field label{font-size:12px;font-weight:500;color:#1f1f23}
      .blk--form__field input,.blk--form__field textarea{font-family:inherit;font-size:14px;padding:10px 12px;border:1px solid #ececf0;border-radius:8px;background:#fff;color:#0a0a0a;outline:none}
      .blk--form__field textarea{min-height:80px;resize:vertical}
      .blk--form button[type=submit]{display:inline-block;padding:11px 20px;background:#7c3aed;color:#fff;border:0;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;font-family:inherit}
      .blk--gallery{padding:40px}
      .blk--gallery__cap{font-size:14px;color:#5b5b65;margin:0 0 14px;text-align:center}
      .blk--gallery__grid{display:grid;gap:10px}
      .blk--gallery__cell{aspect-ratio:1;border-radius:10px;background:linear-gradient(135deg,#faf5ff,#f3e8ff);border:1px solid #e9d5ff}
      .blk--spacer{display:block}
      .blk--divider{padding:16px 40px}
      .blk--divider hr{border:0;margin:0}
    `;
  }

  function openPreview() {
    const overlay = $("#preview");
    const frame = $("#previewFrame");
    frame.srcdoc = buildExportedHtml();
    overlay.classList.add("is-open");
  }
  function closePreview() {
    $("#preview").classList.remove("is-open");
  }

  function exportHtml() {
    if (state.blocks.length === 0) {
      toast("Nothing to export yet — drop a block onto the canvas first.");
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
    toast("Exported to .html — check your downloads");
  }

  // -------- Toast -----------------------------------------------------------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 1800);
  }

  // -------- Icons -----------------------------------------------------------
  function svgWrap(inner) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }
  function heroIcon(big) {
    const s = big ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">`;
    return s + `<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18M8 14h8"/></svg>`;
  }
  function headingIcon() { return svgWrap('<path d="M5 4v16M19 4v16M5 12h14"/>'); }
  function textIcon() { return svgWrap('<path d="M4 6h16M4 12h12M4 18h16"/>'); }
  function imageIcon() { return svgWrap('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-7 7"/>'); }
  function featuresIcon() { return svgWrap('<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="15" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/>'); }
  function columnsIcon() { return svgWrap('<rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/>'); }
  function quoteIcon() { return svgWrap('<path d="M7 7c-2 0-4 2-4 5v5h5v-5H5c0-1 1-2 2-2V7zm10 0c-2 0-4 2-4 5v5h5v-5h-3c0-1 1-2 2-2V7z"/>'); }
  function buttonIcon() { return svgWrap('<rect x="3" y="9" width="18" height="6" rx="3"/>'); }
  function ctaIcon() { return svgWrap('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M9 12h6M12 9l3 3-3 3"/>'); }
  function footerIcon() { return svgWrap('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16h18"/>'); }

  // -------- Boot ------------------------------------------------------------
  function boot() {
    renderPalette();
    wireCanvasDnD();
    wireTopbar();
    renderCanvas();
    renderInspector();
    updateUndoRedoButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
