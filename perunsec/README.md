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

## Cutover — do zrobienia DOPIERO gdy perunsec.com odpowiada

Celowo jeszcze NIE przełączone, żeby nie zrobić martwych linków na żywej
stronie peruntac.pl:

1. `peruntac-v3/index.html` + `peruntac-v3/en/index.html` — panel Sec w hero
   (`.split__panel--sec`) linkuje do `perun-security.html` → zmienić na
   `https://perunsec.com/`.
2. `peruntac-v3/oferta.html` + `peruntac-v3/en/training.html` — przycisk
   „Przejdź do Perun SEC" / „Go to Perun SEC" → `https://perunsec.com/`.
3. Nawigacja główna (wszystkie strony PL i EN) — pozycja „Perun Security”
   → `https://perunsec.com/`.
4. `peruntac-v3/perun-security.html` i `en/perun-security.html` → 301 na
   `https://perunsec.com/` (przekierowanie w `_redirects` Cloudflare Pages).

## Czeka na materiały od klienta

- **Logo Perun Sec** — na razie placeholder: wspólny znak Perun + typograficzny
  napis „Perun Sec" (`.nav__logo--sec` / `.nav__wordmark` w CSS). Podmienić na
  dostarczony plik.
- **Zdjęcia** — mamy tylko jedno nowe (Bagdad, w hero). Reszta to tymczasowo
  zdjęcia z Perun Tac. Link do Google Drive jest w PDF klienta.
- **Skrzynka e-mail w domenie perunsec** — strona używa `info@perunsec.com`
  (założenie); potwierdzić realny adres i go podmienić w `index.html`,
  `pl/index.html` oraz `js/secform.js`.
