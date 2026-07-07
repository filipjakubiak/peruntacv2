# Perun — strona (peruntac-v3)

Statyczna witryna marki **Perun**: dywizja szkoleniowa **Perun Tac** (szkolenia strzeleckie, taktyczne, specjalistyczne) oraz dywizja ochrony **Perun Security** (ochrona osobista / VIP / close protection).

Cinematic night-ops: carbon black, bone-white, olive, jeden kolor sygnałowy (zieleń dla Tac, stalowy błękit dla Sec). Bez build-stepu — czysty HTML/CSS/JS, GSAP + Lenis z CDN.

## Struktura

| Ścieżka | Opis |
|---|---|
| `index.html` | Strona główna — split-hero Tac/Sec, oferta, misja, galeria, Instagram, baza wiedzy, kontakt |
| `perun-security.html` | Dywizja ochrony (motyw stalowy `theme-sec`) — usługi, proces, kontakt |
| `wydarzenia.html` | Kalendarz szkoleń + okno zapisów z zaliczką (deep-link `?ev=<id>`) |
| `oferta.html`, `o-nas.html`, `baza-wiedzy.html`, `kontakt.html` | Podstrony |
| `artykul-*.html` | Artykuły bazy wiedzy |
| `css/style.css` | Design system (tokeny OKLCH, komponenty) |
| `js/main.js` | Motion system (loader, reveals, split-hero, ScrollTrigger, kursor) |
| `js/booking.js` | Kalendarz wydarzeń, dialog zapisów, zaliczka |
| `js/instagram.js` | Grid ostatnich postów IG (kuratorowany, gotowy pod API) |
| `assets/` | Zdjęcia i logotypy |

## Uruchomienie

To statyczne pliki — wystarczy dowolny serwer HTTP, np.:

```bash
npx serve .
# lub
python -m http.server 8000
```

Tryb QA: dopisz `?shot=1` do URL — wyłącza animacje i smooth-scroll (statyczny render pod zrzuty).

## Punkty integracji (do uzupełnienia)

- **Płatności** — `PAY_LINKS` w `js/booking.js`: wklej realne linki PayU / Przelewy24 zaliczki per szkolenie.
- **Instagram** — `PT_IG` w `js/instagram.js`: podmiana kuratorowanych postów na żywy feed (widget / Graph API).
- **Perun Security** — treści i zdjęcia to placeholder w głosie marki, do podmiany.

## Stack

HTML5 · CSS (custom properties, OKLCH) · Vanilla JS · [GSAP](https://gsap.com/) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering/) · fonty: Sofia Sans Extra Condensed / Sofia Sans / Chivo Mono.
