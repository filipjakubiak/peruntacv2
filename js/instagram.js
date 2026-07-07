/* PERUN TAC — sekcja Instagram
   ----------------------------------------------------------------------------
   FAZA 1 (teraz): kuratorowany grid. Ostatnie posty trzymamy w tablicy PT_IG
   poniżej — podmieniasz obraz/podpis/link ręcznie po nowym poście.

   FAZA 2 (API): usuń dane statyczne i pobierz ostatnie posty. Instagram Basic
   Display API został wyłączony (12.2024), więc na stronie statycznej użyj albo
   usługi-widgetu trzymającej token (Behold / EmbedSocial / SnapWidget), albo
   endpointu serverless z Instagram Graph API. Docelowo funkcja renderIG() nie
   zmienia się — wystarczy podać jej tablicę { img, alt, caption, likes,
   comments, url } zamiast PT_IG. Szkielet fetchu zostawiony na dole (fetchIG). */

(function () {
  "use strict";

  var grid = document.getElementById("igGrid");
  if (!grid) return;

  /* ---- Kuratorowane posty (placeholder — podmień na realne) ---- */
  var PT_IG = [
    { img: "assets/hero-4.jpg", alt: "Trening karabinkowy na strzelnicy Perun Tac",
      caption: "Otwarty trening: karabinek na dystansie. Powtarzalność ponad wszystko. 🎯",
      likes: 412, comments: 18, url: "https://www.instagram.com/perun_tac/" },
    { img: "assets/hero-2.jpg", alt: "Nocne szkolenie strzeleckie przy świetle latarek",
      caption: "Low-light. Praca z latarką i noktowizją — noc nie wybacza skrótów.",
      likes: 537, comments: 24, url: "https://www.instagram.com/perun_tac/" },
    { img: "assets/hero-1.jpg", alt: "Praca zespołowa podczas wejścia do pomieszczeń (CQB)",
      caption: "CQB. Kąty, komunikacja, decyzja. Zespół, który nie polega na szczęściu.",
      likes: 689, comments: 41, url: "https://www.instagram.com/perun_tac/" },
    { img: "assets/about-2.jpg", alt: "Uczestnicy szkolenia Perun Tac w trakcie ćwiczeń",
      caption: "Zjazd zamknięty. Dzięki za robotę — do zobaczenia na kolejnym terminie. 🔩",
      likes: 358, comments: 12, url: "https://www.instagram.com/perun_tac/" }
  ];

  var IG_GLYPH =
    '<svg class="ig__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderIG(posts) {
    grid.innerHTML = posts.slice(0, 4).map(function (p) {
      return '<a class="ig__tile" role="listitem" href="' + esc(p.url) + '" target="_blank" rel="noopener" ' +
        'aria-label="Zobacz post na Instagramie: ' + esc(p.caption) + '">' +
        '<img src="' + esc(p.img) + '" alt="' + esc(p.alt) + '" loading="lazy">' +
        '<span class="ig__overlay">' + IG_GLYPH +
        '<span><span class="ig__cap">' + esc(p.caption) + '</span>' +
        '<span class="ig__stat mono">' +
        (p.likes != null ? '<span>♥ ' + p.likes + '</span>' : '') +
        (p.comments != null ? '<span>💬 ' + p.comments + '</span>' : '') +
        '</span></span></span></a>';
    }).join("");
  }

  renderIG(PT_IG);

  /* ---- FAZA 2 — szkielet pobierania z API (nieaktywny) ----
  function fetchIG(endpoint) {
    fetch(endpoint)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var posts = data.map(function (m) {
          return { img: m.media_url || m.thumbnail_url, alt: "Post Perun Tac",
                   caption: m.caption || "", likes: m.like_count, comments: m.comments_count,
                   url: m.permalink };
        });
        renderIG(posts);
      })
      .catch(function () {}); // zostaw kuratorowany grid jako fallback
  }
  // fetchIG("https://twoj-endpoint-lub-widget/last-posts");
  */
})();
