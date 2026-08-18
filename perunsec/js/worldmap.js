/* PERUN SEC - renders the global-reach map from window.PERUN_MAP (js/mapdata.js)
   and cross-links the marker dots with the country list underneath, so the map
   works both ways: hover a dot to name it, hover a name to find it. The dot
   list is the accessible source of truth - the SVG itself is decorative. */
(function () {
  "use strict";

  var host = document.getElementById("secMap");
  if (!host || !window.PERUN_MAP) return;

  var DATA = window.PERUN_MAP;
  var EN = (document.documentElement.lang || "en").toLowerCase().indexOf("pl") !== 0;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    /[?&]shot/.test(location.search);

  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 " + DATA.W + " " + DATA.H);
  svg.setAttribute("class", "secmap__svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  var land = document.createElementNS(svgNS, "path");
  land.setAttribute("d", DATA.land);
  land.setAttribute("class", "secmap__land");
  svg.appendChild(land);

  var dots = [];
  DATA.points.forEach(function (p, i) {
    var g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "secmap__dot");
    g.setAttribute("data-i", i);

    var halo = document.createElementNS(svgNS, "circle");
    halo.setAttribute("cx", p.x); halo.setAttribute("cy", p.y);
    halo.setAttribute("r", 4);
    halo.setAttribute("class", "secmap__halo");
    if (!reduced) halo.style.animationDelay = (i * 260) + "ms";

    var core = document.createElementNS(svgNS, "circle");
    core.setAttribute("cx", p.x); core.setAttribute("cy", p.y);
    core.setAttribute("r", 3.4);
    core.setAttribute("class", "secmap__core");

    g.appendChild(halo);
    g.appendChild(core);
    svg.appendChild(g);
    dots.push(g);
  });

  var figure = document.createElement("figure");
  figure.className = "secmap__figure";
  figure.appendChild(svg);

  /* Tooltip: pops out of the hovered dot. Positioned from the circle's real
     bounding box rather than the viewBox coordinates, so it stays glued to the
     dot at any responsive scale. */
  var tip = document.createElement("div");
  tip.className = "secmap__tip";
  tip.setAttribute("aria-hidden", "true");
  figure.appendChild(tip);

  function showTip(i) {
    var p = DATA.points[i];
    var core = dots[i] && dots[i].querySelector(".secmap__core");
    if (!p || !core) return;
    var cr = core.getBoundingClientRect();
    var fr = figure.getBoundingClientRect();
    tip.textContent = EN ? p.en : p.pl;
    tip.style.left = (cr.left + cr.width / 2 - fr.left) + "px";
    tip.style.top = (cr.top + cr.height / 2 - fr.top) + "px";
    tip.classList.add("is-on");
  }
  function hideTip() { tip.classList.remove("is-on"); }

  /* Faint blue glow that follows the pointer, map section only. */
  figure.addEventListener("pointermove", function (e) {
    var r = figure.getBoundingClientRect();
    figure.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    figure.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    figure.classList.add("is-live");
  });
  figure.addEventListener("pointerleave", function () { figure.classList.remove("is-live"); });

  var list = document.createElement("ul");
  list.className = "secmap__list";
  var items = [];
  DATA.points.forEach(function (p, i) {
    var li = document.createElement("li");
    li.className = "secmap__item mono";
    li.textContent = EN ? p.en : p.pl;
    li.setAttribute("data-i", i);
    list.appendChild(li);
    items.push(li);
  });

  host.appendChild(figure);
  host.appendChild(list);

  function setActive(i, on) {
    if (dots[i]) dots[i].classList.toggle("is-active", on);
    if (items[i]) items[i].classList.toggle("is-active", on);
    if (on) showTip(i); else hideTip();
  }

  list.addEventListener("mouseover", function (e) {
    var li = e.target.closest("[data-i]");
    if (li) setActive(+li.getAttribute("data-i"), true);
  });
  list.addEventListener("mouseout", function (e) {
    var li = e.target.closest("[data-i]");
    if (li) setActive(+li.getAttribute("data-i"), false);
  });
  svg.addEventListener("mouseover", function (e) {
    var g = e.target.closest(".secmap__dot");
    if (g) setActive(+g.getAttribute("data-i"), true);
  });
  svg.addEventListener("mouseout", function (e) {
    var g = e.target.closest(".secmap__dot");
    if (g) setActive(+g.getAttribute("data-i"), false);
  });
})();
