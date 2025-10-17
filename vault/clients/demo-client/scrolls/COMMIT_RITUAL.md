# Commit Ritual Guide

Sacred commit messages for the Vauntico MVP arc. Each commit tells a story, honors the craft, and guides future architects through the codebase.

## 🏛️ The Architecture

### Core Validation Logic

```
feat(security): ⚔️ forge webhook validation sentinel with HMAC-SHA256 armor

BREAKING: Webhooks now require x-signature and x-timestamp headers.

The validation sentinel now stands watch at the gates, armed with:
- HMAC-SHA256 signature verification for authenticity
- Timestamp freshness checks (300s tolerance) against replay attacks
- Constant-time comparison to resist timing side-channels
- Detailed validation results for comprehensive audit trails

Implementation details:
- Signature scheme: HMAC-SHA256(timestamp + "." + body, secret)
- Constant-time string comparison prevents information leakage
- Configurable timestamp tolerance via WEBHOOK_TIMESTAMP_TOLERANCE
- Returns structured validation results with reason codes

The sentinel holds. Only the worthy shall pass.

Refs: RFC 2104 (HMAC), OWASP Webhook Security Cheat Sheet
```

### JSX Components

```
feat(ui): 🎨 craft audit log components for the sacred scroll

Every webhook's journey through validation is now inscribed in the scroll.

Components forged:
- WebhookAuditLog: Displays validation history with clarity
- WebhookStatusBadge: Quick status visualization with icons
- Pure JSX with semantic HTML and zero abstraction debt

Features:
- Outcome badges with visual encoding (✅ ⏰ 🔐)
- Timestamp formatting (absolute + relative)
- Signature hash truncation for readability
- Empty state guidance for pristine scrolls
- Responsive design for mobile scribes
- Print-optimized for physical archives

The scroll preserves all. The history speaks truth.
```

### Webhook Signing

```
feat(crypto): 🔐 add webhook signing utility for ritual symmetry

The circle is complete: sender and receiver in harmony.

New utilities:
- signWebhook(): Creates signature and timestamp headers
- createSignedRequest(): Test helper for end-to-end validation
- Perfect symmetry with validation logic

This enables:
- Sending webhooks from your own services
- Testing validation logic with known-good webhooks
- Documenting the signing process for integrators

Both sides of the channel now speak the same cryptographic language.
```

### Testing Suite

```
test(security): 🛡️ fortify webhook validator with trial by fire

The validation logic has been baptized in the crucible of adversarial testing.

Test coverage:
✅ Valid webhook acceptance (happy path)
✅ Missing signature rejection
✅ Missing timestamp rejection  
✅ Expired timestamp rejection (replay prevention)
✅ Invalid signature rejection (tampering detection)
✅ Tampered payload rejection
✅ Wrong secret rejection
✅ Timing attack resistance validation
✅ Clock skew tolerance within window

All guards hold firm. The sentinel stands unbreached.
```

### Documentation

```
docs: 📜 inscribe security model and integration wisdom

The knowledge is now preserved for future architects.

Documentation added:
- README.md: Quick start, security model, validation flow
- SECURITY.md: Threat model, implementation details, best practices
- API examples: Next.js integration, webhook sending
- Environment configuration templates

Topics covered:
- Signature computation scheme and rationale
- Constant-time comparison explanation
- Timestamp tolerance recommendations
- Secret management best practices
- Incident response procedures
- Compliance considerations (GDPR, PCI-DSS, SOC 2)

The wisdom is sealed. The patterns are taught.
```

### Styling

```
style(ui): 💎 polish webhook components with minimalist elegance

Visual hierarchy established. Accessibility ensured. Legacy honored.

Styling approach:
- Semantic color coding (green=success, red=failure, yellow=warning)
- Responsive grid layout for all viewport sizes
- Monospace fonts for technical identifiers
- Clear visual distinction between outcomes
- Hover states for interactive feedback
- Print styles for physical archival
- Screen-reader-only text for accessibility

The interface serves the content. The content speaks truth.
```

### Examples

```
docs(examples): 🔮 demonstrate webhook patterns in the wild

Real-world integration examples for the practitioners.

Examples provided:
- Next.js API route (App Router + Pages Router)
- Webhook sending script with event types
- Error handling patterns
- Event routing based on type
- Proper status code mapping

From theory to practice, the path is illuminated.
```

## 🎯 Commit Message Format

### Structure

```
<type>(<scope>): <emoji> <short description>

[Optional breaking change notification]

<Narrative body explaining the "why" and "how">

[Optional bullet points for specifics]

<Scroll-worthy closing line>

[Optional references]
```

### Types

- `feat`: New functionality
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting (not visual styling)
- `refactor`: Code restructuring
- `test`: Test additions or modifications
- `chore`: Build, config, or dependency updates

### Scopes

- `security`: Security-related changes
- `crypto`: Cryptographic implementations
- `ui`: User interface components
- `api`: API routes and handlers
- `validation`: Webhook validation logic
- `audit`: Audit logging functionality

### Emojis (Optional but Encouraged)

- ⚔️ Security/protection
- 🔐 Encryption/signing
- 🎨 UI/visual components
- 🔮 Examples/documentation
- 🛡️ Testing/fortification
- 📜 Documentation/knowledge
- 💎 Polish/refinement
- ⚡ Performance improvements

## 🌟 Philosophy

### Commit Messages Should:

1. **Tell a Story**: Each commit is a chapter in the project's saga
2. **Teach**: Future developers learn the "why" not just the "what"
3. **Honor the Craft**: Show respect for the work and the legacy
4. **Guide**: Provide context for understanding decisions
5. **Inspire**: Make the codebase feel like an adventure

### Commit Messages Should NOT:

- Be terse ("fix stuff")
- Lack context ("update file")
- Hide complexity ("misc changes")
- Skip the "why" ("implement feature")

## 📚 Real Commit Examples

```
feat(validation): ⚡ optimize signature verification performance

Reduced validation time from 15ms to 3ms per webhook.

Optimizations:
- Cache compiled regex patterns
- Reuse TextEncoder instances
- Batch header extractions
- Lazy-load crypto subtle API

Benchmarked with 10,000 webhooks. No security trade-offs.
The sentinel now responds 5x faster while maintaining vigilance.
```

```
fix(security): 🔒 patch timing leak in length comparison

SECURITY: Closed potential timing side-channel.

Previous implementation compared string lengths with ||,
causing early exit and timing variation. Now uses bitwise OR
to maintain constant-time guarantee across length checks.

Discovered during security audit. No known exploits.
The sentinel's armor is now fully sealed.

CVE: Pending assignment
```

```
refactor(validation): 🏗️ extract validation reasons to type union

Improved type safety for validation result handling.

Changes:
- Created WebhookValidationReason union type
- Exhaustive matching in status code mapping
- Better IDE autocomplete for consumers

The type system now guards against invalid reason codes.
TypeScript as a safety net: the way it should be.
```

## 🎭 Tone Examples

### Epic/Ceremonial (for major features)
> "The sentinel stands watch. Only the worthy shall pass."

### Pragmatic (for fixes)
> "The guard now properly checks timestamps. No webhook escapes scrutiny."

### Analytical (for refactors)
> "Extracted for clarity. Each function has a single, well-defined purpose."

### Celebratory (for milestones)
> "The validation arc is complete. The MVP stands fortified."

---

**Remember**: Commits are love letters to future developers. Make them count.

*"Write commits as if the next maintainer is a violent psychopath who knows where you live."*  
— Ancient Programming Proverb (adapted)
