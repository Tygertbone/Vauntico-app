# Vauntico Brand Assets

Drop Grock’s glyphs (SVG) and motion specs (Lottie JSON) here. This folder is served statically at /brand-assets in production.

Structure (recommended)
- favicon-obelisk.svg              # Favicon + mask icon candidate
- glyphpulse.json                  # Footer GlyphPulse (1s loop)
- blue-nodes.json                  # Hover overlay (Webhook Studio)
- orange-embers.json               # Hover overlay (Dream Mover)
- badgeglow.json                   # /link-rites BadgeGlow (1.5s loop)
- cliritual.json                   # Webhook Studio CLIRitual (simulate → badge → logs)
- dualreveal.json                  # Homepage DualReveal (Dream Mover vs Studio)
- glyphs/                          # Additional SVGs for /brand gallery
- previews/                        # Optional PNGs/GIFs for PRs and docs
- manifest.json                    # Final mapping (copy from manifest.example.json and update)

Guidance
- SVGs: optimize (svgo) and ensure viewBox is set; avoid inline styles where possible.
- Lottie: keep durations matching spec (GlyphPulse 1s, BadgeGlow 1.5s); loop where noted.
- Hover overlays: separate Lotties for blue nodes and orange embers; we’ll swap them on hover via CSS/JS.
- Colors: target brand gold (#C29B4B/#E6B800 variants), electric blue (#4fc3f7), ember orange (#ff6f3c).
- Accessibility: provide alt text or aria-labels for meaningful glyphs when embedded.

Security
- Avoid embedding remote URLs in Lottie JSON; use local static files.
- Keep payload-like demo data in /brand (future) sanitized/redacted.

Next steps
- Paste assets here using the filenames above (or adjust manifest.example.json).
- Copy manifest.example.json to manifest.json and update file names/metadata.
- I’ll then wire:
  - favicon to favicon-obelisk.svg
  - footer pulse to glyphpulse.json (+ hover overlays)
  - /link-rites success → badgeglow.json
  - Webhook Studio → cliritual.json (with console frame pulse)
  - Homepage → dualreveal.json
  - /brand route to showcase the full system.
