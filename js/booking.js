/* PERUN TAC - kalendarz wydarzeń + zapisy
   Terminy, miejsca i ceny pochodzą z peruntac.pl (stan: lipiec 2026).
   Opisy, programy i wymagania są przykładowe (placeholder) - do uzupełnienia
   przez Perun Tac przed publikacją. */

(function () {
  "use strict";

  var MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
  var MONTH_NAMES = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  var MON_SHORT = ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"];

  /* ---- Płatności: zaliczka rezerwująca ----
     DEPOSIT_DEFAULT — stała zaliczka (zł) dla szkoleń z ceną liczbową; można
     nadpisać per event polem `deposit`. PAY_LINKS — realne linki płatności
     PayU / Przelewy24 (id szkolenia → URL); dopóki puste, generujemy placeholder
     https://pay.peruntac.pl/... który podmienisz na link z panelu operatora. */
  var DEPOSIT_DEFAULT = 100;
  var PAY_LINKS = {
    // "its-0614": "https://secure.payu.com/pay/....",
    // "cqb-intro": "https://przelewy24.pl/....",
  };

  function priceValue(price) { // "1200 zł" -> 1200 ; "Wycena indyw." -> null
    var m = String(price).replace(/\s/g, "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }
  function depositFor(ev) {
    var val = priceValue(ev.price);
    if (val == null) return null; // brak ceny liczbowej -> zaliczka nie dotyczy
    var dep = ev.deposit != null ? ev.deposit : DEPOSIT_DEFAULT;
    return Math.min(dep, val);
  }
  function payUrlFor(ev) {
    return PAY_LINKS[ev.id] || "https://pay.peruntac.pl/zaliczka/" + ev.id;
  }

  var OPEN_TRAINING = {
    tag: "OTWARTY TRENING",
    level: "Każdy",
    desc: "Otwarty trening strzelecki z pistoletem i karabinkiem. Pracujemy w małej grupie, pod okiem instruktora, z naciskiem na powtarzalność i jakość każdego strzału.",
    program: ["Kontrola bezpieczeństwa i praca na komendach", "Dopracowanie fundamentów: chwyt, złożenie, praca na spuście", "Strzelania na czas z pomiarem (timer)", "Indywidualna informacja zwrotna od instruktora"],
    req: ["Broń własna lub wynajem na miejscu (zgłoś wcześniej)", "Amunicja: ok. 150 szt. pistolet / 150 szt. karabin", "Ochrona słuchu i oczu", "Pas / kabura mile widziane"]
  };

  var EVENTS = [
    { id: "its-0614", title: "Otwarty trening: pistolet i karabin - trening pod zawody ITS", start: "2026-06-14", end: "2026-06-14", place: "Wrocław", price: "250 zł", img: "assets/hero-4.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level, desc: OPEN_TRAINING.desc, program: OPEN_TRAINING.program, req: OPEN_TRAINING.req },
    { id: "wys-budynek", title: "Szkolenie wysokościowe: budynek", start: "2026-08-08", end: "2026-08-08", place: "Warszawa", price: "600 zł", img: "assets/onas-2.jpg",
      tag: "SPECJALISTYCZNE", level: "Podstawowy",
      desc: "Praca na wysokości w środowisku miejskim: techniki linowe, asekuracja i wejścia po elewacji budynku szkoleniowego.",
      program: ["Sprzęt wysokościowy i autoasekuracja", "Budowa stanowisk i punktów zjazdowych", "Zjazdy po elewacji, wejścia oknem", "Praca zespołowa przy wejściu z góry"],
      req: ["Brak lęku wysokości", "Kondycja pozwalająca na pracę w uprzęży", "Rękawice, obuwie usztywniające kostkę"] },
    { id: "cqb-intro", title: "CQB intro", start: "2026-08-09", end: "2026-08-09", place: "Warszawa", price: "800 zł", img: "assets/hero-1.jpg",
      tag: "TAKTYCZNE", level: "Podstawowy",
      desc: "Wprowadzenie do walki w pomieszczeniach: fundamenty poruszania się, praca kątów i wejścia do pomieszczeń w parach.",
      program: ["Zasady bezpieczeństwa w CQB", "Praca kątów, slicing the pie", "Wejścia dynamiczne i deliberate", "Scenariusze w parach (broń treningowa)"],
      req: ["Ukończone szkolenie strzeleckie lub doświadczenie służbowe", "Ochrona oczu i słuchu", "Rekomendowana ochrona kolan"] },
    { id: "vehicle-1", title: "Vehicle Tactics - level 1", start: "2026-08-15", end: "2026-08-16", place: "Pszów", price: "1200 zł", img: "assets/onas-1.jpg",
      tag: "TAKTYCZNE", level: "Średniozaawansowany",
      desc: "Dwudniowe szkolenie z taktyki wykorzystania pojazdów: praca wokół i wewnątrz pojazdu, opuszczanie pojazdu pod ostrzałem, osłona i ewakuacja.",
      program: ["Balistyka pojazdu: co naprawdę zatrzymuje pocisk", "Pozycje strzeleckie wokół pojazdu", "Opuszczanie pojazdu: kierowca / pasażer / tył", "Ewakuacja rannego z pojazdu", "Scenariusze zespołowe dzień / zmierzch"],
      req: ["Pewna obsługa karabinka i pistoletu", "Amunicja: ok. 400 szt. karabin, 200 szt. pistolet", "Oporządzenie umożliwiające pracę w pojeździe"] },
    { id: "marks-0830", title: "Otwarty trening: pistolet i karabin - marksmanship", start: "2026-08-30", end: "2026-08-30", place: "Wrocław", price: "250 zł", img: "assets/mod-strzel.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level,
      desc: "Trening celności: praca na precyzję na dystansach od 5 do 100 m, grupowanie, zero i poprawki.",
      program: ["Grupowanie i potwierdzenie zera", "Praca na spuście na precyzję", "Strzelania na dystansach 5-100 m", "Mapowanie trafień i DOPE"],
      req: OPEN_TRAINING.req },
    { id: "wys-gory", title: "Szkolenie wysokościowe: góry", start: "2026-09-19", end: "2026-09-19", place: "Góry Stołowe", price: "800 zł", img: "assets/onas-4.jpg",
      tag: "SPECJALISTYCZNE", level: "Podstawowy",
      desc: "Techniki linowe w terenie górskim: naturalne punkty asekuracyjne, trawersy i zjazdy w eksponowanym terenie.",
      program: ["Budowa stanowisk na punktach naturalnych", "Zjazdy i podchodzenie po linie", "Trawersy eksponowane", "Ewakuacja z trudnego terenu"],
      req: ["Kondycja na całodniową pracę w terenie", "Buty górskie, odzież na zmienną pogodę", "Sprzęt wysokościowy (możliwość wypożyczenia)"] },
    { id: "mobility-0920", title: "Otwarty trening: pistolet i karabin - mobility", start: "2026-09-20", end: "2026-09-20", place: "Wrocław", price: "250 zł", img: "assets/oferta-wide.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level,
      desc: "Strzelanie w ruchu: przemieszczanie między stanowiskami, zmiany pozycji i praca z osłon.",
      program: ["Praca z osłon: wysokie / niskie", "Strzelanie w przemieszczeniu", "Zmiany magazynków w ruchu", "Drille na czas z timerem"],
      req: OPEN_TRAINING.req },
    { id: "cqb-2", title: "Szkolenie CQB - level 2", start: "2026-10-10", end: "2026-10-10", place: "Warszawa", price: "800 zł", img: "assets/hero-1.jpg",
      tag: "TAKTYCZNE", level: "Zaawansowany",
      desc: "Rozwinięcie CQB intro: praca w sekcji, pomieszczenia połączone, korytarze i klatki schodowe.",
      program: ["Powtórka fundamentów i praca w parach", "Sekwencje pomieszczeń połączonych", "Korytarze, T-intersections, klatki schodowe", "Scenariusze z rolami i decyzją"],
      req: ["Ukończone CQB intro lub równoważne", "Broń treningowa zapewniona", "Ochrona oczu, kolan i łokci"] },
    { id: "kraken-26", title: "KRAKEN-26 - Międzynarodowe Warsztaty Taktyczne", start: "2026-10-15", end: "2026-10-18", place: "Morze Bałtyckie", price: "Wycena indyw.", img: "assets/band-wide.jpg",
      tag: "WARSZTATY", level: "Zaproszenie / kwalifikacja",
      desc: "Czterodniowe międzynarodowe warsztaty taktyczne: wymiana doświadczeń między instruktorami i operatorami z różnych sektorów, scenariusze lądowe i nadmorskie.",
      program: ["Bloki szkoleniowe prowadzone przez instruktorów z kilku państw", "Scenariusze nocne i dzienne", "Strefa wymiany doświadczeń i sprzętu", "Ewaluacja i certyfikaty"],
      req: ["Udokumentowane doświadczenie szkoleniowe lub służbowe", "Zgłoszenie podlega kwalifikacji", "Szczegóły logistyczne po zakwalifikowaniu"] },
    { id: "its-1018", title: "Otwarty trening: pistolet i karabin - trening pod zawody ITS", start: "2026-10-18", end: "2026-10-18", place: "Wrocław", price: "250 zł", img: "assets/hero-4.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level, desc: OPEN_TRAINING.desc, program: OPEN_TRAINING.program, req: OPEN_TRAINING.req },
    { id: "recoil-1024", title: "Otwarty trening: pistolet i karabin - kontrola odrzutu", start: "2026-10-24", end: "2026-10-24", place: "Wrocław", price: "250 zł", img: "assets/about-2.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level,
      desc: "Kontrola odrzutu i szybkie strzelania: budowanie złożenia, które pozwala oddawać celne strzały w krótkich odstępach.",
      program: ["Złożenie pod szybkie strzelanie", "Pary i serie kontrolowane", "Bill drill i warianty", "Analiza splitów na timerze"],
      req: OPEN_TRAINING.req },
    { id: "breaching", title: "Szkolenie Breaching", start: "2026-11-07", end: "2026-11-07", place: "Włościejewki", price: "1000 zł", img: "assets/hero-2.jpg",
      tag: "SPECJALISTYCZNE", level: "Zaawansowany",
      desc: "Techniki pokonywania przeszkód budowlanych: wejścia mechaniczne i narzędziowe na obiekcie ćwiczebnym.",
      program: ["Rozpoznanie punktu wejścia", "Wejścia mechaniczne: ram, halligan", "Praca zespołu breach + assault", "Integracja z sekwencją CQB"],
      req: ["Doświadczenie CQB wymagane", "Rękawice robocze, ochrona oczu", "Odzież robocza (zniszczy się)"] },
    { id: "killhouse", title: "CQB - Kill House", start: "2026-11-08", end: "2026-11-08", place: "Włościejewki", price: "1000 zł", img: "assets/hero-1.jpg",
      tag: "TAKTYCZNE", level: "Zaawansowany",
      desc: "Pełne scenariusze w obiekcie kill house: łączymy CQB, breaching i decyzyjność w realistycznych warunkach.",
      program: ["Przypomnienie procedur i bezpieczeństwa", "Scenariusze sekcyjne z rolami", "Praca przy ograniczonym świetle", "Debrief wideo po każdym przejściu"],
      req: ["Ukończone CQB level 2 lub równoważne", "Kompletna ochrona balistyczna (wypożyczenie możliwe)", "Zaświadczenie o doświadczeniu na życzenie"] },
    { id: "open-1212", title: "Otwarty trening strzelecki: pistolet i karabin", start: "2026-12-12", end: "2026-12-12", place: "Wrocław", price: "250 zł", img: "assets/hero-5.jpg",
      tag: OPEN_TRAINING.tag, level: OPEN_TRAINING.level, desc: OPEN_TRAINING.desc, program: OPEN_TRAINING.program, req: OPEN_TRAINING.req }
  ];

  /* ---------- Render calendar ---------- */

  var cal = document.getElementById("cal");
  if (!cal) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function parse(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function dateLabel(ev) {
    var s = parse(ev.start), e = parse(ev.end);
    if (ev.start === ev.end) return s.getDate() + " " + MONTHS[s.getMonth()] + " " + s.getFullYear();
    if (s.getMonth() === e.getMonth()) return s.getDate() + "-" + e.getDate() + " " + MONTHS[s.getMonth()] + " " + s.getFullYear();
    return s.getDate() + " " + MONTHS[s.getMonth()] + " - " + e.getDate() + " " + MONTHS[e.getMonth()] + " " + s.getFullYear();
  }

  var sorted = EVENTS.slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  var byMonth = {};
  sorted.forEach(function (ev) {
    var s = parse(ev.start);
    var key = s.getFullYear() + "-" + s.getMonth();
    (byMonth[key] = byMonth[key] || []).push(ev);
  });

  var html = "";
  Object.keys(byMonth).forEach(function (key) {
    var parts = key.split("-");
    var list = byMonth[key];
    html += '<div class="cal__group">';
    html += '<div class="cal__month"><h2 class="cal__month-name">' + MONTH_NAMES[+parts[1]] + " " + parts[0] + '</h2><span class="cal__month-line"></span><span class="cal__month-count mono">' + list.length + (list.length === 1 ? " TERMIN" : " TERMINY") + "</span></div>";
    list.forEach(function (ev) {
      var s = parse(ev.start);
      var past = parse(ev.end) < today;
      var dayLabel = ev.start === ev.end ? String(s.getDate()).padStart(2, "0") : String(s.getDate()).padStart(2, "0") + "-" + String(parse(ev.end).getDate()).padStart(2, "0");
      html += '<button class="ev' + (past ? " is-past" : "") + '" type="button" data-ev="' + ev.id + '" aria-haspopup="dialog">' +
        '<span class="ev__inner">' +
        '<span class="ev__date"><span class="ev__day">' + dayLabel + '</span><span class="ev__mon mono">' + MON_SHORT[s.getMonth()] + "</span></span>" +
        '<span><span class="ev__title">' + ev.title + '</span><span class="ev__meta mono"><span>' + ev.place + '</span><span class="sep">/</span><span>' + ev.tag + "</span>" + (past ? '<span class="sep">/</span><span class="ev__soldout">ZAKOŃCZONE</span>' : "") + "</span></span>" +
        '<span class="ev__price">' + ev.price + "</span>" +
        '<span class="ev__cta">' + (past ? "Archiwum" : "Szczegóły + zapisy") + "</span>" +
        "</span></button>";
    });
    html += "</div>";
  });
  cal.innerHTML = html;

  /* ---------- Dialog ---------- */

  var dlg = document.getElementById("bkDialog");
  var current = null;
  var els = {
    img: document.getElementById("bkImg"), tag: document.getElementById("bkTag"),
    title: document.getElementById("bkTitle"), date: document.getElementById("bkDate"),
    place: document.getElementById("bkPlace"), price: document.getElementById("bkPrice"),
    level: document.getElementById("bkLevel"), desc: document.getElementById("bkDesc"),
    program: document.getElementById("bkProgram"), req: document.getElementById("bkReq"),
    gcal: document.getElementById("bkGcal"), sent: document.getElementById("bkSent"),
    form: document.getElementById("bkForm"),
    pay: document.getElementById("bkPay"), payAmt: document.getElementById("bkPayAmt"),
    payBtn: document.getElementById("bkPayBtn")
  };

  function fillList(ul, items) {
    ul.innerHTML = items.map(function (i) { return "<li>" + i + "</li>"; }).join("");
  }

  function lockScroll(on) {
    document.dispatchEvent(new CustomEvent("pt:scroll-lock", { detail: on }));
  }

  function openEvent(id) {
    current = EVENTS.filter(function (e) { return e.id === id; })[0];
    if (!current) return;
    els.img.src = current.img;
    els.img.alt = current.title;
    els.tag.textContent = current.tag;
    els.title.textContent = current.title;
    els.date.textContent = dateLabel(current);
    els.place.textContent = current.place;
    els.price.textContent = current.price;
    els.level.textContent = current.level;
    els.desc.textContent = current.desc;
    fillList(els.program, current.program);
    fillList(els.req, current.req);
    els.gcal.href = gcalUrl(current);
    // deposit / payment block — only for upcoming events with a numeric price
    if (els.pay) {
      var past = parse(current.end) < today;
      var dep = depositFor(current);
      if (past || dep == null) {
        els.pay.classList.add("is-hidden");
      } else {
        els.pay.classList.remove("is-hidden");
        els.payAmt.textContent = dep + " zł";
        els.payBtn.href = payUrlFor(current);
      }
    }
    els.sent.classList.remove("is-on");
    dlg.showModal();
    dlg.scrollTop = 0;
    lockScroll(true);
  }

  function closeDialog() {
    dlg.close();
  }

  dlg.addEventListener("close", function () { lockScroll(false); });
  document.getElementById("bkClose").addEventListener("click", closeDialog);
  dlg.addEventListener("click", function (e) {
    // click on the backdrop (outside the content box) closes
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
  });

  cal.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-ev]");
    if (btn) openEvent(btn.getAttribute("data-ev"));
  });

  /* ---------- Calendar export ---------- */

  function icsStamp(dateStr, time) { return dateStr.replace(/-/g, "") + "T" + time; }

  function gcalUrl(ev) {
    var dates = icsStamp(ev.start, "090000") + "/" + icsStamp(ev.end, "170000");
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Perun Tac: " + ev.title) +
      "&dates=" + dates +
      "&location=" + encodeURIComponent(ev.place) +
      "&details=" + encodeURIComponent(ev.desc + "\n\nZapisy: info@peruntac.pl / +48 453 300 536");
  }

  document.getElementById("bkIcs").addEventListener("click", function () {
    if (!current) return;
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Perun Tac//Kalendarz//PL", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + current.id + "@peruntac.pl",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z/, "Z"),
      "DTSTART:" + icsStamp(current.start, "090000"),
      "DTEND:" + icsStamp(current.end, "170000"),
      "SUMMARY:Perun Tac: " + current.title.replace(/,/g, "\\,"),
      "LOCATION:" + current.place.replace(/,/g, "\\,"),
      "DESCRIPTION:" + (current.desc + " Zapisy: info@peruntac.pl / +48 453 300 536").replace(/,/g, "\\,"),
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "peruntac-" + current.id + ".ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  });

  /* ---------- Signup form → structured email ---------- */

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!els.form.reportValidity() || !current) return;
    var fd = new FormData(els.form);
    var body =
      "ZGŁOSZENIE NA SZKOLENIE\n" +
      "=======================\n" +
      "SZKOLENIE: " + current.title + "\n" +
      "TERMIN: " + dateLabel(current) + "\n" +
      "MIEJSCE: " + current.place + "\n" +
      "CENA: " + current.price + "\n\n" +
      "IMIĘ I NAZWISKO: " + fd.get("imie_i_nazwisko") + "\n" +
      "E-MAIL: " + fd.get("email") + "\n" +
      "TELEFON: " + fd.get("telefon") + "\n" +
      "DOŚWIADCZENIE: " + fd.get("doswiadczenie") + "\n" +
      "UWAGI: " + (fd.get("uwagi") || "brak") + "\n";
    location.href = "mailto:info@peruntac.pl" +
      "?subject=" + encodeURIComponent("Zgłoszenie: " + current.title + " (" + dateLabel(current) + ")") +
      "&body=" + encodeURIComponent(body);
    els.sent.classList.add("is-on");
  });

  /* ---------- Deep-link: ?ev=<id> lub #ev=<id> otwiera dane szkolenie ----------
     Przydatne do linków „zapisz się" z Instagrama, maila czy płatności. */
  var deep = (location.search + location.hash).match(/[?&#]ev=([\w-]+)/);
  if (deep && EVENTS.some(function (e) { return e.id === deep[1]; })) {
    requestAnimationFrame(function () { openEvent(deep[1]); });
  }
})();
