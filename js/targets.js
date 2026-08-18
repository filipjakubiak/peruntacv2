/* PERUN TAC - "Cele do druku": full target library rendered client-side
   (same one-source-of-truth pattern as js/booking.js's EVENTS/EVENTS_EN),
   with category filter pills and a dialog lightbox for a bigger preview,
   description and download link. Nothing here redirects to peruntac.pl/
   cele-strzeleckie - every target is downloadable straight from this grid.

   PDF targets ship with no source photo, so their card and the dialog both
   fall back to a mono rings glyph instead of a fabricated product shot. */
(function () {
  "use strict";

  var grid = document.getElementById("tgrid");
  var filterBar = document.getElementById("tfilter");
  var dlg = document.getElementById("tgtDialog");
  if (!grid || !dlg) return;

  var EN = (document.documentElement.lang || "pl").toLowerCase().indexOf("en") === 0;
  var LIB = "https://peruntac.pl/lib/v7viiv/";

  var CATS = EN
    ? { all: "All", moa: "1 MOA", tbox: "T-box", ipsc: "IPSC", idpa: "IDPA", spec: "Specialty", sylw: "Silhouette" }
    : { all: "Wszystkie", moa: "1 MOA", tbox: "T-box", ipsc: "IPSC", idpa: "IDPA", spec: "Specjalistyczne", sylw: "Sylwetkowy" };
  var CAT_ORDER = ["all", "moa", "tbox", "ipsc", "idpa", "spec", "sylw"];
  var DOWNLOAD_LABEL = EN ? "Download file" : "Pobierz plik";

  /* ---------- Base data (PL) ---------- */

  var TARGETS = [
    { id: "moa-1", title: "Tarcza 1 MOA", type: "PDF", category: "moa",
      desc: "Uniwersalna tarcza precyzyjna 1 MOA do zerowania i treningu grupowania.",
      file: LIB + "100-mnd472vr.pdf" },
    { id: "moa-100", title: "100 m - 1 MOA", type: "PDF", category: "moa",
      desc: "Tarcza precyzyjna do zerowania i treningu grupowania na dystansie 100 m.",
      file: LIB + "100m-1-moa-target--mnd4blv6.pdf" },
    { id: "moa-200", title: "200 m - 1 MOA", type: "PDF", category: "moa",
      desc: "Tarcza 1 MOA do treningu precyzji na dystansie 200 m.",
      file: LIB + "200m-1-moa-target---mnd4cd4v.pdf" },
    { id: "moa-300", title: "300 m - 1 MOA", type: "PDF", category: "moa",
      desc: "Tarcza 1 MOA do treningu precyzji na dystansie 300 m.",
      file: LIB + "300m-1-moa-target--mnd4fedg.pdf" },
    { id: "moa-400", title: "400 m - 1 MOA", type: "PDF", category: "moa",
      desc: "Tarcza 1 MOA do treningu precyzji na dystansie 400 m.",
      file: LIB + "400-m-1-moa-target--mnd4fzux.pdf" },
    { id: "moa-500", title: "500 m - 1 MOA", type: "PDF", category: "moa",
      desc: "Tarcza 1 MOA do treningu precyzji na dystansie 500 m.",
      file: LIB + "500m-1-moa-target--mnd4h2d4.pdf" }
  ];

  var TBOX_DESC = "Tarcza diagnostyczna z serii T-box do pracy nad precyzją i grupowaniem.";
  var TBOX_FILES = {
    F1F: "Tbox-F1F-ml11of7j.jpg", F1S: "Tbox-F1S-ml11omku.jpg",
    F2F: "Tbox-F2F-ml11otao.jpg", F2S: "Tbox-F2S-ml11p0ay.jpg",
    F3F: "Tbox-F3F-ml11p6y8.jpg", F3S: "Tbox-F3S-ml11pdq1.jpg",
    M1F: "Tbox-M1F_-ml11pkgn.jpg", M1S: "Tbox-M1S-ml11prrl.jpg",
    M2F: "Tbox-M2F-ml11pyny.jpg", M2S: "Tbox-M2S-ml11q5rw.jpg",
    M3F: "Tbox-M3F-ml11qd1r.jpg", M3S: "Tbox-M3S-ml11qk96.jpg",
    M4F: "Tbox-M4F-ml11qrrl.jpg", M4S: "Tbox-M4S-ml11qzi5.jpg",
    M5F: "Tbox-M5F-ml11r5ze.jpg", M5S: "Tbox-M5S-ml11rckz.jpg",
    M6F: "Tbox-M6F-ml11riuq.jpg", M6S: "Tbox-M6S-ml11rp8v.jpg"
  };
  for (var code in TBOX_FILES) {
    var tf = LIB + TBOX_FILES[code];
    TARGETS.push({ id: "tbox-" + code.toLowerCase(), title: "T-box " + code, type: "JPG", category: "tbox", desc: TBOX_DESC, file: tf, img: tf });
  }

  var IPSC_DESC = "Sylwetka IPSC w skali {pct}% do treningu na symulowanym dystansie.";
  var IPSC_FILES = { 5: "IPSC-5-mb6kb0au.jpg", 10: "IPSC-10-mb6kb7b7.jpg", 20: "IPSC-20-mb6kbdyq.jpg", 25: "IPSC-25-mb6kbqdi.jpg", 45: "IPSC-45-mb6kc2j2.jpg" };
  TARGETS.push({ id: "ipsc-set", title: "Zestaw IPSC", type: "JPG", category: "ipsc",
    desc: "Zestaw sylwetek 25/20/10 cm do dynamicznych strzelań.", file: LIB + "IPSC-ZESTAW-25-20-10-mb6kbwd7.jpg", img: LIB + "IPSC-ZESTAW-25-20-10-mb6kbwd7.jpg" });
  for (var pct in IPSC_FILES) {
    var pf = LIB + IPSC_FILES[pct];
    TARGETS.push({ id: "ipsc-" + pct, title: "Cel IPSC " + pct + "%", type: "JPG", category: "ipsc", desc: IPSC_DESC.replace("{pct}", pct), file: pf, img: pf });
  }

  var IDPA_DESC = "Sylwetka IDPA w skali {ratio} do treningu na symulowanym dystansie.";
  var IDPA_FILES = { "1:10": "IDPA-1-10--kk2k65a4.png", "1:5": "IDPA-15-kk2k520k.png", "1:4": "IDPA-14-kk2k52xl.png", "1:3": "IDPA-13--kk2kwx7y.png", "1:2": "IDPA-12--kk2k57px.png", "1:1": "IDPA-11--kk2k6qtm.png" };
  TARGETS.push({ id: "idpa-alfa", title: "Cel Alfa IDPA/PIRO", type: "PNG", category: "idpa",
    desc: "Strefa trafień Alfa do tarcz IDPA i systemu PIRO.", file: LIB + "Alfa-IDPA-llxsel6a.png", img: LIB + "Alfa-IDPA-llxsel6a.png" });
  for (var ratio in IDPA_FILES) {
    var rf = LIB + IDPA_FILES[ratio];
    TARGETS.push({ id: "idpa-" + ratio.replace(":", ""), title: "Cel IDPA " + ratio, type: "PNG", category: "idpa", desc: IDPA_DESC.replace("{ratio}", ratio), file: rf, img: rf });
  }

  TARGETS.push(
    { id: "spec-linie", title: "Cel Linie Prawdy", type: "JPG", category: "spec",
      desc: "Cel do pracy na spuście, trigger work i kontrola odrzutu.", file: LIB + "Tarcza-linie-prawdy--Trigger-work-mij11stg.jpg", img: LIB + "Tarcza-linie-prawdy--Trigger-work-mij11stg.jpg" },
    { id: "spec-dziura", title: "Cel Czarna Dziura", type: "JPG", category: "spec",
      desc: "Cel treningowy z 20-centymetrową kropką do pracy nad precyzyjnym trafieniem.", file: LIB + "Czarna-kropka-20cm-mb6kljfu.jpg", img: LIB + "Czarna-kropka-20cm-mb6kljfu.jpg" },
    { id: "spec-mrds25", title: "Cel MRDS Zero 25", type: "JPG", category: "spec",
      desc: "Cel do zerowania kolimatora (MRDS) na dystansie 25 m.", file: LIB + "MRDS-ZERO-25-ldd9yo8r.jpg", img: LIB + "MRDS-ZERO-25-ldd9yo8r.jpg" },
    { id: "spec-statki", title: "Cel Statki (gra)", type: "JPG", category: "spec",
      desc: "Gra strzelecka do treningu szybkości i celności.", file: LIB + "Statki-kiqk0qbq.jpg", img: LIB + "Statki-kiqk0qbq.jpg" },
    { id: "spec-zero", title: "Cel Zero", type: "JPG", category: "spec",
      desc: "Prosty cel do szybkiego sprawdzenia zera broni.", file: LIB + "ZERO-kiqar7so.jpg", img: LIB + "ZERO-kiqar7so.jpg" },
    { id: "spec-x", title: "Cel X", type: "JPG", category: "spec",
      desc: "Cel z oznaczeniem X do treningu precyzji i grupowania.", file: LIB + "X-kiqaqsjq.jpg", img: LIB + "X-kiqaqsjq.jpg" },
    { id: "spec-dots", title: "Cel Wielokropek", type: "JPG", category: "spec",
      desc: "Cel z wieloma punktami celowniczymi do treningu przejść między celami.", file: LIB + "DOTS-kiqaqnjk.jpg", img: LIB + "DOTS-kiqaqnjk.jpg" },
    { id: "spec-snowman", title: "Cel Bałwanek", type: "JPG", category: "spec",
      desc: "Nietypowy cel treningowy do urozmaicenia sesji strzeleckiej.", file: LIB + "SNOWMAN-kiqaqxae.jpg", img: LIB + "SNOWMAN-kiqaqxae.jpg" },
    { id: "sylw-1", title: "Cel Sylwetkowy", type: "PNG", category: "sylw",
      desc: "Uniwersalna tarcza sylwetkowa Perun Tac do treningu ogólnego.", file: LIB + "CEL-perun-kw3vti5c.png", img: LIB + "CEL-perun-kw3vti5c.png" }
  );

  /* ---------- EN overlay (title/desc only - file/img/category/type unchanged) ---------- */

  if (EN) {
    var EN_TBOX_DESC = "A T-box diagnostic target for precision and grouping work.";
    var EN_IPSC_DESC = "An IPSC silhouette at {pct}% scale for training at a simulated distance.";
    var EN_IDPA_DESC = "An IDPA silhouette at {ratio} scale for training at a simulated distance.";
    var EN_TEXT = {
      "moa-1": { title: "1 MOA target", desc: "A universal 1 MOA precision target for zeroing and group-size training." },
      "moa-100": { title: "100 m - 1 MOA", desc: "A precision target for zeroing and group-size training at 100 m." },
      "moa-200": { title: "200 m - 1 MOA", desc: "A 1 MOA target for precision training at 200 m." },
      "moa-300": { title: "300 m - 1 MOA", desc: "A 1 MOA target for precision training at 300 m." },
      "moa-400": { title: "400 m - 1 MOA", desc: "A 1 MOA target for precision training at 400 m." },
      "moa-500": { title: "500 m - 1 MOA", desc: "A 1 MOA target for precision training at 500 m." },
      "ipsc-set": { title: "IPSC set", desc: "A 25/20/10 cm silhouette set for dynamic shooting drills." },
      "idpa-alfa": { title: "IDPA/PIRO Alfa target", desc: "The Alfa scoring zone for IDPA targets and the PIRO system." },
      "spec-linie": { title: "Lines of Truth target", desc: "A trigger-work target for recoil control and trigger discipline." },
      "spec-dziura": { title: "Black Hole target", desc: "A training target with a 20 cm dot for precise-hit work." },
      "spec-mrds25": { title: "MRDS Zero 25 target", desc: "A target for zeroing a mini red dot sight (MRDS) at 25 m." },
      "spec-statki": { title: "Battleships target (game)", desc: "A shooting game target for speed and accuracy training." },
      "spec-zero": { title: "Zero target", desc: "A simple target for a quick zero check." },
      "spec-x": { title: "X target", desc: "An X-marked target for precision and grouping training." },
      "spec-dots": { title: "Multi-dot target", desc: "A target with multiple aim points for target-transition training." },
      "spec-snowman": { title: "Snowman target", desc: "A playful target to mix up a training session." },
      "sylw-1": { title: "Silhouette target", desc: "A universal Perun Tac silhouette target for general training." }
    };
    TARGETS.forEach(function (t) {
      if (EN_TEXT[t.id]) { t.title = EN_TEXT[t.id].title; t.desc = EN_TEXT[t.id].desc; }
      else if (t.category === "tbox") { t.desc = EN_TBOX_DESC; }
      else if (t.category === "ipsc") { var pct = t.title.match(/(\d+)%/); if (pct) t.desc = EN_IPSC_DESC.replace("{pct}", pct[1]); }
      else if (t.category === "idpa") { var ratio = t.title.match(/(\d+:\d+)/); if (ratio) { t.desc = EN_IDPA_DESC.replace("{ratio}", ratio[1]); t.title = "IDPA target " + ratio[1]; } }
    });
  }

  /* ---------- Render: filter pills + grid ---------- */

  function ringThumb(title) {
    var span = document.createElement("span");
    span.className = "tgrid__thumb tgrid__thumb--ring";
    span.setAttribute("aria-hidden", "true");
    var em = document.createElement("em");
    em.textContent = title;
    span.appendChild(em);
    return span;
  }

  function buildCard(t) {
    var btn = document.createElement("button");
    btn.className = "tgrid__item";
    btn.type = "button";
    btn.dataset.id = t.id;
    btn.dataset.category = t.category;

    if (t.img) {
      var thumb = document.createElement("span");
      thumb.className = "tgrid__thumb";
      var img = document.createElement("img");
      img.src = t.img;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
      btn.appendChild(thumb);
    } else {
      btn.appendChild(ringThumb(t.title));
    }

    var body = document.createElement("span");
    body.className = "tgrid__body";
    var name = document.createElement("span");
    name.className = "tgrid__name";
    name.textContent = t.title;
    var type = document.createElement("span");
    type.className = "tgrid__type mono";
    type.textContent = t.type;
    body.appendChild(name);
    body.appendChild(type);
    btn.appendChild(body);

    return btn;
  }

  TARGETS.forEach(function (t) { grid.appendChild(buildCard(t)); });

  if (filterBar) {
    var active = "all";
    CAT_ORDER.forEach(function (key) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = CATS[key];
      b.dataset.cat = key;
      if (key === "all") b.classList.add("is-active");
      filterBar.appendChild(b);
    });
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-cat]");
      if (!b) return;
      active = b.dataset.cat;
      filterBar.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-active", x === b); });
      grid.querySelectorAll(".tgrid__item").forEach(function (card) {
        card.classList.toggle("is-hidden", active !== "all" && card.dataset.category !== active);
      });
    });
  }

  /* ---------- Dialog lightbox ---------- */

  var media = document.getElementById("tgtMedia");
  var typeEl = document.getElementById("tgtType");
  var titleEl = document.getElementById("tgtTitle");
  var descEl = document.getElementById("tgtDesc");
  var dlBtn = document.getElementById("tgtDownload");

  function lockScroll(on) {
    document.dispatchEvent(new CustomEvent("pt:scroll-lock", { detail: on }));
  }

  function open(t) {
    titleEl.textContent = t.title;
    descEl.textContent = t.desc;
    typeEl.textContent = t.type;
    dlBtn.href = t.file;
    dlBtn.textContent = DOWNLOAD_LABEL + " (" + t.type + ") ↓";

    media.innerHTML = "";
    if (t.img) {
      var img = document.createElement("img");
      img.src = t.img;
      img.alt = "";
      media.appendChild(img);
    } else {
      media.appendChild(ringThumb(t.title));
    }

    dlg.showModal();
    dlg.scrollTop = 0;
    lockScroll(true);
  }

  function close() { dlg.close(); }

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-id]");
    if (!btn) return;
    var t = TARGETS.filter(function (x) { return x.id === btn.dataset.id; })[0];
    if (t) open(t);
  });

  dlg.addEventListener("close", function () { lockScroll(false); });
  document.getElementById("tgtClose").addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dlg.open) close();
  });
  dlg.addEventListener("click", function (e) {
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
  });
})();
