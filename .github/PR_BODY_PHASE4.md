feat(dream-mover phase4): rust core seed + marketplace vetting

## Phase 4: Rust Ember + Vetted Bazaar

Builds on Phase 3 (e52ebe96):
- Rust core seed (crate + env-gated bridge; no side effects; logs availability in simulate).
- Marketplace vetting (rules file, vetter utility, CI comments on PR with issues).
- Warp entry for vet + rust POC.

### Demo
1) Warp → Dream Mover • Phase 4 Vet & Rust POC
   - Pull docker-volumes with vet; if pass, sim with --use-rust.
2) Vet locally:
   - cd vauntico-dream-mover && pnpm build && pnpm phase4:vet
3) (Optional) Build Rust seed:
   - cd vauntico-dream-mover && pnpm phase4:rust
   - Set DM_RUST_LIB to your compiled library path and re-run simulate with --use-rust.
