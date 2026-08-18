# Perun Sec — perunsec.com

Samodzielna strona dywizji ochrony. Osobny projekt deployowy od `peruntac-v3/`,
mimo że leży w tym samym repo.

## Język: TYLKO ANGIELSKI

Decyzja klienta z 2026-08-18: serwis ma być wyłącznie po angielsku.
Przełącznik PL/EN został usunięty z nawigacji, a `hreflang` dla PL wycięty
z `<head>`.

Katalog `pl/` **został na dysku** (gotowe polskie tłumaczenia treści, gdyby
kiedyś wróciła wersja dwujęzyczna), ale nie jest nigdzie linkowany i nie może
się serwować — `_redirects` przekierowuje `/pl/*` na `/` kodem 301. Jeśli PL
na pewno nie wróci, katalog `pl/` i te dwie reguły można po prostu skasować.

## Struktura

```
perunsec/
  index.html        # EN — jedyna wersja językowa
  _redirects        # 301 /pl/* -> / (osierocony katalog PL)
  pl/index.html     # NIEUŻYWANE — archiwum tłumaczeń, nie serwowane
  css/style.css     # kopia wspólnej bazy Perun + blok "PERUN SEC" na końcu
  js/main.js        # kopia wspólnego main.js (bez zmian)
  js/mapdata.js     # WYGENEROWANY — kontur świata + 20 punktów
  js/worldmap.js    # render mapy + lista krajów
  js/secform.js     # formularz zapytania (mailto, jak reszta projektu)
  assets/           # zdjęcia (kopie z peruntac-v3)
```

`css/` i `js/main.js` są **kopiami** plików z `peruntac-v3/`, bo to osobny
deploy — musi być samowystarczalny. Przy zmianach we wspólnych stylach
trzeba przenieść je ręcznie w obie strony.

## Mapa świata

`js/mapdata.js` jest generowany, nie pisany ręcznie. Źródło: Natural Earth 110m
(paczka `world-atlas`, domena publiczna), uproszczone do ~35% wierzchołków,
bez Antarktydy, kadr przycięty do zamieszkanych szerokości. Punkty to
prawdziwe centroidy krajów rzutowane tą samą projekcją (Natural Earth I),
więc kropki lądują tam, gdzie faktycznie leżą państwa.

Regeneracja (gdy zmieni się lista krajów): skrypt `genmap3.mjs` — wymaga
`npm i world-atlas topojson-client topojson-simplify d3-geo`.

## Deploy (Cloudflare Pages)

Osobny projekt Pages wskazujący na katalog `perunsec/` jako root.
Domena `perunsec.com` + `www` → ten projekt.

## Linkowanie z Perun Tac — stan obecny

✅ **Zrobione 2026-08-18.** Wszystkie 54 linki „Perun Security" na stronie Tac
(nawigacja, menu mobilne, panel Sec w hero, przycisk w Ofercie — PL i EN)
prowadzą teraz do tego serwisu ścieżką względną:

- ze stron w korzeniu repo: `perunsec/index.html`
- ze stron w `en/`: `../perunsec/index.html`

Stare `perun-security.html` i `en/perun-security.html` zostały zamienione na
**strony przekierowujące** (meta refresh + `location.replace` + `noindex`),
żeby zakładki i zaindeksowane adresy nie pokazywały nieaktualnej treści.

Ścieżki względne działają wszędzie tam, gdzie serwis Tac ma w katalogu
głównym podkatalog `perunsec/` — czyli lokalnie, na podglądzie GitHub Pages
i na Cloudflare Pages z rootem `/`.

## Cutover na własną domenę — gdy perunsec.com zacznie odpowiadać

1. Podmienić `perunsec/index.html` → `https://perunsec.com/` oraz
   `../perunsec/index.html` → `https://perunsec.com/` we wszystkich stronach
   Tac (prosty search & replace, 54 wystąpienia).
2. W obu stronach przekierowujących (`perun-security.html`,
   `en/perun-security.html`) podmienić cel na `https://perunsec.com/`,
   a docelowo zastąpić je regułą 301 w `_redirects` projektu Tac.
3. Uwaga na duplikat treści: dopóki projekt Tac ma root `/`, serwis Sec jest
   dostępny również pod `peruntac.pl/perunsec/`. Po uruchomieniu własnej
   domeny dodać tam 301 na `https://perunsec.com/`.

## Czeka na materiały od klienta

- **Logo Perun Sec** — na razie placeholder: wspólny znak Perun + typograficzny
  napis „Perun Sec" (`.nav__logo--sec` / `.nav__wordmark` w CSS). Podmienić na
  dostarczony plik.
- **Zdjęcia** — mamy tylko jedno nowe (Bagdad, w hero). Reszta to tymczasowo
  zdjęcia z Perun Tac. Link do Google Drive jest w PDF klienta.
- **Skrzynka e-mail w domenie perunsec** — strona używa `info@perunsec.com`
  (założenie); potwierdzić realny adres i go podmienić w `index.html`,
  `pl/index.html` oraz `js/secform.js`.
