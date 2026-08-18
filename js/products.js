/* PERUN TAC - Oferta: akordeon modułów + filtry + zapytanie o termin.
   Opisy i programy pochodzą ze starej strony peruntac.pl (per-produktowe
   podstrony), część produktów (LRO, TCCC, NVS - dawny SUM poziomy 2-4) nie
   miała jeszcze opisu na starej stronie - oznaczone jako "w przygotowaniu",
   do uzupełnienia przez Perun Tac. Ceny wynajmu/produktów bez podanej ceny
   są placeholderami zgodnie z komentarzami przy poszczególnych pozycjach. */

(function () {
  "use strict";

  var grid = document.getElementById("modacc");
  if (!grid) return;

  var EN = (document.documentElement.lang || "pl").toLowerCase().indexOf("en") === 0;
  var ROOT = document.documentElement.getAttribute("data-root") || "";
  var EVENTS_URL = ROOT + (EN ? "events.html" : "wydarzenia.html");

  var LEVELS = EN ? [
    { key: "poczatkujacy", label: "Beginner" },
    { key: "sredni", label: "Intermediate" },
    { key: "zaawansowany", label: "Advanced" },
    { key: "sluzby", label: "Uniformed services" }
  ] : [
    { key: "poczatkujacy", label: "Początkujący" },
    { key: "sredni", label: "Średniozaawansowany" },
    { key: "zaawansowany", label: "Zaawansowany" },
    { key: "sluzby", label: "Służby mundurowe" }
  ];
  var MODES = EN ? [
    { key: "otwarty", label: "Open" },
    { key: "individualny", label: "1:1 training" },
    { key: "dedykowany", label: "Closed group" },
    { key: "instytucje", label: "Institutions" }
  ] : [
    { key: "otwarty", label: "Otwarty" },
    { key: "individualny", label: "Trening 1:1" },
    { key: "dedykowany", label: "Grupy zamknięte" },
    { key: "instytucje", label: "Dla instytucji" }
  ];
  var T = EN ? {
    filterLevel: "EXPERIENCE LEVEL", filterMode: "DELIVERY FORMAT", filterPlace: "LOCATION", filterSort: "PRICE",
    all: "All", sortNone: "Default", sortAsc: "Low to high", sortDesc: "High to low",
    everyLevel: "All levels", toChoose: "To be chosen", priceIndiv: "Individual quote",
    program: "Program", requirements: "Requirements", noResults: "No courses match the selected filters.",
    seeDates: "See dates in the calendar →", askDates: "Ask about a date →",
    allCat: "All courses", allCatDesc: "The complete Perun Tac offer, alphabetically.",
    comingSoon: "Full description in preparation - contact us for details.",
    duration: "Duration", place: "Location", price: "Price", level: "Level", mode: "Format"
  } : {
    filterLevel: "POZIOM DOŚWIADCZENIA", filterMode: "TRYB REALIZACJI", filterPlace: "MIEJSCE", filterSort: "CENA",
    all: "Wszystkie", sortNone: "Domyślnie", sortAsc: "Rosnąco", sortDesc: "Malejąco",
    everyLevel: "Wszystkie poziomy", toChoose: "Do wyboru", priceIndiv: "Wycena indywidualna",
    program: "Program", requirements: "Wymagania", noResults: "Brak szkoleń spełniających wybrane kryteria.",
    seeDates: "Zobacz terminy w kalendarzu →", askDates: "Zapytaj o termin →",
    allCat: "Wszystkie szkolenia", allCatDesc: "Pełna oferta Perun Tac, w kolejności alfabetycznej.",
    comingSoon: "Pełny opis w przygotowaniu - napisz do nas po szczegóły.",
    duration: "Czas trwania", place: "Miejsce", price: "Cena", level: "Poziom", mode: "Tryb"
  };

  /* anchorId musi zgadzać się z linkami "oferta.html#..." / "training.html#..."
     ze strony głównej — inny fragment w PL i EN, stąd osobne pole obok
     wewnętrznego `key` (który dopasowuje się do product.module, wspólnego dla obu języków). */
  var MODULES = [
    { key: "strzeleckie", anchorId: EN ? "shooting" : "strzeleckie", label: EN ? "Shooting module" : "Moduł strzelecki", img: "assets/mod-strzel.jpg",
      desc: EN ? "Learning to run different shooting platforms and building skill systematically." : "Nauka obsługi różnych platform strzeleckich i systematyczne rozwijanie umiejętności." },
    { key: "taktyczne", anchorId: EN ? "tactical" : "taktyczne", label: EN ? "Tactical module" : "Moduł taktyczny", img: "assets/mod-takt.jpg",
      desc: EN ? "Tactical operations with advanced weapon handling, by day and by night." : "Działania taktyczne z zaawansowanym użyciem broni, w dzień i w nocy." },
    { key: "specjalistyczne", anchorId: EN ? "specialist" : "specjalistyczne", label: EN ? "Specialist module" : "Moduł specjalistyczny", img: "assets/mod-spec.jpg",
      desc: EN ? "Specialist skills for demanding environments." : "Specjalistyczne umiejętności dla wymagających środowisk." }
  ];

  /* ---------- Produkty (dane bazowe PL) ---------- */

  var LVL_ALL = ["poczatkujacy", "sredni", "zaawansowany"];

  var PRODUCTS = [
    // --- MODUŁ STRZELECKI ---
    { id: "treningi-indywidualne", module: "strzeleckie", title: "Treningi indywidualne", tryb: "individualny", levelKeys: LVL_ALL, place: "Wrocław", price: "od 400 zł / sesja", priceValue: 400, duration: "2-3 h",
      desc: "Najbardziej precyzyjna forma rozwoju strzeleckiego. Cykl regularnych spotkań, w których budujemy umiejętności etapami: diagnoza, plan, wykonanie, kontrola wyników.",
      program: ["Fundamenty techniczne pod powtarzalność, kontrolę i tempo", "Karta postępu ucznia: wyniki i priorytety do poprawy", "Tematy dodatkowe dobrane pod Twój cel", "Wskazówki do dry-fire w domu"],
      req: ["Program dopasowany do aktualnego poziomu, celu, sprzętu i czasu", "Możliwość wynajmu broni na miejscu"] },
    { id: "ots", module: "strzeleckie", title: "Otwarty trening strzelecki (OTS)", tryb: "otwarty", levelKeys: ["poczatkujacy", "sredni"], place: "Wrocław", price: "250 zł", priceValue: 250, duration: "1 dzień",
      desc: "Otwarty trening strzelecki z pistoletem i karabinkiem. Pracujemy w małej grupie, pod okiem instruktora, z naciskiem na powtarzalność i jakość każdego strzału.",
      program: ["Kontrola bezpieczeństwa i praca na komendach", "Dopracowanie fundamentów: chwyt, złożenie, praca na spuście", "Strzelania na czas z pomiarem (timer)", "Indywidualna informacja zwrotna od instruktora"],
      req: ["Broń własna lub wynajem na miejscu (zgłoś wcześniej)", "Amunicja: ok. 150 szt. pistolet / 150 szt. karabin"],
      calendarTag: "OTWARTY TRENING" },
    { id: "pistolet-podstawowy", module: "strzeleckie", title: "Pistolet podstawowy", tryb: "otwarty", levelKeys: ["poczatkujacy"], place: "Wrocław", price: "600 zł", priceValue: 600, duration: "ok. 6 h",
      desc: "Szkolenie dla osób bez wcześniejszego doświadczenia z pistoletem oraz tych, którzy chcą uzupełnić fundamenty. Uczymy rozumienia mechaniki strzelania, a nie wyuczonych na pamięć sekwencji.",
      program: ["Zasady bezpieczeństwa", "Budowa i działanie pistoletu", "Dobór i rozmieszczenie sprzętu", "Cztery elementy strzelania: linia celowania, spust, chwyt, postawa", "Taktyczna i awaryjna wymiana magazynka", "Strzał podwójny", "Usuwanie zacięć"],
      req: ["Osoby niepełnoletnie wyłącznie z opiekunem prawnym", "Ochrona słuchu i oczu", "Kabura z ładownikami, pistolet centralnego zapłonu i 200 szt. amunicji", "Ubranie adekwatne do pogody, woda, jedzenie, marker"] },
    { id: "pistolet-zaawansowany", module: "strzeleckie", title: "Pistolet zaawansowany", tryb: "otwarty", levelKeys: ["sredni", "zaawansowany"], place: "Wrocław", price: "700 zł", priceValue: 700, duration: "ok. 6 h",
      desc: "Dla osób z doświadczeniem w strzelaniu z pistoletu, które chcą rozwinąć swoje umiejętności. Skupiamy się na zrozumieniu wszystkich procesów zachodzących podczas strzału.",
      program: ["Efektywna postawa strzelecka", "Budowa chwytu pod anatomię strzelca", "Kontrola odrzutu i podrzutu lufy", "Celowanie obuoczne i widzenie peryferyjne", "Kolimator (MRDS) a przyrządy mechaniczne", "Alternatywne postawy strzeleckie", "Szybka identyfikacja celu", "Przejścia między celami", "Zwiększanie tempa przy zachowaniu celności", "Strzelanie ręką silną i słabą", "Strzelanie w ruchu"],
      req: ["Ukończone szkolenie podstawowe (Perun Tac lub inna firma z zaświadczeniem)", "Pistolet centralnego zapłonu i 250 szt. amunicji", "Pas z kaburą i ładownikami, ochrona słuchu i oczu"] },
    { id: "karabinek-podstawowy", module: "strzeleckie", title: "Karabinek podstawowy", tryb: "otwarty", levelKeys: ["poczatkujacy"], place: "Wrocław", price: "600 zł", priceValue: 600, duration: "ok. 6 h",
      desc: "Szkolenie dla osób bez doświadczenia z karabinkiem oraz tych, którzy chcą usystematyzować wiedzę. Nauka od podstaw, krok po kroku.",
      program: ["Zasady bezpieczeństwa", "Budowa karabinka", "Konfiguracja sprzętu", "Cztery elementy strzelania", "Kolimator a przyrządy mechaniczne", "Procedura zerowania", "Wyniesienie celownika", "Taktyczna i awaryjna wymiana magazynka", "Strzał podwójny", "Kontrola odrzutu", "Usuwanie zacięć"],
      req: ["Osoby niepełnoletnie wyłącznie z opiekunem prawnym", "Karabinek centralnego zapłonu, min. 2 magazynki, 200 szt. amunicji", "Szelka do broni, ładownice, ochrona słuchu i oczu"] },
    { id: "karabinek-zaawansowany", module: "strzeleckie", title: "Karabinek zaawansowany", tryb: "otwarty", levelKeys: ["sredni", "zaawansowany"], place: "Wrocław", price: "700 zł", priceValue: 700, duration: "ok. 6 h",
      desc: "Dla osób chcących podnieść umiejętności strzeleckie z karabinkiem: konfiguracja broni, kontrola odrzutu, strzelanie w oporządzeniu i na różnych dystansach.",
      program: ["Zasady bezpieczeństwa", "Konfiguracja karabinka", "Dobór zera", "Kontrola odrzutu", "Strzelanie w kamizelce taktycznej", "Strzelanie na różnych dystansach", "Canting (przechył broni)", "Strzelanie ręką dominującą i niedominującą", "Alternatywne postawy strzeleckie", "Strzelanie zza osłon", "Konfiguracja i obsługa szelki"],
      req: ["Ukończone szkolenie podstawowe (Perun Tac lub inna firma z zaświadczeniem)", "Karabinek centralnego zapłonu, min. 2 magazynki, 250 szt. amunicji", "Szelka do broni, ładownice, ochrona słuchu i oczu"] },
    { id: "mid-range", module: "strzeleckie", title: "Mid Range", tryb: "otwarty", levelKeys: ["sredni", "zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "2 dni",
      desc: "Kurs strzelania na średnim dystansie ma na celu zwiększenie umiejętności uczestników w strzelaniu do celów na dystansach między 0 a 400 metrów, z użyciem kolimatora z powiększeniem lub optyki LPVO.",
      program: ["Konfiguracja karabinka", "Dobór amunicji", "Zerowanie broni", "Balistyka wewnętrzna", "Balistyka zewnętrzna", "Strzelanie na dystansach 0-400 m", "Alternatywne postawy strzeleckie", "Budowa stabilnej platformy strzeleckiej", "Strzelanie z platform ruchomych", "Strzelanie do celów ruchomych"],
      req: ["Ukończone szkolenie karabinek podstawowy (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe/wojsko"] },
    { id: "long-range", module: "strzeleckie", title: "Long Range", tryb: "otwarty", levelKeys: ["zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "3 dni",
      desc: "Uczestnicy kursu długodystansowego nauczą się wszystkich niezbędnych umiejętności do rażenia celów do 1200 m.",
      program: ["Teoria strzelania długodystansowego", "Typy lunet i siatek celowniczych", "Jednostki kątowe (MOA i MIL)", "Konfiguracja sprzętu i broni", "Naturalna postawa strzelecka", "Praca na spuście", "Oddech", "Budowa stabilnej platformy strzeleckiej", "Zerowanie broni", "Balistyka wewnętrzna", "Balistyka zewnętrzna", "Kalkulatory balistyczne", "DOPE", "Szacowanie i poprawki na wiatr", "Szacowanie i poprawki na odległość", "Strzelanie na dystansach 100-1200 m", "Postawy strzeleckie"],
      req: ["Ukończone szkolenie karabinek podstawowy (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe/wojsko"] },

    // --- MODUŁ TAKTYCZNY ---
    { id: "sum-1", module: "taktyczne", title: "Small Unit Maneuvers - poziom 1", tryb: "dedykowany", levelKeys: ["sredni", "zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "4 dni",
      desc: "Pierwszy z czterech poziomów szkolenia. Podstawy taktyki na poziomie drużyny i oddziału, prowadzone przez byłych żołnierzy, w oparciu o standardy szkolenia jednostek regularnych i specjalnych.",
      program: ["Topografia", "Nawigacja w terenie", "Struktura drużyny w działaniach taktycznych", "Szyki i poruszanie się w terenie", "Podstawy planowania"],
      req: ["Sprawność fizyczna, zdolność do marszów na 20 km", "Obycie z bronią", "Karabinek/replika, szelka, plecak ~40 l, umundurowanie, obuwie taktyczne/trekkingowe, nakrycie głowy, oporządzenie taktyczne"] },
    { id: "sum-2", module: "taktyczne", title: "Small Unit Maneuvers - poziom 2", tryb: "dedykowany", levelKeys: ["zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },
    { id: "sum-3", module: "taktyczne", title: "Small Unit Maneuvers - poziom 3", tryb: "dedykowany", levelKeys: ["zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },
    { id: "sum-4", module: "taktyczne", title: "Small Unit Maneuvers - poziom 4", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },
    { id: "vehicle-tactics-1", module: "taktyczne", title: "Vehicle Tactics - poziom 1", tryb: "otwarty", levelKeys: ["sredni"], place: "Pszów", price: "1200 zł", priceValue: 1200, duration: "2 dni", calendarEventId: "vehicle-1",
      desc: "Vehicle Close Quarter Battle: praca wokół i wewnątrz pojazdu. Program dla osób regularnie pracujących z bronią i podróżujących samochodem: funkcjonariuszy, żołnierzy, pracowników ochrony i osób cywilnych.",
      program: ["Ocena zagrożenia", "Zasady bezpieczeństwa w pojeździe", "Pojazd niepancerny a opancerzony", "Osłona balistyczna a ukrycie", "Przechowywanie broni w pojeździe", "Adaptacja sprzętu do pracy w pojeździe", "Dobywanie broni i reakcja na zagrożenie w pojeździe", "Alternatywne pozycje strzeleckie wokół pojazdu", "Reakcja na zagrożenie z różnych kierunków", "Praca zespołowa 2- i 4-osobowa"],
      req: ["Ukończone szkolenie pistolet i karabinek (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe", "Pistolet i karabinek centralnego zapłonu, min. 2 magazynki, 200 szt. amunicji pistolet + 200 szt. karabin"] },
    { id: "vehicle-tactics-2", module: "taktyczne", title: "Vehicle Tactics - poziom 2", tryb: "dedykowany", levelKeys: ["zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "2 dni",
      desc: "Kontynuacja Vehicle Tactics poziom 1: walka w bliskim kontakcie w i wokół pojazdów, ewakuacja, praca zza wybitej szyby i procedury ratunkowe.",
      program: ["Reakcja na kontakt z różnych kierunków", "Ewakuacja do innego pojazdu", "Ewakuacja po dachowaniu", "Wpływ szyby na tor lotu pocisku", "Ewakuacja rannego z pojazdu", "Kontrola pojazdu", "Techniki ewakuacji osób", "Przeszukanie pojazdu", "Scenariusze Force-on-Force", "Podstawy taktyki ofensywnej"],
      req: ["Ukończony Vehicle Tactics poziom 1 (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe"] },
    { id: "cpo", module: "taktyczne", title: "Close Protection Operative (CPO)", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "5 dni",
      desc: "Program stworzony na bazie wieloletnich doświadczeń z zadań ochronnych, przekazujący praktyczne i realne umiejętności operatorów ochrony osobistej.",
      program: ["Rola i obowiązki operatora CPO", "Rodzaje i źródła zagrożeń w Europie i poza nią", "Konfiguracja i niezbędne wyposażenie", "Umiejętności miękkie i deeskalacja", "Zasady użycia broni", "Rekonesans przed zadaniem", "Planowanie misji", "Ocena ryzyka", "Sporządzanie raportu bezpieczeństwa", "Szyki i sposoby poruszania się", "Skryte noszenie broni", "Ćwiczenia strzeleckie dynamiczne i zespołowe", "Procedury awaryjne", "Protokół pracy z klientem", "Symulacja misji (12 godzin)"],
      req: ["Ukończone szkolenie pistolet i karabinek (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe", "Pistolet i karabinek centralnego zapłonu, 200 szt. amunicji pistolet", "Strój smart casual"] },
    { id: "psd", module: "taktyczne", title: "Private Security Details (PSD)", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "5 dni",
      desc: "Kurs stworzony z myślą, aby przygotować kursantów do ochrony klientów w środowiskach o wysokim ryzyku: zaawansowane strategie bezpieczeństwa, ocena ryzyka, planowanie misji i reakcja na sytuacje kryzysowe.",
      program: ["Przygotowanie do pracy w krajach wysokiego ryzyka", "Rola i obowiązki operatora PSD", "Rodzaje i źródła zagrożeń", "Konfiguracja sprzętu i oporządzenia", "OPSEC", "Zasady użycia broni", "Rekonesans przed zadaniem", "Planowanie misji", "Ocena ryzyka", "Szyki i sposoby poruszania się", "Ćwiczenia strzeleckie dynamiczne i zespołowe", "Taktyka defensywna i ofensywna w pojeździe", "Procedury awaryjne", "Procedury ewakuacyjne", "Symulacja misji (12 godzin)"],
      req: ["Ukończone szkolenie pistolet i karabinek (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe", "Pistolet i karabinek centralnego zapłonu, 100 szt. amunicji pistolet + 200 szt. karabin", "Kamizelka taktyczna"] },
    { id: "ccw", module: "taktyczne", title: "Concealed Carry Weapons (CCW)", tryb: "otwarty", levelKeys: ["poczatkujacy", "sredni"], place: "Wrocław", price: "Wycena indyw.", priceValue: null, duration: "ok. 8 h",
      desc: "Szkolenie z technik skrytego noszenia broni do ochrony osobistej. Buduje umiejętności strzeleckie i świadomość przepisów dotyczących obrony koniecznej. Trzy bloki: prawo (prowadzi specjalista), teoria konfiguracji sprzętu, praktyka strzelań obronnych.",
      program: ["Bezpieczeństwo i aspekty prawne", "Procedury po zdarzeniu", "Metody noszenia (IWB/AIWB/OWB)", "Dobór sprzętu i konfiguracja kabury", "Dobór odzieży", "Rodzaje amunicji i balistyka", "Techniki dobycia broni", "Strefy trafień", "Strzelanie instynktowne i z celowaniem", "Świadomość dystansu krytycznego", "Identyfikacja celu", "Techniki retencji broni", "Teoria Greyman"],
      req: ["Ukończone szkolenie pistolet podstawowy (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe", "Pistolet centralnego zapłonu i 200 szt. amunicji, kabura, pas"] },
    { id: "aop", module: "taktyczne", title: "Aerial Platform Operations (AOP)", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: "ok. 8 h",
      desc: "Szkolenie z taktycznych operacji z użyciem śmigłowca: strzelanie taktyczne i działania z platformy powietrznej.",
      program: ["Zasady bezpieczeństwa", "Planowanie operacji/misji", "Obserwacja i rekonesans", "Dobór i konfiguracja broni i sprzętu", "Bezpieczeństwo wewnątrz śmigłowca", "Przygotowanie śmigłowca pod konkretny typ operacji", "Strzelanie z platform ruchomych do celów ruchomych", "Komunikacja i praca zespołowa"],
      req: ["Ukończone szkolenie karabinek (Perun Tac lub inna firma z zaświadczeniem) lub służby mundurowe", "Karabinek centralnego zapłonu i 200 szt. amunicji, ładownica, rękawice"] },
    { id: "nvs", module: "taktyczne", title: "Night Vision Shooter (NVS)", tryb: "otwarty", levelKeys: ["sredni", "zaawansowany"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },

    // --- MODUŁ SPECJALISTYCZNY ---
    { id: "breaching", module: "specjalistyczne", title: "Breaching", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Włościejewki", price: "1000 zł", priceValue: 1000, duration: "2 dni", calendarEventId: "breaching",
      desc: "Szkolenie z wejść siłowych przy użyciu narzędzi mechanicznych i balistycznych, prowadzone przez specjalistów breachingu z jednostek specjalnych, na specjalnie przystosowanym obiekcie.",
      program: ["Bezpieczeństwo podczas breachingu", "Słabe punkty drzwi, okien i ścian", "Narzędzia mechaniczne i techniki użycia", "Narzędzia balistyczne", "Procedury breachingu z użyciem materiałów wybuchowych", "Pokonywanie drzwi otwieranych do wewnątrz i na zewnątrz", "Pokonywanie okien", "Metody wejść skrytych", "Rozpoznanie celu", "Proces planowania", "Praca zespołowa breachera", "Procedury awaryjne"],
      req: ["Funkcjonariusze służb mundurowych, formacje obrony cywilnej lub inni po weryfikacji", "Ochrona słuchu i oczu, oporządzenie taktyczne, karabinek i pistolet"] },
    { id: "lro", module: "specjalistyczne", title: "Low Pro Operations (LRO)", tryb: "dedykowany", levelKeys: ["zaawansowany", "sluzby"], place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },
    { id: "tccc", module: "specjalistyczne", title: "Tactical Combat Casualty Care (TCCC)", tryb: "dedykowany", levelKeys: LVL_ALL.concat(["sluzby"]), place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: null, program: [], req: [] },
    { id: "heat", module: "specjalistyczne", title: "Hostile Environment Awareness Training (HEAT)", tryb: "dedykowany", levelKeys: LVL_ALL, place: "Do wyboru", price: "Wycena indyw.", priceValue: null, duration: null,
      desc: "Kurs przygotowujący osoby wyjeżdżające służbowo lub prywatnie w miejsca dotknięte konfliktami zbrojnymi, wysoką przestępczością lub zagrożeniami naturalnymi. Uczy reakcji kryzysowej i ograniczania ryzyka poprzez świadomość sytuacyjną i właściwe reakcje.",
      program: ["Charakterystyka i zagrożenia środowiska docelowego", "Bezpieczeństwo osobiste i reakcja na zagrożenie", "Obserwacja i świadomość sytuacyjna", "Analiza i ocena ryzyka", "OPSEC i współpraca w zakresie bezpieczeństwa", "Zapobieganie porwaniom i reakcja", "Procedury izolacji", "Podstawy obsługi broni i balistyki", "Identyfikacja schronienia", "Rozpoznawanie urządzeń wybuchowych", "Zachowanie na punktach kontrolnych", "Komunikacja kryzysowa", "Planowanie trasy i nawigacja", "Pierwsza pomoc", "Psychologiczne aspekty zagrożeń"],
      req: ["Dziennikarze, pracownicy NGO, wolontariusze i osoby pracujące w strefach podwyższonego ryzyka"] }
  ];

  /* ---------- Nakładka EN (tylko tekst - tagi/ceny/moduły bez zmian) ---------- */
  if (EN) {
    var EN_TEXT = {
      "treningi-indywidualne": { title: "Individual training", price: "from 400 PLN / session",
        desc: "The most precise form of shooting development. A series of regular sessions building skill step by step: diagnosis, plan, execution, progress review.",
        program: ["Technical fundamentals for repeatability, control and pace", "A progress card: results and priorities to work on", "Extra topics tailored to your goal", "Dry-fire guidance for home practice"],
        req: ["Program tailored to your current level, goal, gear and time", "On-site firearm rental available"] },
      "ots": { title: "Open shooting training (OTS)", price: "250 PLN",
        desc: "Open live-fire training with pistol and carbine. Small group, instructor supervision, and a focus on repeatability and the quality of every single shot.",
        program: ["Safety check and range commands", "Refining the fundamentals: grip, mount, trigger work", "Timed shooting drills (shot timer)", "Individual feedback from the instructor"],
        req: ["Own firearm or on-site rental (notify us in advance)", "Ammunition: approx. 150 rds pistol / 150 rds carbine"] },
      "pistolet-podstawowy": { title: "Basic pistol", price: "600 PLN",
        desc: "For people with no prior handgun experience and those who want to reinforce the fundamentals. We teach understanding the mechanics of shooting, not memorized sequences.",
        program: ["Safety rules", "Pistol construction and mechanics", "Equipment selection and placement", "The four elements of pistol shooting: sight alignment, trigger, grip, stance", "Tactical reload", "Emergency reload", "Double tap", "Clearing malfunctions"],
        req: ["Minors only with a legal guardian", "Eye and ear protection", "Holster with mag pouches, centerfire pistol, 200 rounds of ammunition", "Weather-appropriate clothing, water, food, a marker"] },
      "pistolet-zaawansowany": { title: "Advanced pistol", price: "700 PLN",
        desc: "For shooters with pistol experience who want to develop further. We focus on understanding everything that happens during the shot.",
        program: ["An effective shooting stance", "Building a grip suited to your anatomy", "Recoil and muzzle-rise control", "Binocular aiming and peripheral vision", "Red dot vs. mechanical sights", "Alternative shooting stances", "Fast target identification", "Transitions between targets", "Increasing pace while keeping accuracy", "Strong- and weak-hand shooting", "Shooting on the move"],
        req: ["Completed basic training (Perun Tac or another provider, with certificate)", "Centerfire pistol and 250 rounds of ammunition", "Belt with holster and mag pouches, eye and ear protection"] },
      "karabinek-podstawowy": { title: "Basic carbine", price: "600 PLN",
        desc: "For people with no prior carbine experience and those who want to systematize their knowledge. Learning from the ground up, step by step.",
        program: ["Safety rules", "Carbine construction", "Equipment configuration", "The four elements of shooting", "Red dot vs. mechanical sights", "Zeroing procedure", "Sight elevation", "Tactical and emergency reloads", "Double tap", "Recoil control", "Clearing malfunctions"],
        req: ["Minors only with a legal guardian", "Centerfire carbine, at least 2 magazines, 200 rounds of ammunition", "Sling, mag pouches, eye and ear protection"] },
      "karabinek-zaawansowany": { title: "Advanced carbine", price: "700 PLN",
        desc: "For shooters who want to raise their carbine skills: weapon configuration, recoil control, shooting in gear and at varying distances.",
        program: ["Safety rules", "Carbine configuration", "Choosing a zero", "Recoil control", "Shooting in a tactical vest", "Engaging targets at various distances", "Canting", "Dominant- and non-dominant-hand shooting", "Alternative shooting positions", "Shooting from cover", "Sling setup and use"],
        req: ["Completed basic training (Perun Tac or another provider, with certificate)", "Centerfire carbine, at least 2 magazines, 250 rounds of ammunition", "Sling, mag pouches, eye and ear protection"] },
      "mid-range": { title: "Mid Range",
        desc: "Mid-range shooting is aimed at improving participants' ability to engage targets between 0 and 400 m, using a magnified red dot or an LPVO optic.",
        program: ["Carbine configuration", "Ammunition selection", "Zeroing", "Internal ballistics", "External ballistics", "Shooting at 0-400 m", "Alternative shooting positions", "Building a stable shooting platform", "Shooting from moving platforms", "Engaging moving targets"],
        req: ["Completed basic carbine training (Perun Tac or another provider, with certificate) or uniformed services/military"] },
      "long-range": { title: "Long Range",
        desc: "Participants learn everything needed to engage targets out to 1200 m.",
        program: ["Long-range shooting theory", "Scope types and reticles", "Angular units (MOA and MIL)", "Gear and weapon configuration", "Natural shooting position", "Trigger control", "Breathing", "Building a stable shooting platform", "Zeroing", "Internal ballistics", "External ballistics", "Ballistic calculators", "DOPE", "Wind reading and corrections", "Range estimation and corrections", "Shooting at 100-1200 m", "Shooting positions"],
        req: ["Completed basic carbine training (Perun Tac or another provider, with certificate) or uniformed services/military"] },
      "sum-1": { title: "Small Unit Maneuvers - level 1",
        desc: "The first of four levels. Fundamentals of team- and unit-level tactics, taught by former soldiers and based on regular and special-forces training standards.",
        program: ["Topography", "Land navigation", "Team structure in tactical operations", "Formations and movement", "Planning basics"],
        req: ["Physically fit, capable of a 20 km march", "Familiarity with firearms", "Rifle/replica, sling, ~40 L pack, uniform, tactical/trekking boots, headwear, tactical gear"] },
      "sum-2": { title: "Small Unit Maneuvers - level 2" },
      "sum-3": { title: "Small Unit Maneuvers - level 3" },
      "sum-4": { title: "Small Unit Maneuvers - level 4" },
      "vehicle-tactics-1": { title: "Vehicle Tactics - level 1", price: "1200 PLN",
        desc: "Vehicle Close Quarter Battle: working around and inside the vehicle. For people who regularly carry firearms and travel by car: officers, military, security personnel and private individuals.",
        program: ["Threat assessment", "Vehicle safety rules", "Soft-skin vs. armored vehicles", "Ballistic cover vs. concealment", "Storing a firearm in the vehicle", "Adapting gear for vehicle work", "Drawing and responding to a threat in the vehicle", "Alternative shooting positions around the vehicle", "Responding to threats from different directions", "2- and 4-person teamwork"],
        req: ["Completed pistol and carbine training (Perun Tac or another provider, with certificate) or uniformed services", "Centerfire pistol and carbine, at least 2 magazines each, 200 rds pistol + 200 rds carbine"] },
      "vehicle-tactics-2": { title: "Vehicle Tactics - level 2",
        desc: "A follow-up to Vehicle Tactics level 1: close-quarters fighting in and around vehicles, evacuation, working through broken glass, and rescue procedures.",
        program: ["Responding to contact from different directions", "Evacuating to another vehicle", "Rollover evacuation", "How glass affects bullet trajectory", "Extracting an injured person from a vehicle", "Vehicle control", "Person-extraction techniques", "Vehicle search", "Force-on-force scenarios", "Offensive tactics fundamentals"],
        req: ["Completed Vehicle Tactics level 1 (Perun Tac or another provider, with certificate) or uniformed services"] },
      "cpo": { title: "Close Protection Operative (CPO)",
        desc: "A program built on years of protective-operations experience, delivering practical, realistic skills for close-protection operators.",
        program: ["CPO operator role and duties", "Threat types and origins in Europe and beyond", "Configuration and required equipment", "Soft skills and de-escalation", "Rules on the use of force", "Pre-mission reconnaissance", "Mission planning", "Risk assessment", "Writing a security report", "Formations and movement methods", "Concealed carry", "Dynamic and team shooting drills", "Emergency procedures", "Client-work protocol", "12-hour mission simulation"],
        req: ["Completed pistol and carbine training (Perun Tac or another provider, with certificate) or uniformed services", "Centerfire pistol and carbine, 200 rds pistol ammunition", "Smart casual clothing"] },
      "psd": { title: "Private Security Details (PSD)",
        desc: "Built to prepare participants to protect clients in high-risk environments: advanced security strategy, risk assessment, mission planning and crisis response.",
        program: ["Preparing for high-risk countries", "PSD operator role and duties", "Threat types and origins", "Gear and loadout configuration", "OPSEC", "Rules on the use of force", "Pre-mission reconnaissance", "Mission planning", "Risk assessment", "Formations and movement methods", "Dynamic and team shooting drills", "Defensive and offensive vehicle tactics", "Emergency procedures", "Evacuation procedures", "12-hour mission simulation"],
        req: ["Completed pistol and carbine training (Perun Tac or another provider, with certificate) or uniformed services", "Centerfire pistol and carbine, 100 rds pistol + 200 rds carbine", "Tactical vest"] },
      "ccw": { title: "Concealed Carry Weapons (CCW)",
        desc: "Concealed-carry techniques for personal protection: shooting skill combined with awareness of the law on self-defense. Three blocks: legal instruction from a firearms-law specialist, gear-configuration theory, and defensive-shooting practice.",
        program: ["Safety and legal aspects", "Post-incident procedures", "Carry methods (IWB/AIWB/OWB)", "Gear selection and holster setup", "Clothing selection", "Ammunition types and ballistics", "Draw techniques", "Target zones", "Instinctive and aimed shooting", "Critical-distance awareness", "Target identification", "Retention techniques", "Greyman theory"],
        req: ["Completed basic pistol training (Perun Tac or another provider, with certificate) or uniformed services", "Centerfire pistol and 200 rounds of ammunition, holster, belt"] },
      "aop": { title: "Aerial Platform Operations (AOP)",
        desc: "Tactical operations from a helicopter: tactical shooting and operating from an aerial platform.",
        program: ["Safety rules", "Operation/mission planning", "Observation and reconnaissance", "Weapon and gear selection and configuration", "Safety inside the helicopter", "Preparing the helicopter for the operation type", "Firing from moving platforms at moving targets", "Communication and teamwork"],
        req: ["Completed carbine training (Perun Tac or another provider, with certificate) or uniformed services", "Centerfire carbine and 200 rounds of ammunition, mag pouch, gloves"] },
      "nvs": { title: "Night Vision Shooter (NVS)" },
      "breaching": { title: "Breaching", price: "1000 PLN",
        desc: "Forced-entry training using mechanical and ballistic tools, taught by special-forces breaching specialists at a purpose-built facility.",
        program: ["Safety during breaching", "Weak points of doors, windows and walls", "Mechanical tools and techniques", "Ballistic tools", "Breaching procedures using explosives", "Defeating inward- and outward-opening doors", "Defeating windows", "Covert entry methods", "Target reconnaissance", "Planning process", "Team breaching work", "Emergency procedures"],
        req: ["Uniformed services, civil-defense personnel, or others after vetting", "Eye and ear protection, tactical gear, carbine and pistol"] },
      "lro": { title: "Low Pro Operations (LRO)" },
      "tccc": { title: "Tactical Combat Casualty Care (TCCC)" },
      "heat": { title: "Hostile Environment Awareness Training (HEAT)",
        desc: "Prepares people traveling for work or privately to places affected by armed conflict, high crime or natural hazards. Teaches crisis response and risk reduction through situational awareness and the right reactions.",
        program: ["Target-environment characteristics and threats", "Personal security and responding to threats", "Observation and situational awareness", "Risk analysis and assessment", "OPSEC and security cooperation", "Kidnap prevention and response", "Isolation procedures", "Basic weapon handling and ballistics", "Identifying shelter", "Recognizing explosive devices", "Checkpoint conduct", "Crisis communication", "Route planning and navigation", "First aid", "Psychological aspects of threat"],
        req: ["Journalists, NGO staff, volunteers and people working in elevated-risk zones"] }
    };
    PRODUCTS.forEach(function (p) {
      var tr = EN_TEXT[p.id];
      if (tr) for (var k in tr) p[k] = tr[k];
      if (p.price === "Wycena indyw.") p.price = T.priceIndiv;
      if (p.place === "Do wyboru") p.place = T.toChoose;
    });
  }

  /* ---------- Filtry ---------- */

  var activeLevel = "all", activeMode = "all", activePlace = "all", activeSort = "none";
  var openCats = { strzeleckie: true };
  var openProds = {};

  var filterLevelEl = document.getElementById("offerFilterLevel");
  var filterModeEl = document.getElementById("offerFilterMode");
  var filterPlaceEl = document.getElementById("offerFilterPlace");
  var filterSortEl = document.getElementById("offerFilterSort");

  function buildFilterPills(container, options, attr, active) {
    if (!container) return;
    var html = '<button type="button" class="' + (active === "all" ? "is-active" : "") + '" data-' + attr + '="all">' + T.all + "</button>";
    options.forEach(function (o) {
      html += '<button type="button" class="' + (active === o.key ? "is-active" : "") + '" data-' + attr + '="' + o.key + '">' + o.label + "</button>";
    });
    container.innerHTML = html;
  }

  function buildFilters() {
    buildFilterPills(filterLevelEl, LEVELS, "level", activeLevel);
    buildFilterPills(filterModeEl, MODES, "mode", activeMode);
    var places = [];
    PRODUCTS.forEach(function (p) { if (p.place !== T.toChoose && places.indexOf(p.place) === -1) places.push(p.place); });
    places.sort(function (a, b) { return a.localeCompare(b, EN ? "en" : "pl"); });
    places.push(T.toChoose);
    buildFilterPills(filterPlaceEl, places.map(function (p) { return { key: p, label: p }; }), "place", activePlace);
    if (filterSortEl) {
      filterSortEl.innerHTML =
        '<button type="button" class="' + (activeSort === "none" ? "is-active" : "") + '" data-sort="none">' + T.sortNone + "</button>" +
        '<button type="button" class="' + (activeSort === "asc" ? "is-active" : "") + '" data-sort="asc">' + T.sortAsc + "</button>" +
        '<button type="button" class="' + (activeSort === "desc" ? "is-active" : "") + '" data-sort="desc">' + T.sortDesc + "</button>";
    }

    [
      [filterLevelEl, "level", function (v) { activeLevel = v; }],
      [filterModeEl, "mode", function (v) { activeMode = v; }],
      [filterPlaceEl, "place", function (v) { activePlace = v; }],
      [filterSortEl, "sort", function (v) { activeSort = v; }]
    ].forEach(function (entry) {
      var el = entry[0], attr = entry[1], setter = entry[2];
      if (!el) return;
      el.addEventListener("click", function (e) {
        var b = e.target.closest("[data-" + attr + "]");
        if (!b) return;
        setter(b.getAttribute("data-" + attr));
        el.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-active", x === b); });
        render();
      });
    });
  }

  function matches(p) {
    var okLevel = activeLevel === "all" || p.levelKeys.indexOf(activeLevel) > -1;
    var okMode = activeMode === "all" || p.tryb === activeMode;
    var okPlace = activePlace === "all" || p.place === activePlace;
    return okLevel && okMode && okPlace;
  }

  function sortProducts(list) {
    if (activeSort === "none") return list;
    var withPrice = list.filter(function (p) { return p.priceValue != null; });
    var withoutPrice = list.filter(function (p) { return p.priceValue == null; });
    withPrice.sort(function (a, b) { return activeSort === "asc" ? a.priceValue - b.priceValue : b.priceValue - a.priceValue; });
    return withPrice.concat(withoutPrice);
  }

  /* ---------- Render ---------- */

  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function productHtml(p) {
    /* Products open to three or more levels collapse to "Wszystkie poziomy" —
       spelling all four out (TCCC) wrapped the tag column onto five lines. */
    var levelLabel = p.levelKeys.length >= 3
      ? T.everyLevel
      : p.levelKeys.map(function (k) { return LEVELS.filter(function (l) { return l.key === k; })[0].label; }).join(", ");
    var tagsHtml = '<span>' + T.level + ": " + levelLabel + "</span>" +
      '<span>' + T.mode + ": " + MODES.filter(function (m) { return m.key === p.tryb; })[0].label + "</span>" +
      '<span>' + T.place + ": " + p.place + "</span>";
    var body;
    if (p.desc) {
      body = "<p>" + escapeHtml(p.desc) + "</p>" +
        (p.duration ? "<p class=\"mono\" style=\"color:var(--olive)\">" + T.duration + ": " + p.duration + "</p>" : "") +
        /* --i drives the staggered reveal delay in css/style.css */
        (p.program.length ? "<h4>" + T.program + "</h4><ul>" + p.program.map(function (i, idx) { return '<li style="--i:' + idx + '">' + escapeHtml(i) + "</li>"; }).join("") + "</ul>" : "") +
        (p.req.length ? "<h4>" + T.requirements + "</h4><ul>" + p.req.map(function (i, idx) { return '<li style="--i:' + idx + '">' + escapeHtml(i) + "</li>"; }).join("") + "</ul>" : "");
    } else {
      body = "<p>" + T.comingSoon + "</p>";
    }
    /* Produkty z realnym terminem w kalendarzu (np. Vehicle Tactics poziom 1)
       kierują wprost do pełnego dialogu zapisu z datą i płatnością zamiast
       do tego prostszego formularza zapytania - pokazujemy tylko jeden,
       właściwy przycisk zamiast dwóch z identycznym tekstem. */
    var cta = '<div class="prod__cta">';
    if (p.calendarEventId) {
      cta += '<a class="btn btn--signal" href="' + EVENTS_URL + "?ev=" + p.calendarEventId + '">' + T.seeDates + "</a>";
    } else {
      cta += '<button type="button" class="btn btn--signal" data-inquire="' + p.id + '">' + T.askDates + "</button>";
    }
    cta += "</div>";
    return (
      '<details class="prod" data-id="' + p.id + '"' + (openProds[p.id] ? " open" : "") + ">" +
      '<summary><span class="prod__name">' + escapeHtml(p.title) + '</span><span class="prod__tags">' + tagsHtml + '</span><span class="prod__price">' + escapeHtml(p.price) + '</span><span class="modacc__chevron" aria-hidden="true"></span></summary>' +
      '<div class="prod__body">' + body + cta + "</div>" +
      "</details>"
    );
  }

  function render() {
    var html = "";
    var anyVisible = false;

    MODULES.forEach(function (m) {
      var list = sortProducts(PRODUCTS.filter(function (p) { return p.module === m.key && matches(p); }));
      var totalInCat = PRODUCTS.filter(function (p) { return p.module === m.key; }).length;
      if (list.length) anyVisible = true;
      html += '<details class="modacc__cat' + (list.length ? "" : " is-hidden") + '" id="' + m.anchorId + '" data-cat="' + m.key + '"' + (openCats[m.key] ? " open" : "") + ">" +
        '<summary><span class="modacc__thumb"><img src="' + ROOT + m.img + '" alt="" loading="lazy"></span>' +
        '<span class="modacc__cat-name">' + m.label + '</span>' +
        '<span class="modacc__cat-count mono">' + list.length + "/" + totalInCat + "</span>" +
        '<span class="modacc__chevron" aria-hidden="true"></span></summary>' +
        '<p class="modacc__desc">' + m.desc + "</p>" +
        '<div class="modacc__list">' + list.map(productHtml).join("") + "</div>" +
        "</details>";
    });

    var allList = sortProducts(PRODUCTS.filter(matches)).slice().sort(function (a, b) {
      if (activeSort !== "none") return 0; // already sorted by price
      return a.title.localeCompare(b.title, EN ? "en" : "pl");
    });
    if (allList.length) anyVisible = true;
    html += '<details class="modacc__cat' + (allList.length ? "" : " is-hidden") + '" data-cat="wszystkie"' + (openCats.wszystkie ? " open" : "") + ">" +
      '<summary><span class="modacc__thumb"><img src="' + ROOT + "assets/oferta-wide.jpg" + '" alt="" loading="lazy"></span>' +
      '<span class="modacc__cat-name">' + T.allCat + '</span>' +
      '<span class="modacc__cat-count mono">' + allList.length + "/" + PRODUCTS.length + "</span>" +
      '<span class="modacc__chevron" aria-hidden="true"></span></summary>' +
      '<p class="modacc__desc">' + T.allCatDesc + "</p>" +
      '<div class="modacc__list">' + allList.map(productHtml).join("") + "</div>" +
      "</details>";

    grid.innerHTML = html;
    var empty = document.getElementById("offerEmpty");
    if (empty) empty.classList.toggle("is-on", !anyVisible);
  }

  grid.addEventListener("toggle", function (e) {
    var el = e.target;
    if (el.classList.contains("modacc__cat")) openCats[el.getAttribute("data-cat")] = el.open;
    else if (el.classList.contains("prod")) openProds[el.getAttribute("data-id")] = el.open;
  }, true);

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-inquire]");
    if (btn) openInquiry(btn.getAttribute("data-inquire"));
  });

  buildFilters();
  render();

  /* ---------- Dialog zapytania o termin (reuse .bk styling) ---------- */

  var dlg = document.getElementById("pfDialog");
  if (!dlg) return;
  var pfEls = {
    tag: document.getElementById("pfTag"), title: document.getElementById("pfTitle"),
    place: document.getElementById("pfPlace"), price: document.getElementById("pfPrice"),
    level: document.getElementById("pfLevel"), mode: document.getElementById("pfMode"),
    desc: document.getElementById("pfDesc"), program: document.getElementById("pfProgram"),
    req: document.getElementById("pfReq"), form: document.getElementById("pfForm"),
    sent: document.getElementById("pfSent")
  };
  var currentProduct = null;

  function fillList(ul, items) { ul.innerHTML = items.map(function (i) { return "<li>" + i + "</li>"; }).join(""); }
  function lockScroll(on) { document.dispatchEvent(new CustomEvent("pt:scroll-lock", { detail: on })); }

  function openInquiry(id) {
    currentProduct = PRODUCTS.filter(function (p) { return p.id === id; })[0];
    if (!currentProduct) return;
    pfEls.tag.textContent = MODULES.filter(function (m) { return m.key === currentProduct.module; })[0].label;
    pfEls.title.textContent = currentProduct.title;
    pfEls.place.textContent = currentProduct.place;
    pfEls.price.textContent = currentProduct.price;
    pfEls.level.textContent = currentProduct.levelKeys.map(function (k) { return LEVELS.filter(function (l) { return l.key === k; })[0].label; }).join(", ");
    pfEls.mode.textContent = MODES.filter(function (m) { return m.key === currentProduct.tryb; })[0].label;
    pfEls.desc.textContent = currentProduct.desc || T.comingSoon;
    fillList(pfEls.program, currentProduct.program.length ? currentProduct.program : []);
    fillList(pfEls.req, currentProduct.req.length ? currentProduct.req : []);
    document.getElementById("pfProgramWrap").classList.toggle("is-hidden", !currentProduct.program.length);
    document.getElementById("pfReqWrap").classList.toggle("is-hidden", !currentProduct.req.length);
    pfEls.sent.classList.remove("is-on");
    dlg.showModal();
    dlg.scrollTop = 0;
    lockScroll(true);
  }
  function closeInquiry() { dlg.close(); }

  dlg.addEventListener("close", function () { lockScroll(false); });
  var pfClose = document.getElementById("pfClose");
  if (pfClose) pfClose.addEventListener("click", closeInquiry);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dlg.open) closeInquiry(); });
  dlg.addEventListener("click", function (e) {
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeInquiry();
  });

  if (pfEls.form) {
    pfEls.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!pfEls.form.reportValidity() || !currentProduct) return;
      var fd = new FormData(pfEls.form);
      var body = EN
        ? "COURSE INQUIRY\n===============\nCOURSE: " + currentProduct.title + "\nLOCATION: " + currentProduct.place + "\nPRICE: " + currentProduct.price + "\n\n" +
          "FULL NAME: " + fd.get("imie_i_nazwisko") + "\nE-MAIL: " + fd.get("email") + "\nPHONE: " + fd.get("telefon") + "\nNOTES: " + (fd.get("uwagi") || "none") + "\n"
        : "ZAPYTANIE O SZKOLENIE\n======================\nSZKOLENIE: " + currentProduct.title + "\nMIEJSCE: " + currentProduct.place + "\nCENA: " + currentProduct.price + "\n\n" +
          "IMIĘ I NAZWISKO: " + fd.get("imie_i_nazwisko") + "\nE-MAIL: " + fd.get("email") + "\nTELEFON: " + fd.get("telefon") + "\nUWAGI: " + (fd.get("uwagi") || "brak") + "\n";
      location.href = "mailto:info@peruntac.pl" +
        "?subject=" + encodeURIComponent((EN ? "Inquiry: " : "Zapytanie: ") + currentProduct.title) +
        "&body=" + encodeURIComponent(body);
      pfEls.sent.classList.add("is-on");
    });
  }
})();
