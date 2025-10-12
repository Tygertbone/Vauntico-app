feat(dream-mover phase3): driver parity, Mermaid web render, refined risks

## Phase 3: Foresight Forged

Builds on Phase 2 (bba04d94):
- Core: driver parity in bridge (OS-aware links; permission check stub); FFI blueprint doc.
- CLI: refined riskScore; collisionPreview added to manifest and logs/collision-preview.json; Mermaid includes risk classes.
- Web: ShadowViewer renders Mermaid graph; AuditSummary shows risk doughnut; optional log server at /dm-logs.
- Warp: Phase 3 Render workflow entry (db-relocation demo).
- CI: added tests for driver parity and refined risks.

### Demo Rite
1) Warp → Dream Mover • Phase 3 Render (Mermaid + Risks)
   - Simulates db-relocation.sample.yml; emits manifest.json (riskScore, collisionPreview), shadow-map.mmd.
2) Web → `cd vauntico-dream-mover/web && pnpm install && pnpm dev`
   - Optional: in another pane, `pnpm serve:logs` (or serve logs dir at http://localhost:3000/dm-logs)
   - App shows AuditSummary (risk doughnut) and ShadowViewer (Mermaid).
3) Tests → `pnpm -w --filter vauntico-dream-mover phase3:test`