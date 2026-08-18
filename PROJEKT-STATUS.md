# PERUN — status projektu

> **Dokument sterujący.** Otwórz go na starcie każdej sesji. Zasada: nic nie jest
> „zrobione", dopóki nie ma `[x]` + krótkiej notatki co dokładnie zmienione.
> Źródło wymagań: `../assety/Strona PERUN TAC.pdf` (poprawki od klienta).
> Zrzuty z adnotacjami wyciągnięte z PDF — numeracja punktów niżej = numeracja z PDF.

**Ostatnia aktualizacja:** 2026-08-18 (koniec sesji)
**Stan:** ETAP 1 (Perun Tac) i ETAP 2 (Perun Sec) ZBUDOWANE i wypchnięte na GitHub
(`filipjakubiak/peruntacv2`, gałąź `main`, ostatni commit `6c60241`). Drzewo czyste.

---

## ⏭️ OD CZEGO ZACZĄĆ NASTĘPNĄ SESJĘ

**Czeka decyzja klienta — bez niej nie ruszamy CMS-a.** Rozpisany został design
(patrz „ETAP 3 — Panel CMS" niżej), ustalone są wymagania, ale wisi wybór technologii:

- **Wariant A — Sveltia CMS (git-based)** ← rekomendacja. Panel pod `peruntac.pl/admin`,
  treść = pliki w repo, publikacja przez commit + przebudowa Pages (~1 min). Zero backendu,
  zero kosztów, pełna historia zmian. **Koszt: każdy edytor musi mieć konto GitHub.**
- **Wariant B — własny panel na Cloudflare Workers + D1.** Logowanie e-mail + hasło,
  publikacja natychmiastowa, naturalna podstawa pod etap 3B (płatności, maile).
  **Koszt: ~3× więcej pracy, własna odpowiedzialność za autoryzację, backupy bazy.**

Ustalone już wymagania CMS (nie trzeba pytać ponownie):
1. **Edytorzy:** kilka osób, w tym jedna techniczna.
2. **Model danych:** SZKOLENIE (opis/program/wymagania — pisane raz) + TERMIN
   (data/miejsce/cena). Dodanie terminu = wybór szkolenia z listy. Koniec z dzisiejszą
   duplikacją `products.js` ↔ `booking.js` spinaną ręcznie przez `calendarEventId`.
3. **Języki:** pola EN opcjonalne, brak EN = strona angielska pokazuje PL (bez pustych miejsc).
4. **Zakres:** szkolenia + terminy + relacje z wydarzeń (PT/001–007) + galeria na home
   + artykuły w Bazie wiedzy. **Bez** celów strzeleckich (46 pozycji, rzadko się zmieniają).

**Warunek techniczny (niezależny od wariantu):** dane muszą wyjechać z tablic w `js/` do
plików JSON. Dziś siedzą w `js/booking.js` (EVENTS, 14 pozycji), `js/products.js`
(PRODUCTS, 23) i `js/targets.js` (46). To pierwszy krok implementacji.

---

**Pozostałe otwarte punkty Etapu 1:** **25b** (artykuł-relacja z wydarzenia — czeka na
szablon + treści od Piotrka) i treści prawne (regulaminy/polityka — czekają na Gabę).
Wszystko inne z PDF-a zrobione i zweryfikowane w przeglądarce, PL+EN.

### Decyzje podjęte (2026-08-18)

1. **Kolejność prac:** 1) copy/drobne poprawki Tac → 2) Perun Sec jako osobna strona →
   3) Kalendarz + Oferta (przebudowa) → 4) CMS.
2. **CMS: Decap/Sveltia (git-based, GitHub + Cloudflare Pages).** Budowa odłożona na
   **grudzień 2026**. Warunek: przy przebudowie kalendarza (etap 3) wydarzenia muszą
   trafić do `data/events.json` — wtedy postawienie panelu to ~1 sesja.
3. **Płatności:** na razie **tylko frontend** — wszystkie pola, suwaki i podliczanie
   „RAZEM DO ZAPŁATY" z PDF, ale przycisk płatności nieaktywny/ukryty do czasu wyboru
   operatora. Kod pisany tak, by podpiąć operatora bez przepisywania.
4. **Perun Sec:** podkatalog `perunsec/` w tym repo, osobny projekt Cloudflare Pages.

---

## 0. Architektura docelowa

Jedno repo (`github.com/filipjakubiak/peruntacv2`), **dwa osobne projekty
Cloudflare Pages** — każdy z innym katalogiem głównym.

| Co | Katalog w repo | Root dla Pages | Domena | Język |
|---|---|---|---|---|
| Perun Tac (szkolenia) | `/` (korzeń repo) | `/` | peruntac.pl | PL + `/en/` |
| Perun Sec (ochrona) | `perunsec/` | `perunsec/` | perunsec.com | tylko EN |
| Panel CMS | `admin/` (jeszcze nie istnieje) | część projektu Tac | peruntac.pl/admin | PL |

- Strona główna peruntac.pl zostaje z **rozdzielonym hero** (Tac / Sec) — panel Sec
  linkuje na zewnątrz do `https://perunsec.com`.
- `perun-security.html` w obecnym repo → docelowo **usuwany/301** na perunsec.com.
- Osobny adres e-mail w domenie perunsec.

---

## ETAP 1 — Poprawki PERUN TAC

### 1A. Strona główna (`index.html` + `en/index.html`) — ✅ ZROBIONE 2026-08-18

- [x] **1.** Większe logo w lewym górnym rogu — `.nav__logo img` height `clamp(42px,3.4vw,52px)` (było 34px)
- [x] **2.** Menu: „Wydarzenia" → **„Kalendarz"** (link do `wydarzenia.html`, plik zostaje) — PL+EN (EN: „Events"→„Calendar")
- [x] **3.** Menu: „Oferta" → **„Szkolenia"** (EN „Training" już było poprawne)
- [x] **4.** Kropki w kickerach ujednolicone — dodano `.dot` (ta sama wielkość co `.blink`, bez migania) jako separator
- [x] **5.** Opis Tac zmieniony na treść z PDF (PL+EN)
- [x] **6.** CTA → **„Zobacz dostępne szkolenia"** / EN „See available courses"
- [x] **7.** Auto-detekcja języka: skrypt w `<head>` index.html, przekierowanie na `en/index.html` gdy
      `navigator.language` ≠ PL; zapamiętanie ręcznego wyboru w `localStorage` (`perun-lang`),
      logika w `js/main.js` (langSwitch handler)
- [x] **8.** Opis Sec zmieniony na treść z PDF (PL+EN)
- [x] **9.** CTA → **„Zobacz nasze usługi"** / EN „See our services"
- [x] **10.** Zdjęcie panelu Sec → `assets/sec-baghdad.jpg` (skopiowane z `assety/`), użyte w PL+EN hero
- [x] **11.** Słowo „Szkolenia" usunięte z tytułów wierszy oferty → „Strzeleckie" / „Taktyczne" /
      „Specjalistyczne" (+ nowy wiersz „Tryby realizacji" zamiast „Dla instytucji" — patrz pkt 18)
- [x] **12.** „Nasza oferta" → **„Szkolenia"** (EN: „What we do"→„Training")
- [x] **13.** Nowy podtytuł z PDF (PL+EN)
- [x] **14.** Opis strzeleckich zmieniony (PL+EN)
- [x] **15.** Tag „NOC / DZIEŃ" (wiersz taktyczne) → **„OTWARTE ZAPISY"**
- [x] **16.** Opis taktycznych zmieniony (PL+EN)
- [x] **17.** Wiersz specjalistyczne: tag zielony „ZDOBĄDŹ SPECJALIZACJĘ" (`.offer__tag--signal`),
      nowy opis (PL+EN)
- [x] **18.** „Kontrakty specjalistyczne" → **„Tryby realizacji"**, link `oferta.html#tryby`
      (dodano `id="tryby"` w oferta.html / `id="formats"` w en/training.html), nowy opis
- [x] **19.** Opis materiałów treningowych zmieniony (PL+EN)
- [x] **20.** Nagłówek misji zmieniony (PL+EN)
- [x] **21.** Tekst misji zmieniony (PL+EN)
- [x] **22.** „DOKTRYNA: wiedza → powtórzenia → presja" → **„AUTORSKI SYSTEM NAUCZANIA"** (EN: „PROPRIETARY TEACHING SYSTEM")
- [x] **23.** Usunięto `<figcaption>` „NOC // PRACA NA NVG" i „DZIEŃ // PRACA ZESPOŁOWA" (PL+EN)
- [x] **24.** CTA → **„Skontaktuj się z nami"** / EN „Get in touch"
- [x] **25.** Galeria — podpisy PT/001–003 zgodne z realnymi wydarzeniami (Gryf-25 ×2, Vehicle Tactics);
      PT/004–007 nazwane (Gryf-26, Mid Range, Long Range, NVG) ale **wciąż na starych zdjęciach
      hero-4..7 — TODO podmienić, gdy Piotrek dośle materiał** (oznaczone komentarzem w HTML)
- [ ] **25b.** Klik w zdjęcie → **artykuł-relacja z wydarzenia** — NIE ZROBIONE, wymaga nowego
      szablonu strony i treści od Piotrka. Odłożone do etapu, gdy materiał będzie gotowy.
- [x] **26.** Podtytuł bazy wiedzy zmieniony (PL+EN)
- [x] **27.** Stopka: 4 linki prawne dodane (`.contact__legal`) na **wszystkich stronach PL i EN**
      (11+11 plików). Utworzono strony-zaślepki: `polityka-prywatnosci.html`, `regulamin-strony.html`,
      `regulamin-szkolen.html`, `regulamin-sklepu.html` + EN: `privacy-policy.html`, `site-terms.html`,
      `course-terms.html`, `shop-terms.html`. Treść: placeholder „dokument w przygotowaniu" +
      kontakt — **do zastąpienia realną treścią od Gaby**.

Zweryfikowane lokalnym serwerem + Playwright (zrzuty PL/EN hero, oferta, stopka, strony prawne) —
zero błędów konsoli, zero nieudanych requestów. Naprawiono przy okazji bug: strony prawne dziedziczyły
`aria-current="page"` z `o-nas.html`/`about.html` — usunięte.

### 1B. Kalendarz (dawniej Wydarzenia) — `wydarzenia.html` — ✅ ZROBIONE 2026-08-18

- [x] **1.** Usunięto „Miejsce na liście potwierdzamy mailowo" z lidu strony (PL+EN).
      Zostawiono analogiczne zdanie WEWNĄTRZ dialogu zapisu (`bk__form-note`) — to inny,
      bardziej szczegółowy tekst, nie ten wskazany w PDF do usunięcia.
- [x] **2.** Hover na wierszu → bounded thumbnail (`.ev__thumb`, `clamp(130px,15vw,190px)`,
      proporcja 16:10) z czarnym gradientem od dołu, **nie rozciągnięty na cały pasek**
      (dosłownie zgodnie z uwagą klienta). Cała belka to jeden `<button>`, więc miniatura
      może na hover przykryć cenę/CTA bez utraty klikalności — cena/CTA płynnie zanikają.
      Wyłączone na mobile (<800px) i dla zakończonych szkoleń.
- [x] **2a.** Filtry nad listą: **miejsce** (budowane dynamicznie z pola `place` wszystkich
      wydarzeń) + **poziom doświadczenia** (4 kanoniczne poziomy + „Wszystkie"). Reużyto
      komponentu `.tfilter` z Bazy wiedzy. Grupy miesięcy chowają się automatycznie gdy
      wszystkie wydarzenia w nich odfiltrowane; licznik „X terminów" przelicza się na
      żywo; dodano stan „brak wyników" (`#calEmpty`).
- [x] **3.** „Cena" → **„Cena szkolenia"** (EN: „Price" → „Course price")
- [x] **4.** Ujednolicono poziomy doświadczenia we WSZYSTKICH miejscach (filtr, select
      w formularzu, etykieta w dialogu) do jednej kanonicznej listy z PDF. Każde z 14
      wydarzeń w `js/booking.js` przemapowane na `levelKey` (KRAKEN-26 zostaje bez klucza
      — to zaproszenie/kwalifikacja, nie mieści się w standardowej skali, widoczne tylko
      przy filtrze „Wszystkie" — świadoma decyzja, nie błąd).
- [x] **5.** Suwaki w formularzu jako pary przycisków (reużywają `.tfilter`): broń
      własna/wynajem (+cena), wyposażenie własne/wynajem (+cena), prawo-/leworęczność.
      **Ceny wynajmu to placeholdery** (`WEAPON_RENTAL_DEFAULT=100 zł`,
      `GEAR_RENTAL_DEFAULT=50 zł` w booking.js) — do podmiany na realny cennik od klienta.
- [x] **6.** Etykieta uwag zaktualizowana (PL+EN)
- [x] **7.** Checkbox oświadczenia o niekaralności — pełna treść z PDF (PL+EN)
- [x] **8.** Pole na kod rabatowy — zbierane do treści zgłoszenia; **bez walidacji
      serwerowej** (nie ma jeszcze backendu — patrz decyzje CMS/płatności)
- [x] **9.** Dynamiczne „RAZEM DO ZAPŁATY" — liczy się na żywo z ceny szkolenia + wybranych
      dodatków (broń/wyposażenie), przelicza się przy każdej zmianie suwaka
- [x] **10.** Sekcja PŁATNOŚĆ z pełnym opisem zaliczki 50% z PDF, link do Regulaminu sklepu
- [x] **11.** Wybór zaliczka (50% ceny SAMEGO szkolenia, bez dodatków — dosłowne
      brzmienie PDF) / pełna cena (szkolenie + dodatki, ten sam total co pkt 9) + select
      metody płatności (BLIK/Przelewy24/PayU/Karta)
- [x] **12.** Checkbox braku prawa odstąpienia — pełna treść z PDF
- [x] **13.** Checkbox akceptacji Regulaminu Sklepu i Polityki Prywatności (NOWY, linkuje
      do stron z etapu 1A). Istniejący wcześniej checkbox zgody RODO (przetwarzanie danych
      osobowych) **zachowany bez zmian** — to osobna podstawa prawna, nie duplikat.
- [x] **14.** „WYŚLIJ ZGŁOSZENIE" → **„ZAPŁAĆ I ZAPISZ SIĘ NA SZKOLENIE"** (PL) /
      „Pay and sign up for the course" (EN)

**Decyzja architektoniczna:** usunięto starą infrastrukturę osobnego przycisku
„Zapłać zaliczkę online" (`PAY_LINKS`/`bkPayBtn`, nieaktywna od początku — pusty słownik
linków). Zastąpiona jednym, spójnym przepływem: wybór zaliczka/pełna cena + metoda
płatności → jeden przycisk „ZAPŁAĆ I ZAPISZ SIĘ", który dziś (bez operatora) wysyła
mailto ze wszystkimi zebranymi danymi (w tym wybraną kwotą i metodą płatności). Gdy
pojawi się operator, wystarczy podmienić handler submit na przekierowanie do bramki —
UI i zbieranie danych są już gotowe (dokładnie zgodnie z decyzją „kod pisany tak, by
podpiąć operatora bez przepisywania").

Zweryfikowane Playwright (PL+EN): 14 wydarzeń renderuje się poprawnie, filtry miejsce+poziom
dają matematycznie poprawne przecięcia (np. Wrocław=6, Wrocław+Początkujący=2), stan „brak
wyników" działa, hover-thumbnail pokazuje ograniczoną miniaturę z gradientem, kalkulacja ceny
poprawna (250 zł + 100 zł wynajmu = 350 zł, zaliczka 125 zł = 50% z 250 zł), zero błędów konsoli.

### 1C. Szkolenia (dawniej Oferta) — `oferta.html` — ✅ ZROBIONE 2026-08-18

- [x] **1.** Cała sekcja modułów przebudowana na akordeon wg mockupu z PDF: 4 kategorie
      (Moduł strzelecki — domyślnie rozwinięty, Moduł taktyczny, Moduł specjalistyczny,
      Wszystkie szkolenia — alfabetycznie), filtry nad akordeonem: Poziom doświadczenia,
      Tryb realizacji, Miejsce, Cena (domyślnie/rosnąco/malejąco). Zbudowane natywnymi
      `<details>` (dostępność, brak zbędnego JS do samego rozwijania) + nowy `js/products.js`
      renderujący całość z jednego źródła danych (23 produkty). Filtry reużywają komponent
      `.tfilter` z Bazy wiedzy/Kalendarza.
- [x] **2.** Klik w produkt rozwija pełny opis, program, wymagania — **treści ściągnięte
      z per-produktowych podstron peruntac.pl przez WebFetch** (nie zmyślone), patrz niżej.
      Na końcu przycisk zapisu: dla produktów bez ustalonego terminu otwiera dialog
      „Zapytaj o termin" (uproszczony formularz jak w kalendarzu, bez daty/płatności —
      submit wysyła mailto); dla produktów z realnym terminem w kalendarzu (Vehicle Tactics
      poziom 1, Breaching) przycisk linkuje wprost do `wydarzenia.html?ev=<id>`, co otwiera
      PEŁNY dialog zapisu z kalendarza (deep-link już istniał w `booking.js`, tylko go
      spięto). Naprawiony po weryfikacji bug: te dwa produkty miały dwa identycznie
      podpisane przyciski — teraz pokazuje się tylko jeden, właściwy.
- [x] **3.** Poziomy doświadczenia — te same 4 kanoniczne wartości co w kalendarzu
- [x] **4.** Tryb realizacji jako filtr: Otwarty / Trening 1:1 / Grupy zamknięte / Dla instytucji
- [x] **5.** Filtr miejsca — budowany dynamicznie z produktów + zawsze zawiera „Do wyboru"
- [x] **6.** Moduł strzelecki — 8 produktów, wszystkie z pełnym opisem/programem/wymaganiami
      ściągniętym z peruntac.pl (Treningi indywidualne, OTS, Pistolet podstawowy/zaawansowany,
      Karabinek podstawowy/zaawansowany, Mid Range, Long Range)
- [x] **7.** Moduł taktyczny — 11 produktów: SUM poziom 1 (pełny opis z peruntac.pl) + poziomy
      2-4 (**„opis w przygotowaniu" — SUM2-4 nie istniały jeszcze na starej stronie**),
      Vehicle Tactics poziom 1+2 (pełne opisy, poziom 1 spięty z realnym terminem),
      CPO, PSD, CCW, AOP (pełne opisy), NVS (**„opis w przygotowaniu" — strona 404 na
      peruntac.pl**)
- [x] **8.** Moduł specjalistyczny — 4 produkty: Breaching (pełny opis, spięty z realnym
      terminem), HEAT (pełny opis), Low Pro Operations/LRO (**placeholder — to nowy produkt,
      PDF wprost mówi że opis dośle klient**), TCCC (**„opis w przygotowaniu" — strona 404
      na peruntac.pl, tak jak NVS**)
- [x] **9.** Tryby realizacji: dodano 4. tryb „Dla instytucji" (nowy, z opisem z PDF),
      zaktualizowano opis „Indywidualny", „Otwarty"/„Dedykowany" bez zmian (zgodnie z PDF)
- [x] **10.** „Zaufany partner biznesowy" — zaktualizowany opis (dodano „przygotowanie i"),
      dodano przycisk „Przejdź do Perun SEC →" obok istniejącego „Zapytaj o współpracę"

### 1D. Baza wiedzy — `baza-wiedzy.html` + artykuły — ✅ ZROBIONE 2026-08-18

- [x] **1.** Nowy opis nagłówka strony (PL+EN)
- [x] **2.** Nowy opis „Treningi i materiały edukacyjne" (PL+EN)
- [x] **3.** Nowy opis „Cele strzeleckie" (PL+EN)
- [x] **4.** Standardy i drille — bez zmian
- [x] **5.** Artykuły: hover na wierszu pokazuje teraz pełne zdjęcie w tle wiersza z
      gradientem od lewej (`.kb__bg`, ten sam wzorzec co `.offer__bg` na stronie głównej),
      zamiast starej "pływającej" miniaturki przy kursorze (mechanika `kbThumb` zostawiona
      tylko na stronie głównej, gdzie klient jej nie kwestionował)
- [x] **6.** W artykule: **spis treści po lewej** (`.art-toc`), sticky, z podświetlaniem
      aktualnej sekcji podczas scrollowania (IntersectionObserver w `js/main.js`).
      Zaimplementowane automatycznie dla wszystkich 5 artykułów PL + 5 EN (id generowane
      z treści `<h2>`). Pod 1080px szerokości TOC jest ukryty (sam artykuł wraca do
      wyśrodkowanego układu jednokolumnowego)
- [x] **7.** Zdjęcia w artykułach już korzystają ze wspólnego, zoptymalizowanego
      mechanizmu `.page-hero__media img { object-fit:cover }` — bez dodatkowych zmian,
      nic tu nie było przycięte źle
- [x] **8.** „Cele do wydruku" — nowy opis (PL+EN). *Założenie: PDF miał literówkę
      OCR („rozwiąż" zamiast „rozwiń") — użyto „rozwiń swój trening"*
- [x] **9.** Sekcja Cele przebudowana na siatkę wizualnych kart (`.tgrid`) — miniatura +
      nazwa + typ pliku. Klik otwiera dialog (`js/targets.js`) z większym podglądem,
      opisem i przyciskiem pobrania. Dla tarcz JPG/PNG podgląd to realne zdjęcie; dla tarcz
      PDF (brak pliku graficznego do podglądu) użyto spójnego z marką placeholdera
      (koncentryczne kręgi + etykieta dystansu) zamiast fabrykować nieistniejące zdjęcie
      produktu. Zrobione PL+EN.
      **Poprawka z 2026-08-18 (po komentarzu klienta):** usunięty link „Wszystkie cele"
      wyprowadzający na starą stronę peruntac.pl/cele-strzeleckie — zamiast tego cała
      biblioteka **46 celów** (6× 1 MOA, 18× T-box, 6× IPSC, 7× IDPA, 8× specjalistyczne,
      1× sylwetkowy) jest teraz renderowana bezpośrednio na tej stronie, dane pobrania
      wyciągnięte ze starej strony przez WebFetch (prawdziwe URL-e plików na
      peruntac.pl/lib/…). Dodano filtr kategorii (`.tfilter`, 7 pigułek: Wszystkie/1 MOA/
      T-box/IPSC/IDPA/Specjalistyczne/Sylwetkowy). Cele przeniesione z surowego HTML do
      jednego źródła danych w `js/targets.js` (ten sam wzorzec co `EVENTS`/`EVENTS_EN`
      w `js/booking.js`) — grid renderowany w całości przez JS, PL bazowy + nakładka EN.
      **Poprawka wysokości okna (2026-08-18):** pionowe zdjęcia (np. portrety T-box
      2480×3508) rozciągały dialog znacznie ponad ramkę PDF-ów — chowały opis i przycisk
      pobrania pod krawędzią ekranu. Przyczyna: flex item bez `min-height:0` używa
      naturalnych proporcji obrazka do wyliczenia automatycznego minimalnego rozmiaru,
      ignorując `aspect-ratio` kontenera. Dodano `min-height:0; overflow:hidden` do
      `.tgt__media` — JPG/PNG/PDF mają teraz identyczną wysokość okna (4:3) niezależnie
      od orientacji źródłowego zdjęcia.
      **Poprawka koloru nazw (2026-08-18):** nazwy celów pod miniaturami renderowały się na
      czarno. Przyczyna: `.tgrid__item` to element `<button>`, a przeglądarki nie dziedziczą
      do niego koloru tekstu z ciemnego motywu strony bez jawnego `color` (każdy inny
      przycisk w serwisie — `.btn--signal`, `.btn--ghost`, `.bk__close`, `.tgt__close` —
      już to ustawiał; tego jednego brakowało). Dodano `color: var(--ink)` do `.tgrid__item`.
- [x] **10.** Usunięto „PLIKI HOSTOWANE NA PERUNTAC.PL" z notatki pod drillami (PL+EN)

Zweryfikowane Playwright: hover-gradient na wierszach artykułów, lightbox celów (PDF i JPG),
spis treści + scroll-spy (poprawiony po pierwszej wersji — patrz niżej), zero błędów konsoli.

**Uwaga do przyszłej sesji:** pierwsza wersja scroll-spy podświetlała sekcję tylko, gdy sam
nagłówek `<h2>` był w wąskim pasku widoku — większość czasu czytania (akapity między
nagłówkami) nic nie było podświetlone. Poprawione na wzorzec „trzymaj podświetlenie do
następnego nagłówka" (`rootMargin:"0px 0px -80% 0px"`, reaguje tylko na wejście, nie na
wyjście z paska).

### 1E. O nas — `o-nas.html` — ✅ ZROBIONE 2026-08-18

- [x] **1.** „Nie oferujemy zabawy w komandosów" → **„Nasza misja"** (PL+EN)
- [x] **2.** Usunięto `<figcaption>` „NOC // NVG" ze zdjęcia w sekcji METODOLOGIA (PL+EN)

### 1F. Kontakt — bez zmian

### 1G. Przekrojowe

- [ ] Wszystkie zmiany tekstowe zduplikować w mirrorze **`en/`** (12 plików)
- [ ] Nowe strony prawne (4) + ich wersje EN
- [ ] Szablon artykułu-relacji z wydarzenia (PT/001…007)

---

## ETAP 2 — PERUN SEC jako osobna strona (perunsec.com) — ✅ ZBUDOWANE 2026-08-18

Nowy katalog **`perunsec/`** (poza `peruntac-v3/`), EN jako język domyślny, PL w `perunsec/pl/`.
Szczegóły techniczne i checklista cutoveru: **`perunsec/README.md`**.

- [x] Wydzielony projekt: `perunsec/index.html` (EN) + `perunsec/pl/index.html`, własne
      `css/`, `js/`, `assets/`. CSS i `main.js` to **kopie** wspólnej bazy (osobny deploy
      musi być samowystarczalny) + blok „PERUN SEC" doklejony na końcu arkusza.
      ⚠️ Zmiany we wspólnych stylach trzeba odtąd przenosić ręcznie w obie strony.
- [~] **Logo Perun Sec** — placeholder: wspólny znak Perun + typograficzny napis
      „Perun Sec" (`.nav__logo--sec`), żeby nagłówek nie mówił „Perun Tac". **Czekamy
      na plik logo od klienta.**
- [x] Kursor: zwykły systemowy — świadomie pominięty `<div id="cursor">`; `js/main.js`
      sam się wyłącza bez tego elementu, więc nie trzeba było forkować skryptu
- [x] Przycisk „Szkolenia Perun Tac / Perun Tac training ↗" → peruntac.pl (nav + menu mobilne)
- [x] Hero: zdjęcie z Bagdadu + nowy opis PL/EN dosłownie z PDF
- [x] Pasek „kontrola, dyskrecja, gotowość…" usunięty (marquee nie przeniesiony)
- [x] Nagłówek wstępu „Ochrona to nie obecność…" / „Protection is not presence…" + pełny
      nowy tekst wstępu, PL i EN
- [~] Zdjęcia: hero ma nowe (Bagdad), reszta to **tymczasowo zdjęcia z Perun Tac** —
      czekamy na materiał z Google Drive
- [x] **Zakres usług — 13 pozycji ciągiem** (nie 14; moja wcześniejsza notatka miała
      błąd zliczenia — lista w PDF ma 13 usług), opisy **tylko po angielsku również
      na stronie PL**, dokładnie jak prosił klient („Zostawiam opis tylko po angielsku").
      Na stronie PL dodano nad listą adnotację `// OPISY USŁUG W JĘZYKU ANGIELSKIM`,
      żeby to nie wyglądało na przeoczenie.
- [x] Sekcja „Jak pracujemy" usunięta w całości
- [x] „Ochrona z doświadczeniem operacyjnym" → **„Perun Intelligence & Operations
      Centre — IOC"** z pełnym opisem z PDF
- [x] „Dlaczego Perun" → **„IOC 24/7"**; stara tabelka zastąpiona panelem statusu IOC
      (Dostępność / Monitoring / Środowisko / Produkt / Wsparcie)
- [x] **Mapa świata z 20 punktami** — kontur wygenerowany w czasie budowania z danych
      Natural Earth 110m (`world-atlas`, domena publiczna), uproszczony do ~35%
      wierzchołków, bez Antarktydy, kadr przycięty do zamieszkanych szerokości
      (~21 KB ścieżki). Punkty to **prawdziwe centroidy krajów** rzutowane tą samą
      projekcją, więc kropki leżą tam, gdzie faktycznie są państwa — nie rysowane
      „na oko". Kropki i lista krajów podświetlają się nawzajem na hover; lista jest
      dostępnościowym źródłem prawdy, SVG jest dekoracyjny. Regeneracja: `genmap3.mjs`.
- [x] „Porozmawiajmy o bezpieczeństwie" → „Napisz do nas po darmową konsultację i ofertę."
      + pełny formularz kontaktowy (imię, firma, e-mail, telefon, zakres, wiadomość, RODO)
- [~] Osobny e-mail: strona używa **`info@perunsec.com` (założenie)** — do potwierdzenia
      i ewentualnej podmiany w 3 miejscach (patrz README)
- [x] **Linki z Perun Tac przepięte na nowy serwis (2026-08-18)** — klient zgłosił, że
      klikanie „Perun Security" otwiera starą wersję. Wszystkie **54 linki** (nawigacja,
      menu mobilne, panel Sec w hero, przycisk w Ofercie; PL i EN) prowadzą teraz do
      `perunsec/index.html` (ze stron w `en/`: `../perunsec/index.html`). Stare
      `perun-security.html` i `en/perun-security.html` zamienione na strony
      przekierowujące (meta refresh + `location.replace` + `noindex`), żeby zakładki
      i zaindeksowane adresy nie serwowały nieaktualnej treści. Ścieżki względne, więc
      działa lokalnie, na GitHub Pages i na Cloudflare.
- [ ] **Cutover na własną domenę** — gdy perunsec.com zacznie odpowiadać: podmienić
      ścieżki względne na `https://perunsec.com/` i dodać 301 dla `peruntac.pl/perunsec/`,
      żeby nie było duplikatu treści. Kroki w `perunsec/README.md`.
- [ ] Deploy: osobny projekt Cloudflare Pages (root = `perunsec/`) + DNS perunsec.com

Zweryfikowane Playwright (EN + PL): 13 usług, 20 punktów mapy i 20 pozycji listy,
nazwy krajów lokalizowane (Afganistan/Egipt vs Afghanistan/Egypt), brak celownika
(`has-cursor` nieustawione), zero błędów konsoli, zero przepełnień poziomych.

---

## ETAP 3 — Panel CMS

Cel z PDF: **system dodawania szkolenia jako template**. Pola: nazwa, kategoria modułu,
poziom, cena, miejsce, data rozpoczęcia i zakończenia, godzina, szczegóły, opis,
wymagane wyposażenie, opcje do wyboru przy zakupie, treść maila po rejestracji.
Po zapisaniu produkt **automatycznie pojawia się w kalendarzu i w ofercie**.

**Uwaga do wymagania z PDF:** klient opisuje to jako JEDEN formularz, który ląduje
i w kalendarzu, i w ofercie. Po rozmowie (2026-08-18) rozbiliśmy to na dwa typy treści,
bo inaczej opis Vehicle Tactics trzeba by przepisywać przy każdym nowym terminie,
a poprawka literówki oznaczałaby edycję wszystkich wpisów. Efekt dla klienta jest ten sam
(dodaję termin → pojawia się w kalendarzu i przy szkoleniu w ofercie), tylko bez duplikacji.

### Ustalenia z brainstormingu (2026-08-18)

| Pytanie | Ustalenie |
|---|---|
| Kto edytuje | Kilka osób, w tym jedna techniczna |
| Model danych | SZKOLENIE (evergreen) + TERMIN (data/miejsce/cena), termin wskazuje szkolenie |
| Języki | Pola EN opcjonalne; brak EN → strona angielska pokazuje treść PL |
| Zakres | Szkolenia, terminy, relacje PT/001–007, galeria home, artykuły Bazy wiedzy |
| Poza zakresem | Cele strzeleckie (46 poz.), maile po rejestracji (to etap 3B) |
| Technologia | **NIEROZSTRZYGNIĘTE** — wariant A (Sveltia/git) vs B (Workers + D1) |

### Kroki implementacji (po wyborze technologii)

- [ ] **Krok 1 — migracja danych** (niezależny od wyboru A/B, można robić od razu):
      `js/booking.js` → `data/terms.json`, `js/products.js` → `data/products.json`,
      przepiąć renderery na `fetch()` zamiast tablic w kodzie. To rozbija dzisiejszą
      duplikację produkt ↔ termin i jest warunkiem dla obu wariantów.
- [ ] Krok 2 — schemat treści (pola, walidacja, wymagane vs opcjonalne)
- [ ] Krok 3 — panel: logowanie, lista, edytor, upload zdjęć, publikacja
- [ ] Krok 4 — podgląd przed publikacją
- [ ] Krok 5 — instrukcja obsługi dla zespołu klienta (PL, ze zrzutami)

### ETAP 3B — Płatności i automatyzacja (osobny, największy blok)

- [ ] Integracja płatności (zaliczka 50% / pełna kwota, kody rabatowe)
- [ ] Mail do klienta: potwierdzenie + rachunek elektroniczny
- [ ] Mail do Piotrka o nowym zapisie
- [ ] Automatyczne przypomnienie 2 dni przed szkoleniem (mail + SMS)

---

## Decyzje do podjęcia (otwarte)

0. **⚠️ TECHNOLOGIA CMS — wariant A (Sveltia/git, konta GitHub) czy B (Workers + D1,
   logowanie hasłem)?** To blokuje start Etapu 3. Pełne porównanie na górze dokumentu.
1. **Operator płatności** — Przelewy24 / PayU / Stripe. Do ustalenia przed etapem 3B.
2. **Nazwa i skrzynka e-mail w domenie perunsec** — kto zakłada, gdzie hostowana.
   (Uwaga: mail peruntac.pl jest u WebWave — patrz `WEBWAVE-MIGRATION.md`.)
3. **Trening 1:1 vs „indywidualne"** — klient sam nie był pewien nazwy (Oferta, pkt 4a).

## Czekamy na materiały (klient)

- Zdjęcia PT/004 (Gryf-26), PT/005 (Mid Range), PT/006 (Long Range), PT/007 (NVG) — Piotrek
- Relacje/artykuły z wydarzeń PT/001–PT/007 — Piotrek
- Opis produktu **LOW PRO OPERATIONS (LRO)** — Piotrek
- Polityka prywatności, regulamin strony, regulamin sklepu, regulamin szkoleń,
  treść maila z potwierdzeniem płatności — Gaba
- Logo Perun Sec (plik wektorowy/PNG)
- Zdjęcia na Perun Sec (Google Drive — link w PDF; mamy na razie 1 zdjęcie)
- Cennik wynajmu broni i wyposażenia obowiązkowego

## Dziennik zmian

| Data | Co zrobiono |
|---|---|
| 2026-08-18 | Analiza PDF z poprawkami, utworzenie tego dokumentu, plan etapów |
| 2026-08-18 | Etap 1A gotowy: wszystkie poprawki copy na stronie głównej (pkt 1–27 z PDF, poza 25b), PL+EN, zweryfikowane w przeglądarce (Playwright) |
| 2026-08-18 | Etap 1E gotowy: O nas (misja, usunięcie NVG caption), PL+EN |
| 2026-08-18 | Etap 1D gotowy: Baza wiedzy — teksty, hover-gradient na artykułach, spis treści + scroll-spy w 10 plikach artykułów, siatka+lightbox dla celów do druku (nowy `js/targets.js`), PL+EN. Podmieniono zdjęcie hero na `perun-security.html` (PL+EN) na `sec-baghdad.jpg` dla spójności z home |
| 2026-08-18 | Poprawka celów do druku: klient nie chciał przekierowania na starą stronę — dociągnięto pełną bibliotekę 46 celów (T-box, IPSC, IDPA i inne) bezpośrednio do siatki, z filtrem kategorii |
| 2026-08-18 | Etap 1B gotowy: kalendarz — filtry miejsce/poziom, hover-thumbnail na wierszach, suwaki broń/wyposażenie/ręka, kod rabatowy, dynamiczny total, sekcja płatności z wyborem zaliczka/pełna cena, 3 nowe checkboxy prawne, ujednolicone poziomy doświadczenia w 14 wydarzeniach. Zastąpiono nieaktywną infrastrukturę osobnego przycisku płatności jednym spójnym flow (submit → mailto dziś, gotowy pod podpięcie operatora) |
| 2026-08-18 | Etap 1C gotowy: Oferta przebudowana na akordeon 23 produktów (nowy `js/products.js`), filtry poziom/tryb/miejsce/cena, treści realnych opisów/programów ściągnięte z per-produktowych podstron peruntac.pl przez WebFetch, dialog „Zapytaj o termin", deep-link do kalendarza dla produktów z realnym terminem, nowy tryb „Dla instytucji", przycisk do Perun SEC. **Cały Etap 1 (poprawki Perun Tac) zamknięty.** |
| 2026-08-18 | Bugfix (zgłoszony przez klienta): filtry w Ofercie (poziom/tryb/miejsce/cena) nie przełączały wizualnie aktywnego przycisku po kliknięciu — dane i lista produktów aktualizowały się poprawnie, ale podświetlenie zostawało na „Wszystkie"/„Domyślnie". Przyczyna: klik-handler wywoływał tylko `render()` (przerysowanie listy produktów), nigdy nie przełączał klasy `.is-active` na samych przyciskach filtra. Naprawione w `js/products.js` — ten sam plik obsługuje PL i EN, więc poprawka działa w obu wersjach językowych. |
| 2026-08-18 | **Perun Sec = tylko angielski** (decyzja klienta, zmiana względem PDF, który mówił „angielski język domyślny"): usunięty przełącznik PL/EN z nawigacji (w jego miejsce numer telefonu, którego tam brakowało, a Perun Tac go ma) oraz `hreflang` dla PL z `<head>`. Katalog `perunsec/pl/` **nie został skasowany** — zostaje jako archiwum tłumaczeń, ale dodano `perunsec/_redirects` z regułą 301 `/pl/* → /`, żeby nie serwował się i nie indeksował. Jeśli PL na pewno nie wróci, katalog i reguły można usunąć. |
| 2026-08-18 | Poprawki Perun Sec (klient): **(a) formularz kontaktowy się rozjeżdżał** — był samotną kolumną 620px w sekcji szerokiej na 1296px (~700px martwej przestrzeni po prawej), a tel/e-mail lądowały daleko pod nim. Przebudowany na dwie kolumny (`.seccontact`): po lewej nagłówek + opis + bezpośrednie kontakty, po prawej formularz w obramowanym panelu; krótkie pola (imię/firma, e-mail/telefon) parują się po dwa, select/textarea/zgoda/przycisk idą na pełną szerokość. Nagłówek `.contact__title` zmniejszony w tym kontekście (globalny rozmiar był liczony pod pełną szerokość). Breakpointy: 1 kolumna <980px, pola jednokolumnowo <560px. **(b) Mapa** — dodany tooltip wychodzący z kropki (pozycjonowany z realnego bounding boxa okręgu, więc trzyma się kropki przy każdym skalowaniu; nazwa lokalizowana PL/EN) + bardzo subtelna niebieska poświata podążająca za kursorem, wyłącznie w obrębie mapy (8% signal, wyłączona przy `prefers-reduced-motion`). Zweryfikowane PL+EN na 1440/1100/980/700/390px — zero błędów, zero przepełnień, żadne pole nie wychodzi poza panel. |
| 2026-08-18 | **Etap 2 zbudowany:** nowy samodzielny serwis `perunsec/` (EN domyślnie + `pl/`), wszystkie zmiany treści z PDF, 13 usług, sekcja IOC 24/7, formularz kontaktowy, zwykły kursor, przycisk do peruntac.pl. Mapa świata z 20 punktami wygenerowana z Natural Earth (build-time → statyczny SVG, prawdziwe centroidy krajów). Cutover linków i deploy świadomie wstrzymane do czasu uruchomienia domeny — checklista w `perunsec/README.md` |
| 2026-08-18 | Poprawka (klient): hover-thumbnail w kalendarzu zasłaniał cenę i przycisk zapisu. Przeprojektowane w `css/style.css` (`.ev__thumb`) — zdjęcie jest teraz pełnym tłem wiersza (`z-index:-1`, pod tekstem), z gradientem zaczynającym się od strony daty (lewo) i w pełni ciemniejącym do koloru tła jeszcze przed kolumnami cena/CTA (stop na 58% szerokości) — te dwie kolumny są zawsze w pełni widoczne, bez zanikania opacity jak poprzednio. ✅ **Zweryfikowane 2026-08-18** (Playwright: opacity ceny i CTA = 1 na hover, zrzut potwierdza czytelność). |
| 2026-08-18 | Motion + fix formatowania w akordeonie Oferty (zgłoszone przez klienta). **(a) Motion** wg skilla `motion-design`: hover-highlight wierszy produktów w języku spójnym z resztą serwisu (`.ev`, `.kb__row`, `.offer__row`) — wash tła wjeżdżający od dołu, zielona belka sygnałowa na lewej krawędzi, nazwa przesuwa się w prawo, cena zmienia kolor na `--signal`. Sam wiersz się NIE rusza (kursor nie może wypaść z własnego hit-area). Dochodzi reveal treści po rozwinięciu (`prod-reveal`) + delikatny stagger pozycji programu/wymagań (`--i` ustawiane w `js/products.js`, opóźnienie capowane na 10 pozycji, żeby Long Range z 17 punktami nie ciągnął się w nieskończoność) oraz hover na nagłówku kategorii (wash + subtelny zoom miniatury). Hover-y opakowane w `@media (hover: hover)`; blok `prefers-reduced-motion` dostał też `animation-delay: 0s !important` (sam catch-all na duration nie kasował opóźnień staggera). **(b) Fix formatowania:** nagłówek produktu był `flex-wrap` i przy ~900-1150px rozsypywał się — chevron spadał do osobnej linii jako sierota, cena kleiła się do krawędzi, a najwyższy wiersz (TCCC) puchł do 131px. Przepisane na deterministyczny grid z `grid-template-areas` (cena+chevron trzymają stały prawy rail; nazwa i tagi w elastycznej lewej kolumnie), jedna linia dopiero od 1280px, a poniżej 620px pełne stackowanie (tagi i cena dostają własne rzędy — wcześniej `white-space: nowrap` na tagach powodował nachodzenie na cenę przy 390px). Dodatkowo produkty otwarte na 3+ poziomów pokazują teraz „Wszystkie poziomy" zamiast wyliczanki (użyto istniejącego, nieużywanego stringa `T.everyLevel`) — to samo zbijało wysokość wiersza. Efekt: najwyższy nagłówek 152px → 79px. Zweryfikowane PL+EN na 1440/1240/1024/900/820/620/480/390px, zero błędów konsoli, zero przepełnień poziomych. |
