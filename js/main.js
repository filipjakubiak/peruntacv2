/* PERUN TAC - motion system
   Lenis smooth scroll + GSAP ScrollTrigger. Everything degrades:
   no JS → static page; reduced motion → instant reveals, native scroll. */

(function () {
  "use strict";

  var shotMode = /[?&]shot/.test(location.search); // static-render hook for visual QA
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || shotMode;
  if (shotMode) {
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.classList.add("shot");
    var cutMatch = location.search.match(/[?&]cut=(\d+)/);
    if (cutMatch) {
      var kids = document.querySelector("main").children;
      for (var k = 0; k < Math.min(parseInt(cutMatch[1], 10), kids.length); k++) kids[k].style.display = "none";
    }
  }
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var EN = (document.documentElement.lang || "pl").toLowerCase().indexOf("en") === 0;

  /* ---------- Loader ---------- */
  var loader = document.getElementById("loader");
  var loaderBar = document.getElementById("loaderBar");
  var loaderDone = false;

  function finishLoader() {
    if (loaderDone || !loader) return;
    loaderDone = true;
    if (loaderBar) loaderBar.style.transform = "scaleX(1)";
    setTimeout(function () {
      loader.classList.add("is-done");
      startHero();
    }, 250);
  }

  if (reduced || !loader) {
    if (loader) loader.remove();
    startHero();
  } else {
    // fake-but-honest progress: ramps while the hero image loads
    var p = 0;
    var ramp = setInterval(function () {
      p = Math.min(p + Math.random() * 18, 92);
      if (loaderBar) loaderBar.style.transform = "scaleX(" + p / 100 + ")";
      if (loaderDone) clearInterval(ramp);
    }, 140);
    window.addEventListener("load", finishLoader);
    setTimeout(finishLoader, 3200); // hard cap, never trap the user
  }

  /* ---------- Line reveals ---------- */
  // Arm masked reveals only with JS running; .is-live fires them.
  var revealGroups = document.querySelectorAll(".hero__title, .section-head__title, .mission__title, .motto__quote, .contact__title, .page-hero__title, .reveal-lines");

  function armReveals() {
    if (reduced || !hasGsap) return; // no ScrollTrigger → nothing would ever fire the reveal
    revealGroups.forEach(function (el) { el.classList.add("is-armed"); });
    var split = document.querySelector(".split"); // pre-hide split panels' content before entrance
    if (split) split.classList.add("is-armed");
  }

  function startHero() {
    var heroTitle = document.querySelector(".hero__title") || document.querySelector(".page-hero__title");
    if (heroTitle) heroTitle.classList.add("is-live");
    if (hasGsap && !reduced) {
      if (document.querySelector(".hero__media img")) {
        gsap.to(".hero__media img", { scale: 1, duration: 2.4, ease: "expo.out", delay: 0.1 });
        gsap.from(".hero__kicker, .hero__lead, .hero__cta, .hero__top", {
          opacity: 0, y: 24, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: 0.35, clearProps: "all"
        });
      }
      if (document.querySelector(".page-hero__media img")) {
        gsap.fromTo(".page-hero__media img", { scale: 1.12 }, { scale: 1, duration: 2.2, ease: "expo.out", delay: 0.1 });
        gsap.from(".page-hero__crumb, .page-hero__intro", {
          opacity: 0, y: 20, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.3, clearProps: "all"
        });
      }
      // split hero: panels wipe up, then their content settles in, staggered per panel
      var split = document.querySelector(".split");
      if (split) {
        var panels = gsap.utils.toArray(".split__panel");
        gsap.fromTo(panels, { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", stagger: 0.12 });
        gsap.fromTo(".split__media img", { scale: 1.16 }, { scale: 1.06, duration: 2.2, ease: "expo.out", delay: 0.15 });
        panels.forEach(function (panel, i) {
          gsap.to(panel.querySelectorAll(":scope > *:not(.split__media):not(.split__scrim):not(.split__glow)"), {
            opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.07,
            delay: 0.45 + i * 0.12, startAt: { y: 26 },
            onComplete: function () { split.classList.remove("is-armed"); }
          });
        });
      }
    }
  }

  armReveals();

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1.05 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // anchor links through lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        closeMenu();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      });
    });
  }

  /* ---------- Nav: solid after scroll, hide on scroll down ---------- */
  var nav = document.getElementById("nav");
  var lastY = 0;
  function onScrollNav() {
    var y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > 480 && y > lastY && !menuOpen);
    lastY = y;
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mmenu = document.getElementById("mobileMenu");
  var menuOpen = false;

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    burger.classList.remove("is-open");
    mmenu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    mmenu.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  burger.addEventListener("click", function () {
    menuOpen = !menuOpen;
    burger.classList.toggle("is-open", menuOpen);
    mmenu.classList.toggle("is-open", menuOpen);
    burger.setAttribute("aria-expanded", String(menuOpen));
    mmenu.setAttribute("aria-hidden", String(!menuOpen));
    burger.setAttribute("aria-label", menuOpen
      ? (EN ? "Close menu" : "Zamknij menu")
      : (EN ? "Open menu" : "Otwórz menu"));
    if (lenis) menuOpen ? lenis.stop() : lenis.start();
  });
  mmenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Crosshair cursor ---------- */
  var cursor = document.getElementById("cursor");
  if (finePointer && !reduced && cursor && hasGsap) {
    document.body.classList.add("has-cursor");
    if (typeof cursor.showPopover === "function") {
      // keep the crosshair in the top layer so it stays visible above
      // modal <dialog>s (showModal() renders above any z-index).
      // Guard: if showPopover fails, the UA rule [popover]:not(:popover-open)
      // would leave the element display:none (invisible cursor in some
      // browsers), so we strip the attribute and fall back to a plain
      // fixed element — still visible, just below modal dialogs.
      var liftCursor = function () {
        cursor.setAttribute("popover", "manual");
        try { cursor.hidePopover(); } catch (err) {}
        try { cursor.showPopover(); } catch (err) {}
        var ok = false;
        try { ok = cursor.matches(":popover-open"); } catch (err) { ok = false; }
        if (!ok) cursor.removeAttribute("popover");
      };
      liftCursor();
      // opening a modal dialog closes popovers and stacks above them,
      // re-promote whenever a dialog locks scroll
      document.addEventListener("pt:scroll-lock", function (e) {
        if (e.detail) liftCursor();
      });
    }
    var cx = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
    var cy = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });
    var cursorLive = false;
    window.addEventListener("mousemove", function (e) {
      if (!cursorLive) {
        // jump to the pointer without a lerp trail from its parked position,
        // then reveal — avoids a crosshair streaking in from the corner
        cursorLive = true;
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        cursor.classList.add("is-active");
      }
      cx(e.clientX); cy(e.clientY);
    });
    window.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && !e.toElement) cursor.classList.remove("is-active");
    });
    window.addEventListener("mouseover", function () {
      if (cursorLive) cursor.classList.add("is-active");
    });
    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced && hasGsap) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.28);
        yTo((e.clientY - r.top - r.height / 2) * 0.28);
      });
      el.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- Language switch: labels flicker-decode, then navigate ---------- */
  var langSwitch = document.getElementById("langSwitch");
  if (langSwitch) {
    langSwitch.addEventListener("click", function (e) {
      if (reduced) return; // plain link navigation
      var href = langSwitch.getAttribute("href");
      if (!href || langSwitch.dataset.busy) { e.preventDefault(); return; }
      e.preventDefault();
      langSwitch.dataset.busy = "1";
      var opts = langSwitch.querySelectorAll(".lang__opt");
      var glyphs = "AĄBCDEFGHIJKLMNOPQRSTUWVXYZ";
      var ticks = 0;
      var iv = setInterval(function () {
        opts.forEach(function (o) {
          o.textContent =
            glyphs[(Math.random() * glyphs.length) | 0] +
            glyphs[(Math.random() * glyphs.length) | 0];
        });
        if (++ticks >= 5) { clearInterval(iv); location.href = href; }
      }, 45);
    });
  }

  /* ---------- Scroll-driven animation ---------- */
  if (hasGsap && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    // fire masked line reveals when their block enters
    revealGroups.forEach(function (el) {
      if (el.classList.contains("is-live")) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () { el.classList.add("is-live"); }
      });
    });

    // hero: pinned cinematic exit - the moment holds, then settles into the marquee
    // (recoil management, not a hard cut: zoom continues, content fades, veil darkens)
    if (document.querySelector(".hero")) {
      gsap.timeline({
        scrollTrigger: { trigger: ".hero", start: "top top", end: "+=70%", scrub: 1, pin: true }
      })
        .fromTo(".hero__media img", { scale: 1 }, { scale: 1.24, ease: "none" }, 0)
        .to(".hero__content", { y: -60, opacity: 0, ease: "none" }, 0.05)
        .to(".hero__top", { opacity: 0, ease: "none" }, 0)
        .to(".hero__frame .tick", { opacity: 0, scale: 0.7, ease: "none" }, 0.1)
        .to(".hero__pin-veil", { opacity: 0.64, ease: "none" }, 0.15);
    }
    if (document.querySelector(".page-hero")) {
      gsap.to(".page-hero__media", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: ".page-hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    // mission photo parallax
    document.querySelectorAll("[data-parallax]").forEach(function (fig) {
      var amt = parseFloat(fig.getAttribute("data-parallax")) || 0;
      var img = fig.querySelector("img");
      gsap.fromTo(img, { yPercent: -amt }, {
        yPercent: amt,
        ease: "none",
        scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true }
      });
      gsap.set(img, { scale: 1 + Math.abs(amt) / 45 });
    });

    // front page flag: it borrows the Perun Security choreography for its own
    // components (offer rows, knowledge rows, IG grid) — home only, per brief
    var homePage = !!document.querySelector(".split");

    // offer rows (home): Security-style — the bg photo wipes up while it
    // de-zooms, then the copy settles line by line
    document.querySelectorAll(".offer__row").forEach(function (row) {
      var bg = row.querySelector(".offer__bg");
      var inner = row.querySelector(".offer__inner");
      var st = { trigger: row, start: "top 85%", once: true };
      if (bg) {
        var img = bg.querySelector("img");
        gsap.fromTo(bg, { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", scrollTrigger: st });
        // de-zoom lands on the stylesheet scale (1.06), then clearProps hands
        // the transform back to CSS so the :hover zoom keeps working
        if (img) gsap.fromTo(img, { scale: 1.2 },
          { scale: 1.06, clearProps: "transform", duration: 1.5, ease: "expo.out", scrollTrigger: st });
      }
      if (inner) {
        gsap.from(inner.children, {
          opacity: 0, y: 24, duration: 0.8, ease: "expo.out", stagger: 0.07,
          scrollTrigger: { trigger: row, start: "top 80%", once: true }
        });
      }
    });

    // knowledge rows: on home they log in from the margin like the Security
    // ledger; on baza-wiedzy they keep the original settle-up
    gsap.utils.toArray(".kb__row").forEach(function (row, i) {
      var fromVars = homePage
        ? { opacity: 0, x: -22, duration: 0.8, ease: "expo.out", delay: (i % 5) * 0.04 }
        : { opacity: 0, y: 28, duration: 0.9, ease: "expo.out", delay: (i % 5) * 0.04 };
      fromVars.scrollTrigger = { trigger: row, start: "top 92%", once: true };
      gsap.from(row, fromVars);
    });

    // IG grid (home): Security-style card entrances
    if (homePage) {
      gsap.utils.toArray(".ig__grid > *").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 26, scale: 0.97, duration: 0.85, ease: "expo.out", delay: (i % 4) * 0.05,
          scrollTrigger: { trigger: el, start: "top 92%", once: true }
        });
      });
    }

    // gallery: infinite drift strip, clones the set once for a seamless
    // xPercent(-50) wrap, then feeds scroll velocity into the loop's timeScale
    var pin = document.getElementById("galleryPin");
    var track = document.getElementById("galleryTrack");
    var countEl = document.getElementById("galleryCount");
    if (pin && track) {
      var setCount = track.children.length;
      var cloneFrag = document.createDocumentFragment();
      gsap.utils.toArray(track.children).forEach(function (fig) {
        var clone = fig.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        cloneFrag.appendChild(clone);
      });
      track.appendChild(cloneFrag);
      pin.classList.add("is-loop");

      var loop = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 46,
        repeat: -1,
        onUpdate: function () {
          if (!countEl) return;
          var idx = (Math.floor(loop.progress() * setCount) % setCount) + 1;
          countEl.textContent = String(idx).padStart(2, "0") + " / " + String(setCount).padStart(2, "0");
        }
      });

      // scroll down = surge forward, scroll up = pull back; settle to drift
      var surge = null;
      ScrollTrigger.create({
        trigger: pin,
        start: "top bottom",
        end: "bottom top",
        onToggle: function (self) { loop.paused(!self.isActive); },
        onUpdate: function (self) {
          var v = gsap.utils.clamp(-5, 5, self.getVelocity() / 350);
          if (Math.abs(v) < 0.3) return;
          if (surge) surge.kill();
          surge = gsap.timeline()
            .to(loop, { timeScale: 1 + v, duration: 0.2, ease: "power1.out" })
            .to(loop, { timeScale: 1, duration: 1.6, ease: "power2.out" }, "+=0.1");
        }
      });

      // strip settles in from the right on first approach
      gsap.from(track, {
        x: 140, opacity: 0, duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: pin, start: "top 82%", once: true }
      });
    }

    // motto: mark slowly rotates and breathes on scroll, the quote lines
    // drift apart at offset speeds (cheap depth), and the key word
    // underlines itself once the quote has been read
    if (document.querySelector("[data-rotate]")) {
      gsap.to("[data-rotate]", {
        rotation: 120,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: ".motto", start: "top bottom", end: "bottom top", scrub: true }
      });
    }
    var mottoQuote = document.querySelector(".motto__quote");
    if (mottoQuote) {
      gsap.utils.toArray(".motto__quote .line").forEach(function (ln, i) {
        var drift = 16 + i * 12;
        gsap.fromTo(ln, { y: drift }, {
          y: -drift,
          ease: "none",
          scrollTrigger: { trigger: ".motto", start: "top bottom", end: "bottom top", scrub: true }
        });
      });
      ScrollTrigger.create({
        trigger: mottoQuote,
        start: "top 70%",
        once: true,
        onEnter: function () { mottoQuote.classList.add("is-underlined"); }
      });
    }

    // kb rows (home): the divider under each row draws itself as the row logs in
    var kbListEl = document.getElementById("kbList");
    if (homePage && kbListEl) {
      kbListEl.classList.add("kb--draw");
      gsap.utils.toArray("#kbList .kb__row").forEach(function (row) {
        ScrollTrigger.create({
          trigger: row,
          start: "top 92%",
          once: true,
          onEnter: function () { row.classList.add("is-drawn"); }
        });
      });
    }

    // footer (home): headline creeps slower than the page (parallax), and the
    // mono strings — socials, coordinates — decode themselves on arrival
    function scrambleIn(el, dur) {
      var final = el.textContent;
      var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_";
      var state = { p: 0 };
      gsap.to(state, {
        p: 1,
        duration: dur || 0.9,
        ease: "power2.out",
        onUpdate: function () {
          var reveal = Math.floor(state.p * final.length);
          var out = final.slice(0, reveal);
          for (var i = reveal; i < final.length; i++) {
            out += final[i] === " " ? " " : glyphs[(Math.random() * glyphs.length) | 0];
          }
          el.textContent = out;
        },
        onComplete: function () { el.textContent = final; }
      });
    }
    if (homePage) {
      gsap.fromTo(".contact__head", { y: 90 }, {
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: true }
      });
      gsap.utils.toArray(".contact__socials a, .contact__bottom > *").forEach(function (el, i) {
        gsap.set(el, { opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 96%",
          once: true,
          onEnter: function () {
            gsap.to(el, { opacity: 1, duration: 0.25, delay: (i % 4) * 0.06 });
            scrambleIn(el, 0.7 + (i % 4) * 0.12);
          }
        });
      });
    }

    // On Perun Security we hand .mod / .modes__row to a richer, page-specific
    // sequence below, so exclude them from the generic handlers here.
    var secPage = document.body.classList.contains("theme-sec");

    // card/grid entrances: discrete units, so they settle with a touch of scale (not just fade-up)
    var cardSel = secPage
      ? ".modgrid__card, .kbcat__item, .faq__item, .dl a, .drill"
      : ".mod, .modgrid__card, .kbcat__item, .faq__item, .dl a, .drill";
    gsap.utils.toArray(cardSel).forEach(function (el, i) {
      gsap.from(el, {
        opacity: 0, y: 26, scale: 0.97, duration: 0.85, ease: "expo.out", delay: (i % 4) * 0.05,
        scrollTrigger: { trigger: el, start: "top 92%", once: true }
      });
    });

    // ledger rows (events, modes): slide in from the margin like an entry logging itself
    gsap.utils.toArray(secPage ? ".ev" : ".ev, .modes__row").forEach(function (el, i) {
      gsap.from(el, {
        opacity: 0, x: -22, duration: 0.8, ease: "expo.out", delay: (i % 5) * 0.04,
        scrollTrigger: { trigger: el, start: "top 92%", once: true }
      });
    });

    // ---------- Perun Security: page-specific choreography ----------
    if (secPage) {
      // service modules: the photo wipes up while its image de-zooms,
      // then the copy settles in line by line
      gsap.utils.toArray(".mod").forEach(function (mod) {
        var media = mod.querySelector(".mod__media");
        var text = mod.querySelector(".mod__text");
        var st = { trigger: mod, start: "top 82%", once: true };
        if (media) {
          var img = media.querySelector("img");
          gsap.fromTo(media, { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", scrollTrigger: st });
          if (img) gsap.fromTo(img, { scale: 1.2 },
            { scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger: st });
        }
        if (text) {
          gsap.from(text.children, {
            opacity: 0, y: 24, duration: 0.8, ease: "expo.out", stagger: 0.07,
            scrollTrigger: { trigger: mod, start: "top 78%", once: true }
          });
        }
      });

      // process steps: row settles, then its connector line draws toward the next
      gsap.set(".modes__index-line", { scaleY: 0 });
      gsap.utils.toArray(".modes__row").forEach(function (row) {
        var line = row.querySelector(".modes__index-line");
        var tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 84%", once: true } });
        tl.from(row, { opacity: 0, x: -22, duration: 0.7, ease: "expo.out" });
        if (line) tl.to(line, { scaleY: 1, duration: 0.55, ease: "power2.out" }, 0.25);
      });

      // reason band: doctrine stats pop in as a set
      gsap.from(".founder__stats > div", {
        opacity: 0, y: 16, duration: 0.6, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: ".founder__stats", start: "top 86%", once: true }
      });
    }

    // footer title creep
    gsap.from(".contact__channels, .contact__socials", {
      opacity: 0, y: 40, duration: 1.1, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: ".contact", start: "top 75%", once: true }
    });

    ScrollTrigger.refresh();

    // Hash deep-links (oferta.html#taktyczne, en/index.html#contact…) land
    // mid-page. once-triggers already inside/past their range never fire —
    // onEnter is forward-only — so everything above the anchor would stay
    // unrevealed. Catch those triggers up to their finished state, both now
    // and after load (browsers re-anchor to the hash once images arrive).
    function catchUpPassedTriggers() {
      if (!location.hash && window.scrollY === 0) return;
      ScrollTrigger.getAll().forEach(function (st) {
        if (!st.vars.once || st.progress <= 0) return;
        if (st.vars.onEnter) st.vars.onEnter(st);
        if (st.animation) st.animation.progress(1);
        st.kill();
      });
    }
    catchUpPassedTriggers();
    window.addEventListener("load", function () {
      setTimeout(catchUpPassedTriggers, 120); // after ScrollTrigger's own load refresh
    });
  } else {
    // no GSAP / reduced motion: everything visible immediately
    revealGroups.forEach(function (el) { el.classList.remove("is-armed"); });
  }

  /* ---------- Scroll lock hook (booking dialog etc.) ---------- */
  document.addEventListener("pt:scroll-lock", function (e) {
    if (!lenis) return;
    e.detail ? lenis.stop() : lenis.start();
  });

  /* ---------- Contact form → structured email ---------- */
  var mailForm = document.querySelector("[data-mailto-form]");
  if (mailForm) {
    mailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!mailForm.reportValidity()) return;
      var fd = new FormData(mailForm);
      var body = "";
      fd.forEach(function (v, k) {
        if (k === "_subject") return;
        body += k.toUpperCase() + ": " + v + "\n";
      });
      var subject = fd.get("_subject") || (EN ? "Message from peruntac.pl" : "Wiadomość ze strony peruntac.pl");
      location.href = "mailto:info@peruntac.pl?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var sent = document.querySelector("[data-mailto-sent]");
      if (sent) sent.classList.add("is-on");
    });
  }

  /* ---------- Knowledge base: floating thumbnail ---------- */
  var kbThumb = document.getElementById("kbThumb");
  var kbImg = kbThumb ? kbThumb.querySelector("img") : null;
  if (finePointer && !reduced && kbThumb && hasGsap) {
    var tx = gsap.quickTo(kbThumb, "x", { duration: 0.5, ease: "power3.out" });
    var ty = gsap.quickTo(kbThumb, "y", { duration: 0.5, ease: "power3.out" });
    document.querySelectorAll(".kb__row").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        kbImg.src = row.getAttribute("data-thumb");
        kbThumb.classList.add("is-on");
      });
      row.addEventListener("mouseleave", function () { kbThumb.classList.remove("is-on"); });
      row.addEventListener("mousemove", function (e) { tx(e.clientX + 40); ty(e.clientY); });
    });
  }
})();
