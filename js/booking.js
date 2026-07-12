/* PERUN TAC - kalendarz wydarzeń + zapisy
   Terminy, miejsca i ceny pochodzą z peruntac.pl (stan: lipiec 2026).
   Opisy, programy i wymagania są przykładowe (placeholder) - do uzupełnienia
   przez Perun Tac przed publikacją. */

(function () {
  "use strict";

  /* EN pages live in /en/ and set <html lang="en" data-root="../"> —
     ROOT re-bases asset paths, EN swaps month names, UI strings and
     event copy (EVENTS_EN overlay below). */
  var EN = (document.documentElement.lang || "pl").toLowerCase().indexOf("en") === 0;
  var ROOT = document.documentElement.getAttribute("data-root") || "";

  var MONTHS = EN
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
  var MONTH_NAMES = EN
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  var MON_SHORT = EN
    ? ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    : ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"];

  /* UI strings */
  var T = EN ? {
    dateOne: " DATE", dateMany: " DATES",
    past: "COMPLETED", archive: "Archive", details: "Details + sign-up",
    currency: " PLN",
    signupLine: "Sign-up: info@peruntac.pl / +48 453 300 536"
  } : {
    dateOne: " TERMIN", dateMany: " TERMINY",
    past: "ZAKOŃCZONE", archive: "Archiwum", details: "Szczegóły + zapisy",
    currency: " zł",
    signupLine: "Zapisy: info@peruntac.pl / +48 453 300 536"
  };

  /* ---- Płatności: zaliczka rezerwująca ----
     DEPOSIT_DEFAULT — stała zaliczka (zł) dla szkoleń z ceną liczbową; można
     nadpisać per event polem `deposit`. PAY_LINKS — realne linki płatności
     PayU / Przelewy24 (id szkolenia → URL). Blok płatności pokazuje się TYLKO
     dla szkoleń, które mają tu wpisany prawdziwy link — bez linku klient
     nie może trafić na martwy adres. */
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
    return PAY_LINKS[ev.id] || null; // null -> blok płatności ukryty
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

  /* ---- EN overlay: same events, translated copy (merged onto EVENTS when EN) ---- */
  var OPEN_TRAINING_EN = {
    tag: "OPEN TRAINING",
    level: "All levels",
    desc: "Open live-fire training with pistol and carbine. Small group, instructor supervision, and a focus on repeatability and the quality of every single shot.",
    program: ["Safety check and range commands", "Refining the fundamentals: grip, mount, trigger work", "Timed shooting drills (shot timer)", "Individual feedback from the instructor"],
    req: ["Own firearm or on-site rental (notify us in advance)", "Ammunition: approx. 150 rds pistol / 150 rds carbine", "Eye and ear protection", "Belt / holster welcome"]
  };
  var EVENTS_EN = {
    "its-0614": { title: "Open training: pistol and carbine - ITS match prep", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level, desc: OPEN_TRAINING_EN.desc, program: OPEN_TRAINING_EN.program, req: OPEN_TRAINING_EN.req },
    "wys-budynek": { title: "Height access course: building", place: "Warsaw", price: "600 PLN", tag: "SPECIALIST", level: "Basic",
      desc: "Working at height in an urban environment: rope techniques, belaying and facade entries on a training building.",
      program: ["Height equipment and self-belay", "Building rappel stations and anchor points", "Facade rappels, window entries", "Team work on top-down entries"],
      req: ["No fear of heights", "Fitness to work in a harness", "Gloves, ankle-supporting footwear"] },
    "cqb-intro": { title: "CQB intro", place: "Warsaw", price: "800 PLN", tag: "TACTICAL", level: "Basic",
      desc: "Introduction to close-quarters battle: movement fundamentals, working the angles and two-man room entries.",
      program: ["CQB safety rules", "Working the angles, slicing the pie", "Dynamic and deliberate entries", "Two-man scenarios (training weapons)"],
      req: ["Completed shooting course or professional experience", "Eye and ear protection", "Knee protection recommended"] },
    "vehicle-1": { title: "Vehicle Tactics - level 1", price: "1200 PLN", tag: "TACTICAL", level: "Intermediate",
      desc: "Two-day vehicle tactics course: working around and inside the vehicle, bailing out under fire, cover and evacuation.",
      program: ["Vehicle ballistics: what actually stops a bullet", "Shooting positions around the vehicle", "Exiting the vehicle: driver / passenger / rear", "Casualty evacuation from a vehicle", "Team scenarios, day / dusk"],
      req: ["Confident carbine and pistol handling", "Ammunition: approx. 400 rds carbine, 200 rds pistol", "Gear that allows working inside a vehicle"] },
    "marks-0830": { title: "Open training: pistol and carbine - marksmanship", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level,
      desc: "Accuracy training: precision work at distances from 5 to 100 m, grouping, zero and corrections.",
      program: ["Grouping and zero confirmation", "Precision trigger work", "Shooting at 5-100 m distances", "Hit mapping and DOPE"],
      req: OPEN_TRAINING_EN.req },
    "wys-gory": { title: "Height access course: mountains", place: "Stołowe Mountains", price: "800 PLN", tag: "SPECIALIST", level: "Basic",
      desc: "Rope techniques in mountain terrain: natural anchor points, traverses and rappels in exposed terrain.",
      program: ["Building anchors on natural features", "Rappelling and rope ascents", "Exposed traverses", "Evacuation from difficult terrain"],
      req: ["Fitness for a full day in the field", "Mountain boots, clothing for changing weather", "Height equipment (rental available)"] },
    "mobility-0920": { title: "Open training: pistol and carbine - mobility", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level,
      desc: "Shooting on the move: moving between positions, position changes and working from cover.",
      program: ["Working from cover: high / low", "Shooting on the move", "Reloads on the move", "Timed drills with a shot timer"],
      req: OPEN_TRAINING_EN.req },
    "cqb-2": { title: "CQB course - level 2", place: "Warsaw", price: "800 PLN", tag: "TACTICAL", level: "Advanced",
      desc: "A follow-up to CQB intro: section-level work, connected rooms, hallways and stairwells.",
      program: ["Fundamentals refresher and two-man work", "Connected-room sequences", "Hallways, T-intersections, stairwells", "Role-based decision scenarios"],
      req: ["Completed CQB intro or equivalent", "Training weapons provided", "Eye, knee and elbow protection"] },
    "kraken-26": { title: "KRAKEN-26 - International Tactical Workshops", place: "Baltic Sea", price: "Individual quote", tag: "WORKSHOPS", level: "Invitation / qualification",
      desc: "Four-day international tactical workshops: an exchange of experience between instructors and operators from different sectors, with land and coastal scenarios.",
      program: ["Training blocks led by instructors from several countries", "Night and day scenarios", "Experience and gear exchange zone", "Evaluation and certificates"],
      req: ["Documented training or professional experience", "Application subject to qualification", "Logistics details after qualification"] },
    "its-1018": { title: "Open training: pistol and carbine - ITS match prep", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level, desc: OPEN_TRAINING_EN.desc, program: OPEN_TRAINING_EN.program, req: OPEN_TRAINING_EN.req },
    "recoil-1024": { title: "Open training: pistol and carbine - recoil control", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level,
      desc: "Recoil control and rapid fire: building a mount that keeps fast strings of fire accurate.",
      program: ["A mount built for rapid fire", "Controlled pairs and strings", "Bill drill and variants", "Split-time analysis on the timer"],
      req: OPEN_TRAINING_EN.req },
    "breaching": { title: "Breaching course", price: "1000 PLN", tag: "SPECIALIST", level: "Advanced",
      desc: "Techniques for defeating structural obstacles: mechanical and tool entries on a training facility.",
      program: ["Entry point reconnaissance", "Mechanical entries: ram, halligan", "Breach + assault team work", "Integration with the CQB sequence"],
      req: ["CQB experience required", "Work gloves, eye protection", "Work clothing (it will get destroyed)"] },
    "killhouse": { title: "CQB - Kill House", price: "1000 PLN", tag: "TACTICAL", level: "Advanced",
      desc: "Full scenarios in a kill-house facility: CQB, breaching and decision-making combined under realistic conditions.",
      program: ["Procedures and safety refresher", "Section scenarios with roles", "Low-light work", "Video debrief after every run"],
      req: ["Completed CQB level 2 or equivalent", "Full ballistic protection (rental available)", "Proof of experience on request"] },
    "open-1212": { title: "Open shooting training: pistol and carbine", price: "250 PLN",
      tag: OPEN_TRAINING_EN.tag, level: OPEN_TRAINING_EN.level, desc: OPEN_TRAINING_EN.desc, program: OPEN_TRAINING_EN.program, req: OPEN_TRAINING_EN.req }
  };
  if (EN) {
    EVENTS.forEach(function (ev) {
      var tr = EVENTS_EN[ev.id];
      if (tr) for (var key in tr) ev[key] = tr[key];
    });
  }

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
    html += '<div class="cal__month"><h2 class="cal__month-name">' + MONTH_NAMES[+parts[1]] + " " + parts[0] + '</h2><span class="cal__month-line"></span><span class="cal__month-count mono">' + list.length + (list.length === 1 ? T.dateOne : T.dateMany) + "</span></div>";
    list.forEach(function (ev) {
      var s = parse(ev.start);
      var past = parse(ev.end) < today;
      var dayLabel = ev.start === ev.end ? String(s.getDate()).padStart(2, "0") : String(s.getDate()).padStart(2, "0") + "-" + String(parse(ev.end).getDate()).padStart(2, "0");
      html += '<button class="ev' + (past ? " is-past" : "") + '" type="button" data-ev="' + ev.id + '" aria-haspopup="dialog">' +
        '<span class="ev__inner">' +
        '<span class="ev__date"><span class="ev__day">' + dayLabel + '</span><span class="ev__mon mono">' + MON_SHORT[s.getMonth()] + "</span></span>" +
        '<span><span class="ev__title">' + ev.title + '</span><span class="ev__meta mono"><span>' + ev.place + '</span><span class="sep">/</span><span>' + ev.tag + "</span>" + (past ? '<span class="sep">/</span><span class="ev__soldout">' + T.past + "</span>" : "") + "</span></span>" +
        '<span class="ev__price">' + ev.price + "</span>" +
        '<span class="ev__cta">' + (past ? T.archive : T.details) + "</span>" +
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
    els.img.src = ROOT + current.img;
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
      var payUrl = payUrlFor(current);
      if (past || dep == null || !payUrl) {
        els.pay.classList.add("is-hidden");
      } else {
        els.pay.classList.remove("is-hidden");
        els.payAmt.textContent = dep + T.currency;
        els.payBtn.href = payUrl;
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
  // ESC zamyka. showModal() robi to natywnie (event `cancel`), ale jawny
  // handler jest odporny na przeglądarki/rozszerzenia, które to psują.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dlg.open) closeDialog();
  });
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
      "&details=" + encodeURIComponent(ev.desc + "\n\n" + T.signupLine);
  }

  document.getElementById("bkIcs").addEventListener("click", function () {
    if (!current) return;
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Perun Tac//" + (EN ? "Calendar//EN" : "Kalendarz//PL"), "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + current.id + "@peruntac.pl",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z/, "Z"),
      "DTSTART:" + icsStamp(current.start, "090000"),
      "DTEND:" + icsStamp(current.end, "170000"),
      "SUMMARY:Perun Tac: " + current.title.replace(/,/g, "\\,"),
      "LOCATION:" + current.place.replace(/,/g, "\\,"),
      "DESCRIPTION:" + (current.desc + " " + T.signupLine).replace(/,/g, "\\,"),
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
    var body = EN
      ? "COURSE SIGN-UP\n" +
        "==============\n" +
        "COURSE: " + current.title + "\n" +
        "DATE: " + dateLabel(current) + "\n" +
        "LOCATION: " + current.place + "\n" +
        "PRICE: " + current.price + "\n\n" +
        "FULL NAME: " + fd.get("imie_i_nazwisko") + "\n" +
        "E-MAIL: " + fd.get("email") + "\n" +
        "PHONE: " + fd.get("telefon") + "\n" +
        "EXPERIENCE: " + fd.get("doswiadczenie") + "\n" +
        "NOTES: " + (fd.get("uwagi") || "none") + "\n"
      : "ZGŁOSZENIE NA SZKOLENIE\n" +
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
      "?subject=" + encodeURIComponent((EN ? "Sign-up: " : "Zgłoszenie: ") + current.title + " (" + dateLabel(current) + ")") +
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
