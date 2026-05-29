/* =========================================================
   Altask v3.1 — Site interactions
   ========================================================= */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobile = document.querySelector("[data-nav-mobile]");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Sticky-nav state + top scroll progress bar
  const nav = document.querySelector(".site-nav");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);
  function onScroll() {
    const h = document.documentElement;
    const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + "%";
    if (nav) nav.classList.toggle("is-stuck", h.scrollTop > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal observer
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach((el) => el.classList.add("is-visible"));
  }

  // Tabs (Validate / Track / Optimize / Scale)
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    const tabs = root.querySelectorAll(".tab");
    const panels = document.querySelectorAll("[data-tab-panel]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        const id = tab.dataset.tabFor;
        panels.forEach((p) => {
          const match = p.dataset.tabPanel === id;
          p.hidden = !match;
          // re-trigger metric bar fill animation
          if (match) {
            p.classList.remove("is-visible");
            void p.offsetWidth;
            p.classList.add("is-visible");
          } else {
            p.classList.remove("is-visible");
          }
        });
      });
    });
    // initialize first panel as visible
    const first = root.parentElement.querySelector('[data-tab-panel]:not([hidden])');
    if (first) first.classList.add("is-visible");
  });

  // Pricing toggle
  document.querySelectorAll('[data-toggle="pricing"]').forEach((root) => {
    const buttons = root.querySelectorAll("button");
    const targets = document.querySelectorAll("[data-monthly], [data-yearly]");
    buttons.forEach((b) => {
      b.addEventListener("click", () => {
        buttons.forEach((x) => x.classList.toggle("is-on", x === b));
        const mode = b.dataset.mode || "monthly";
        targets.forEach((t) => {
          if (t.hasAttribute("data-monthly") && t.hasAttribute("data-yearly")) {
            t.textContent = mode === "yearly" ? t.dataset.yearly : t.dataset.monthly;
          }
        });
      });
    });
  });

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".site-nav__links a, .site-nav__mobile a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("is-active");
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach((y) => { y.textContent = String(new Date().getFullYear()); });

  // Animated counters [data-count="42"] data-suffix data-prefix
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduced && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || e.target.dataset.done) continue;
        e.target.dataset.done = "1";
        animateCount(e.target);
        cio.unobserve(e.target);
      }
    }, { threshold: 0.4 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = (el.dataset.prefix||"") + el.dataset.count + (el.dataset.suffix||""); });
  }
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const dur = 1400;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();


/* Submenu toggles (click + keyboard, in addition to CSS hover) */
(function () {
  document.querySelectorAll(".has-submenu").forEach((li) => {
    const trigger = li.querySelector(".submenu-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = li.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      // Close other submenus
      document.querySelectorAll(".has-submenu.is-open").forEach((other) => {
        if (other !== li) {
          other.classList.remove("is-open");
          const t = other.querySelector(".submenu-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".has-submenu.is-open").forEach((li) => {
      li.classList.remove("is-open");
      const t = li.querySelector(".submenu-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".has-submenu.is-open").forEach((li) => {
        li.classList.remove("is-open");
        const t = li.querySelector(".submenu-trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });
})();


/* Contact form: real submit with success/error states */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const successEl = form.querySelector("[data-success]");
  const errorEl = form.querySelector("[data-error]");
  const btn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Submit failed");
      form.reset();
      if (successEl) successEl.hidden = false;
    } catch (err) {
      if (errorEl) errorEl.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
})();


/* ============ Production animation engine ============ */
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  // Split headlines into words for staggered reveal
  document.querySelectorAll(".reveal-words").forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = "1";
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      const parts = node.nodeValue.split(/(\s+)/);
      parts.forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) {
          frag.appendChild(document.createTextNode(p));
        } else {
          const w = document.createElement("span");
          w.className = "word";
          const inner = document.createElement("span");
          inner.textContent = p;
          w.appendChild(inner);
          frag.appendChild(w);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.querySelectorAll(".word > span").forEach((s, i) => {
      s.style.transitionDelay = (i * 0.05) + "s";
    });
  });

  // Re-observe new reveal targets added by submenu changes
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(
      "[data-reveal-scale]:not(.is-visible),[data-reveal-left]:not(.is-visible),[data-reveal-right]:not(.is-visible),.reveal-words:not(.is-visible)"
    ).forEach((el) => io.observe(el));
  }

  // Cursor tracking on .card-hover for spotlight effect
  document.querySelectorAll(".card-hover").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });

  // Magnetic buttons (subtle attraction to cursor)
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.3;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  // Parallax on hero glow
  const heroBg = document.querySelector(".hero");
  if (heroBg) {
    let raf = 0;
    document.addEventListener("mousemove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroBg.style.setProperty("--parallax-x", x + "px");
        heroBg.style.setProperty("--parallax-y", y + "px");
        raf = 0;
      });
    });
  }

  /* ================================================================
     Reviews infinite marquee — duplicate children once for seamless
     loop. The CSS animates translateX from 0 to -50%.
     ================================================================ */
  document.querySelectorAll(".reviews__rail").forEach((rail) => {
    if (rail.dataset.cloned) return;
    const children = Array.from(rail.children);
    children.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      rail.appendChild(clone);
    });
    rail.dataset.cloned = "true";
  });
})();
