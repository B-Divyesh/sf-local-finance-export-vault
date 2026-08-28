# Visual thesis — The Night Transfer Office

## Direction and product fit

The product uses an **art-deco transit poster** language. Moving financial data
between apps should feel like transferring carefully labelled luggage at a
trusted night station: deliberate, legible, and under the owner's control. A
stepped vault arch, rail-ticket labels, brass rules, and fan-shaped rays turn an
otherwise dry file utility into a recognisable departure desk. Decoration is
limited to wayfinding and archive status; financial rows remain quiet and easy
to scan.

This is a single dark-mode treatment. The midnight field supports the night
station concept, reduces glare around dense tables, and lets cream paper and
brass status marks carry hierarchy without a generic software-dashboard look.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#10191a` | page background |
| `--ink-raised` | `#182526` | panels and table heads |
| `--paper` | `#f3e8cf` | primary text and paper surfaces |
| `--paper-dim` | `#cfc3a7` | muted text |
| `--brass` | `#e2ad4f` | primary actions and rules |
| `--brass-dark` | `#8f6425` | outlines and pressed states |
| `--coral` | `#e06f51` | warnings and transfer markers |
| `--jade` | `#7fc0a2` | valid checks and success |
| `--danger` | `#ff8c78` | errors |

All body combinations are designed for at least 4.5:1 contrast. Statuses use
text and icons as well as colour.

## Type

- Display: **Metropolis 1920**, an original CSS treatment using Georgia,
  `Times New Roman`, and serif fallbacks in uppercase with wide tracking. No
  external font request is made.
- Body and data: **Station Grotesk**, the local system stack `Inter`, `Avenir
  Next`, `Segoe UI`, sans-serif. Tables use tabular numbers.
- Scale: 14 / 16 / 20 / 28 / fluid 42–72 px. Paragraphs stay under 70
  characters and use 1.55 leading.

## Spacing and shape

The base unit is 8 px. Section spacing is 64–112 px; controls are at least 44
px tall. Panels use clipped upper corners and 1 px brass rules instead of
rounded SaaS cards. Ticket tabs, striped platform markers, and numbered seals
identify steps. Dense table areas can scroll horizontally on 390 px screens.

## Interaction grammar

- The solid brass button is always the next primary action.
- Outlined paper buttons are secondary; underlined text is navigation.
- Imports move through three station labels: **Choose**, **Review**, **Seal**.
- Validation uses a stamped result with a plain-language explanation.
- Destructive actions name the archive and require confirmation.

## Motion policy

On entry, poster rays and rules reveal once over 360 ms. New imports slide six
pixels along a horizontal rail over 220 ms. Buttons depress by two pixels. No
motion loops. With `prefers-reduced-motion: reduce`, transforms and smooth
scrolling are removed; content appears immediately and all state remains clear.

## Asset plan and provenance

- `public/art/vault-transfer.webp`: original generated hero poster. A vaulted
  station portal holds labelled paper ledgers and two abstract file cases;
  converging rails show transfer without depicting a bank or brand.
- `public/social-card.png`: a deterministic crop/composition derived from the
  hero art with live HTML metadata describing the product.
- Logo, arrows, check marks, PWA icons, and decorative rules are hand-authored
  SVG/CSS so they remain sharp and accessible.

### Prompt sheet

**Use case:** stylized-concept. **Subject:** a monumental art-deco transit hall
whose central destination is a secure archive vault; two modest document cases
and neatly stacked paper ledgers travel on converging brass rails. **World:**
1920s railway poster reinterpreted as a private digital archive. **Materials:**
inked paper, screen-print grain, brushed brass, dark painted steel. **Light:**
warm lamp glow inside a midnight teal hall. **Lens/composition:** symmetrical
wide poster, strong stepped geometry, useful negative space at upper left,
no people. **Palette words:** midnight teal, aged cream, brass gold, coral
ticket accents, muted jade. **Negative list:** no words, letters, numbers,
logos, watermark, currency symbols, bank imagery, gradients, photorealism,
people, hands, UI screenshots.

Generated with the factory image deployment through
`/opt/fleet/lib/gen-image.sh` on 2026-08-28. The asset is original to this
product and is disclosed as generated imagery in the site footer.
