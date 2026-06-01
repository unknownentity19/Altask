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

  // Sticky-nav state
  const nav = document.querySelector(".site-nav");
  function onScroll() {
    const h = document.documentElement;
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
     Infinite marquee — pixel-perfect seamless loop.
     Clone items enough times so there's never blank space,
     then scroll by exactly one set-width for a seamless reset.
     ================================================================ */

  let marqueeId = 0;

  function initMarquee(track, gapPx, speed) {
    if (!track || track.dataset.cloned) return;

    const items = Array.from(track.children);
    if (items.length === 0) return;

    // Measure one full set width (all original items + their gaps)
    let setWidth = 0;
    items.forEach((item) => {
      setWidth += item.offsetWidth + gapPx;
    });

    // Clone sets until total width > viewport + one setWidth
    // This guarantees no blank space is ever visible
    const viewportW = window.innerWidth;
    const minWidth = viewportW + setWidth;
    let currentWidth = setWidth;

    while (currentWidth < minWidth) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      currentWidth += setWidth;
    }

    track.dataset.cloned = "true";

    // Inject a unique @keyframes that scrolls exactly one set width
    const id = "marquee-" + (marqueeId++);
    const style = document.createElement("style");
    style.textContent =
      "@keyframes " + id +
      " { from { transform: translate3d(0,0,0); }" +
      " to { transform: translate3d(-" + setWidth + "px,0,0); } }";
    document.head.appendChild(style);

    // Duration based on speed (px/s) so both marquees feel consistent
    const dur = setWidth / speed;
    track.style.animation = id + " " + dur + "s linear infinite";
  }

  // Reviews: 30px/s
  document.querySelectorAll(".reviews__rail").forEach((rail) => {
    initMarquee(rail, 20, 30);
  });

  // Logos: 35px/s
  document.querySelectorAll(".logos-marquee__track").forEach((track) => {
    initMarquee(track, 56, 35);
  });
})();


/* ============ Live user avatar cycling ============ */
(function () {
  const pile = document.getElementById("hero-avpile");
  const countEl = document.getElementById("hero-user-count");
  if (!pile || !countEl) return;

  const portraits = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
    "https://randomuser.me/api/portraits/men/52.jpg",
    "https://randomuser.me/api/portraits/women/85.jpg",
    "https://randomuser.me/api/portraits/men/14.jpg",
    "https://randomuser.me/api/portraits/women/30.jpg",
    "https://randomuser.me/api/portraits/men/72.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/25.jpg",
    "https://randomuser.me/api/portraits/women/49.jpg",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://randomuser.me/api/portraits/women/63.jpg",
    "https://randomuser.me/api/portraits/men/61.jpg",
    "https://randomuser.me/api/portraits/women/17.jpg",
    "https://randomuser.me/api/portraits/men/83.jpg",
  ];

  // Track which portraits are currently visible
  let activeSet = new Set(
    Array.from(pile.querySelectorAll(".av")).map((img) => img.src)
  );
  let userCount = 2847;
  let cycling = false;

  // Kick-start: reveal the initially-hidden 4th avatar after a beat
  setTimeout(() => {
    const entering = pile.querySelector(".av--entering");
    if (entering) {
      entering.classList.add("av--show");
      setTimeout(() => {
        entering.classList.remove("av--entering", "av--show");
      }, 800);
    }
  }, 1200);

  function getRandomNew() {
    const available = portraits.filter((p) => !activeSet.has(p));
    if (available.length === 0) return portraits[Math.floor(Math.random() * portraits.length)];
    return available[Math.floor(Math.random() * available.length)];
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src);
      img.src = src;
    });
  }

  async function cycle() {
    if (cycling) return;
    cycling = true;

    const avatars = Array.from(pile.querySelectorAll(".av"));
    if (avatars.length === 0) { cycling = false; return; }

    // Pick a random avatar to swap
    const idx = Math.floor(Math.random() * avatars.length);
    const target = avatars[idx];
    const oldSrc = target.src;

    // Preload the new image first
    const newSrc = getRandomNew();
    await preloadImage(newSrc);

    // Step 1: Animate out (700ms)
    target.classList.add("av--leaving");

    await new Promise((r) => setTimeout(r, 750));

    // Step 2: Swap image while hidden
    activeSet.delete(oldSrc);
    activeSet.add(newSrc);
    target.src = newSrc;
    target.classList.remove("av--leaving");
    target.classList.add("av--entering");

    // Step 3: Force reflow, then animate in
    void target.offsetWidth;
    await new Promise((r) => setTimeout(r, 50));

    // For first avatar, override margin to 0
    if (idx === 0) target.style.marginLeft = "0";
    target.classList.add("av--show");

    // Step 4: Wait for enter animation to finish (700ms)
    await new Promise((r) => setTimeout(r, 800));

    target.classList.remove("av--entering", "av--show");
    if (idx === 0) target.style.marginLeft = "";

    // Gently fluctuate the user count
    const delta = Math.floor(Math.random() * 7) - 2;
    userCount = Math.max(2800, Math.min(2900, userCount + delta));
    countEl.textContent = userCount.toLocaleString();

    cycling = false;
  }

  // Cycle every 5 seconds for a relaxed, natural feel
  setInterval(cycle, 5000);
})();
