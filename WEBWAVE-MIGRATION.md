# Migracja peruntac-v3 → peruntac.pl (WebWave)

Stan na 2026-07-11. Cel: podmienić obecną stronę na peruntac.pl (hostowaną
w WebWave) na nowy statyczny build z tego repo — **bez przerwy w działaniu
poczty @peruntac.pl**.

## Ustalenia twarde (zweryfikowane)

| Fakt | Dowód | Konsekwencja |
|---|---|---|
| DNS peruntac.pl stoi na NS Gcore (`ns1.gcorelabs.net` / `ns2.gcdn.services`) | `nslookup -type=NS` | To infrastruktura WebWave — rekordami zarządza się z panelu WebWave, nie u zewnętrznego rejestratora |
| **Poczta @peruntac.pl jest hostowana PRZEZ WebWave** (`MX 10 mail.webwavecms.com`) | `nslookup -type=MX` | Całkowite odejście z WebWave = utrata skrzynki. Konto/plan WebWave musi zostać aktywne niezależnie od wyboru wariantu |
| WebWave **nie importuje** gotowego HTML | [forum WebWave](https://vote.webwave.me/communities/1/topics/142-import-page-andor-site-html-into-webwave) | Nie „wgramy" builda do edytora jednym ruchem |
| WebWave ma elementy HTML/CSS/JS + own code w `<head>` (site-wide i per podstrona) | [help.webwave.me](https://help.webwave.me/html-css-and-javascript), [add-a-customized-code](https://help.webwave.me/add-a-customized-code-to-your-website) | Da się osadzić własny markup/style/skrypty na pustych podstronach |
| Biblioteka plików WebWave serwuje dowolne pliki pod `/lib/v7viiv/…` | działające linki do PDF-ów tarcz na żywej stronie | Assety (zdjęcia, PDF-y) można trzymać w bibliotece i linkować |
| Stara strona ma ~48 podstron PL + ~28 EN (sitemap.xml) | `peruntac.pl/sitemap.xml` | Potrzebna mapa przekierowań 301, inaczej tracimy SEO i żywe linki |

## Zależności nowego builda od starej strony (do rozwiązania PRZED podmianą)

1. **`baza-wiedzy.html` + `artykul-mrds-zero.html`** linkują ~10 plików
   `https://peruntac.pl/lib/v7viiv/*.pdf|jpg` (tarcze 1 MOA, drille FBI/SWAT,
   obrazy). Te pliki żyją w bibliotece OBECNEJ strony WebWave — przy
   przebudowie/nowym projekcie mogą zniknąć.
   → **Akcja:** pobrać wszystkie, dodać do `assets/pliki/` w repo (lub wgrać
   do biblioteki nowego projektu) i przepisać linki na względne.
2. **`baza-wiedzy.html`** linkuje `https://peruntac.pl/cele-strzeleckie`
   (podstrona starej strony). → Odtworzyć treść jako podstronę nowej strony
   albo zostawić 301 na baza-wiedzy.
3. **`kontakt.html` + `wydarzenia.html`** linkują
   `https://peruntac.pl/polityka-prywatnosci`. → Odtworzyć politykę
   prywatności jako stronę nowego builda (wymagana prawnie przy formularzu).

## Wariant A (rekomendowany): hosting poza WebWave, DNS + poczta zostają

Nowa strona w 100 % taka jak w repo (GSAP, Lenis, dialogi — zero kompromisów).

1. Wrzucić repo na statyczny hosting (Cloudflare Pages / Netlify — darmowe,
   auto-SSL, deploy z gita).
2. W panelu WebWave (Ustawienia → Domeny → DNS na NS Gcore) podmienić
   **wyłącznie rekordy A / CNAME dla `@` i `www`** na hosting docelowy.
   **Nie dotykać MX, SPF/TXT, DKIM** — poczta idzie dalej przez
   `mail.webwavecms.com`.
3. Utrzymać plan WebWave obejmujący pocztę (i domenę, jeśli kupiona przez
   WebWave).
4. Przekierowania 301 ze starych slugów konfigurowane na nowym hostingu
   (Cloudflare Pages `_redirects` / reguły) — patrz mapa niżej.

**Warunek wejścia:** dostęp do panelu WebWave z edycją DNS (memory:
nadal niepotwierdzony — do wyjaśnienia z właścicielem). Bez tego wariant A
nie startuje.

**Ryzyka:** literówka w DNS (mitygacja: zrzut wszystkich rekordów przed
zmianą, zmiana tylko A/CNAME, TTL na 5 min na czas cutoveru);
polityka WebWave wiążąca pocztę z aktywnym hostingiem strony — potwierdzić
na czacie supportu przed cutoverem.

## Wariant B: osadzenie builda w edytorze WebWave (custom-code shell)

Gdy dostępu do DNS nie da się uzyskać albo właściciel chce zostać w 100 %
w WebWave.

1. W projekcie WebWave: czysty szablon, usunąć wszystkie elementy.
2. Site-wide `<head>` (Ustawienia → Więcej opcji): fonty Google, minifikowany
   `style.css` (inline `<style>` albo plik w bibliotece), GSAP + Lenis z CDN.
3. Każda strona repo = pusta podstrona WebWave + jeden element HTML
   z całym `<body>` naszej strony; meta/OG per podstrona w jej ustawieniach
   `<head>`.
4. Wszystkie `assets/` → biblioteka plików; przepisać ścieżki na URL-e `/lib/…`
   (skrypt w repo może to zrobić automatem).
5. Testować na ukrytej podstronie zanim podmieni się stronę główną.

**Ryzyka/koszty:** kolizje CSS z builderem (reset WebWave, z-index,
`overflow` przy Lenis i `<dialog>`), edycja przez textarea w edytorze
(utrzymanie bolesne), limity rozmiaru elementu HTML — do sprawdzenia
empirycznie. Fidelity niżej niż w wariancie A.

## Mapa przekierowań 301 (stare → nowe)

```
/oferta, /szkolenia-strzeleckie, /szkolenia-taktyczne, /szkolenia-specjalne,
/pistolet-podstawowy, /pistolet-zaawansowany, /karabinekpodstawowy,
/karabinekzaawansowany, /cqb, /breaching, /vehicletactics, /vehicle-tactics,
/long-range, /midrange, /mid-range-warsztaty, /ccw, /night-vision-shooter,
/taktyczne+działania+linowe, /apl, /cpo, /PSDIC, /sum, /heat, /ots
    → /oferta.html
/nadchodzace-wydarzenia, /nadchodzące_szkolenia, /trening, /zapisnaszkolenie,
/treningiindywidualne, /drilleistandardy, /kraken-26, /fury-26, /gryf-26,
/slav_challenge, /promocjagunsmasters
    → /wydarzenia.html
/bazawiedzy → /baza-wiedzy.html
/jakie-zero-wybrac-do-celownika-mini-red-dot-na-pistolecie → /artykul-mrds-zero.html
/jakie-zero-wybrac-na-karabinek-ar15 → /artykul-zero-ar15.html
/pozytywne-i-negatywne-skutki-stosowania-tlumikow-dzwieku-na-broni-palnej → /artykul-tlumiki.html
/gazy-i-substancje-chemiczne-powstajace-przy-strzelaniu-z-broni-palnej-oraz-ich-wplyw-na-zdrowie → /artykul-gazy.html
/wplyw-wysokosci-montazu-na-„zero"-broni-i-przesuniecie-drugiego-zera-w-optyce → /artykul-wysokosc-montazu.html
/onas → /o-nas.html
/kontakt, /faq → /kontakt.html
/cele-strzeleckie → (odtworzona podstrona) lub /baza-wiedzy.html
/polityka-prywatnosci → (odtworzona podstrona — WYMAGANA)
/en/* → decyzja właściciela: strona EN nie istnieje w v3
        (tymczasowo 301 → / albo utrzymać stare EN do czasu tłumaczenia)
```

Uwaga: przy wariancie B URL-e WebWave nie mają `.html` — wtedy nowe slugi
to `/oferta`, `/wydarzenia` itd. i trzeba zaktualizować `<link rel=canonical>`
oraz `og:url` w podstronach (obecnie wskazują na `…/plik.html`).

## Checklist przed cutoverem (oba warianty)

- [ ] Potwierdzić dostęp do panelu WebWave (login właściciela) i do edycji DNS
- [ ] Zapytać support WebWave: czy poczta działa przy A-rekordach poza WebWave (wariant A) / limity elementu HTML (wariant B)
- [ ] Pobrać i zabezpieczyć wszystkie pliki `/lib/v7viiv/…` linkowane z bazy wiedzy
- [ ] Odtworzyć `polityka-prywatnosci` i (opcjonalnie) `cele-strzeleckie`
- [ ] Wpisać prawdziwe linki PayU/P24 do `PAY_LINKS` w `js/booking.js` (do tego czasu blok płatności jest ukryty — celowo)
- [ ] Podpiąć realny feed IG (Behold/EmbedSocial) albo zostawić kurowaną siatkę
- [ ] Zrzut ekranu/backup obecnej strony WebWave + eksport treści EN
- [ ] Obniżyć TTL DNS przed zmianą, cutover poza godzinami szczytu
- [ ] Po cutoverze: test poczty (wysłać/odebrać @peruntac.pl), test 301, Search Console — nowa sitemapa
