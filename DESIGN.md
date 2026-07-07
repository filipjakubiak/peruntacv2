# Design

## Theme

Cinematic night-ops dark. The scene: a shooter checks the range card under a red headlamp at 02:00 before a night evolution — carbon black, bone-white type, olive undertones from the photography, one storm-cyan signal — the lightning of Perun.

## Color (OKLCH)

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(0.14 0.006 130)` | carbon black body |
| `--bg-raised` | `oklch(0.18 0.008 130)` | raised panels |
| `--ink` | `oklch(0.95 0.008 100)` | bone white text |
| `--ink-dim` | `oklch(0.72 0.012 110)` | secondary text (AA on bg) |
| `--olive` | `oklch(0.56 0.055 125)` | olive drab — borders, quiet accents |
| `--signal` | `oklch(0.74 0.13 142)` | signal green (grassy, military) — the one hot color |
| `--line` | `color-mix(in oklab, var(--ink) 14%, transparent)` | hairlines |

Strategy: **Committed dark monochrome + one signal.** The signal green appears on ≤5% of the surface.

## Typography

- **Display:** Sofia Sans Extra Condensed 700/900, uppercase, tracking `0.01em`, clamp ceiling 6rem. (User asked for "Sofia Pro or matching" — Sofia Sans is the committed family.)
- **Body:** Sofia Sans 400/600, 16–18px, line-height 1.65 (light-on-dark).
- **Data/labels:** Chivo Mono 400/500, 11–13px, uppercase — range-card register (coordinates, dates, indices).
- No serif anywhere. The stencil voice lives only in the logo assets.

## Layout & Space

- Full-bleed photographic sections alternating with contained (`max-width: 1440px`, `clamp(20px, 5vw, 72px)` gutters).
- Offer = full-width interactive rows (not cards). Knowledge base = editorial index list.
- Hairline dividers, corner tick marks (crosshair register) on key frames.

## Motion

- Lenis smooth scroll + GSAP ScrollTrigger (CDN). All gated behind `prefers-reduced-motion`.
- Hero: masked line reveal (clip-path), slow image scale-settle.
- Training photos: infinite drift strip (seamless loop, no pin) — scroll velocity surges the drift's timeScale, then it settles back; edge fade via CSS mask.
- Offer rows: image pane clip-reveal on hover; magnetic CTA buttons; crosshair cursor follower on desktop pointers.
- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) everywhere; durations 0.6–1.2s.

## Assets

`assets/` — all pulled from the original site: `logo.png` (mark+wordmark, dark), `logo-flat.png` (white horizontal wordmark for nav), `hero-1..7.jpg` (2400×584 training photos), `band-wide.jpg` (2400×874 squad photo — hero), `about-1.jpg` (vertical NV operator), `about-2.jpg`, `about-3.png` (branded shooting target), `about-4.jpg`, `article-1..5.jpg` (knowledge-base thumbnails).
