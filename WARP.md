# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Frontend: React 18 SPA with React Router. Entry is index.html → src/main.jsx → src/App.jsx. Uses Vite-style index.html and a Vite config (vite.config.mjs) with an alias @ → src. Pages are routed in App.jsx, including the “Ascension Codex” flow.
- Backend: Node/Express server in server/server.js with Supabase and Paystack integrations. Exposes / (health), /api/verify-payment, and /api/user-status.
- Package manager: pnpm-lock.yaml is present (use pnpm locally). A GitHub workflow installs with npm; both work, but pnpm is preferred per the README.
- Note on tooling mismatch: package.json scripts use Next (next dev/build/start) while the app structure and index.html use Vite. Use the declared scripts as-is, but be aware the front-end is organized as a Vite SPA. If dev fails under Next, align scripts/dependencies with Vite.

Common commands
- Install dependencies (preferred):
```bash path=null start=null
pnpm install
```
- Alternative install:
```bash path=null start=null
npm install
```
- Frontend dev (declared in package.json):
```bash path=null start=null
pnpm dev
# or
npm run dev
```
- Build (declared):
```bash path=null start=null
pnpm build
# or
npm run build
```
- Start (declared):
```bash path=null start=null
pnpm start
# or
npm start
```
- Custom lint (Vauntico UI/polish checks):
```bash path=null start=null
node vauntico-lint.cjs
```
- Auto-fix passes (declared scripts):
```bash path=null start=null
pnpm run audit:fix
pnpm run polish:fix
pnpm run ritual:qa
# or with npm
npm run audit:fix
npm run polish:fix
npm run ritual:qa
```
- Backend server (Express):
```bash path=null start=null
# Ensure required env vars are set (see .env.example), then
node server/server.js
```
- Ascension Codex scaffolding (content generator):
```bash path=null start=null
# Generates JSON drops and updates src/pages/codex/index.json
node scripts/generate-codex.js --weeks=1-7 --drops=1-7
```
- Tests: No test runner/config detected (no Jest/Vitest/Cypress/Playwright and no test files). Single-test execution is not applicable.

Environment & CI notes
- Environment variables: .env.example documents expected secrets (Airtable, Resend, OpenAI, Render service, etc.). The backend currently uses SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY, and PORT.
- GitHub Actions: .github/workflows/cta-audit.yml runs on push/PR, installs Node 18, installs deps, and runs the custom lint (node vauntico-lint.cjs).

High-level architecture
- Frontend (SPA)
  - Entry: index.html loads /src/main.jsx, which mounts App.
  - Router: src/App.jsx wires routes for Homepage, Pricing, Onboarding, Vault flows (PromptVaultPage, VaultsPage, VaultDetailPage, VaultSuccessPage), Creator Pass, Demos, and the Ascension Codex (
    - /ascension-codex (sales)
    - /checkout (payment)
    - /ascension-onboarding (profile)
    - /ascension-welcome (success)
    - /codex/:week/:day, /codex/today, /codex/archive
  ).
  - UI shell: components/ui/sidebar.jsx provides SidebarProvider/Sidebar/SidebarInset used to wrap the Router.
  - Aliases: vite.config.mjs defines @ → src; tsconfig.json is aligned to modern ESNext + react-jsx and includes src.
  - UI conventions: A custom lint (vauntico-lint.cjs) enforces CTAButton props (label, to, trackEvent), hover polish classes, and canonical import path (@/components/ui/CTAButton). Auto-fix scripts (vauntico-auto-fix.cjs, etc.) patch common issues.
- Ascension Codex content model
  - JSON-based transmissions live under src/pages/codex/week-XX/drop-N.json.
  - scripts/generate-codex.js scaffolds missing week/drop files and maintains an index at src/pages/codex/index.json.
  - Pages TransmissionPage/TodayPage/ArchivePage render this content via React Router routes.
- Backend (Express)
  - Health: GET /
  - Payment verification: POST /api/verify-payment uses Paystack to verify a reference and upserts user flags in Supabase (has_creator_pass, plan).
  - User status: GET /api/user-status?email=… fetches has_creator_pass/plan from Supabase.
  - Startup: node server/server.js (PORT default 5000). Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY.

Key files to know
- package.json: Declares scripts (Next) and custom fixer/lint tasks.
- vite.config.mjs: Aliases and React plugin for Vite-style builds.
- src/main.jsx and src/App.jsx: SPA bootstrap and route map.
- server/server.js: Express API for payments and user status.
- scripts/generate-codex.js: Content scaffolding for the Codex.
- .env.example: Documents expected env vars.
- .github/workflows/cta-audit.yml: CI lint workflow.

Gotchas/nuances for Warp
- Next vs Vite: Scripts target Next while sources are Vite-style. If dev/build fail, align scripts by adding Vite deps (@vitejs/plugin-react, vite) and using vite/vite build, or refactor the app to Next’s app/pages patterns. Do not assume Next pages/app dirs exist.
- Path aliases: Use @/… imports; Vite and tsconfig are set up for this.
- No tests configured: Don’t assume jest/vitest commands; none are present in scripts or config.