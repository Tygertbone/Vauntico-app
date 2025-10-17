# Project Structure

Complete overview of the Vauntico Webhook Security System architecture.

## 📁 Directory Layout

```
vauntico-webhook-security/
├── .env.example                      # Environment configuration template
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Main documentation and quick start
├── SECURITY.md                       # Security model and threat analysis
├── COMMIT_RITUAL.md                  # Commit message guidelines
├── PROJECT_STRUCTURE.md              # This file
├── webhook-audit.md                  # Audit log documentation and examples
│
├── src/                              # Source code
│   ├── lib/                          # Core libraries
│   │   └── webhook-validator.ts      # Validation logic (HMAC, timestamp, etc.)
│   │
│   ├── utils/                        # Utility functions
│   │   └── webhook-signer.ts         # Signing utilities for sending webhooks
│   │
│   ├── api/                          # API handlers
│   │   └── webhook.ts                # Example webhook endpoint handler
│   │
│   ├── components/                   # React/JSX components
│   │   ├── WebhookAuditLog.tsx       # Audit log display component
│   │   └── WebhookStatusBadge.tsx    # Status badge component
│   │
│   └── styles/                       # Stylesheets
│       └── webhook-components.css    # Component styles
│
├── tests/                            # Test suites
│   ├── webhook-validator.test.ts     # Unit tests for validation logic
│   └── integration.test.ts           # End-to-end integration tests
│
└── examples/                         # Usage examples
    ├── nextjs-api-route.ts           # Next.js API route integration
    └── send-webhook.ts               # Webhook sending script
```

## 🧩 Module Responsibilities

### Core Modules

#### `src/lib/webhook-validator.ts`
**Purpose**: Core validation logic  
**Exports**:
- `validateWebhook(req: Request)` - Main validation function
- `WebhookValidationResult` - Result type
- `WebhookValidationReason` - Validation outcome enum

**Responsibilities**:
- HMAC-SHA256 signature verification
- Timestamp freshness validation
- Constant-time comparison
- Detailed error reporting

**Dependencies**: None (uses Web Crypto API)

---

#### `src/utils/webhook-signer.ts`
**Purpose**: Webhook signing for outgoing webhooks  
**Exports**:
- `signWebhook(payload, secret)` - Creates signature headers
- `createSignedRequest(url, payload, secret)` - Test helper

**Responsibilities**:
- HMAC-SHA256 signature generation
- Timestamp creation
- Header formatting

**Dependencies**: None (uses Web Crypto API)

---

#### `src/api/webhook.ts`
**Purpose**: Example API handler implementation  
**Exports**:
- `handleWebhook(req: Request)` - Complete webhook handler

**Responsibilities**:
- Webhook validation orchestration
- Error response formatting
- Payload processing routing
- Audit logging integration

**Dependencies**: `webhook-validator.ts`

---

### UI Components

#### `src/components/WebhookAuditLog.tsx`
**Purpose**: Displays webhook validation history  
**Props**:
- `entries: AuditEntry[]` - Array of audit log entries
- `maxEntries?: number` - Maximum entries to display

**Features**:
- Outcome visualization with icons
- Timestamp formatting (absolute + relative)
- Signature truncation
- Empty state handling
- Responsive layout

**Dependencies**: `webhook-validator.ts` (types)

---

#### `src/components/WebhookStatusBadge.tsx`
**Purpose**: Compact status indicator  
**Props**:
- `reason: WebhookValidationReason` - Validation outcome
- `timestamp?: string` - Optional timestamp
- `compact?: boolean` - Compact mode toggle

**Features**:
- Color-coded status (success/error/warning/expired)
- Icon mapping
- Relative time display
- Accessibility (ARIA labels, sr-only text)

**Dependencies**: `webhook-validator.ts` (types)

---

### Styling

#### `src/styles/webhook-components.css`
**Purpose**: Component styling  
**Features**:
- Semantic color coding
- Responsive grid layouts
- Accessibility considerations
- Print-optimized styles
- Hover states

**Approach**: Vanilla CSS, no preprocessor, BEM-inspired naming

---

## 🧪 Testing Strategy

### Unit Tests (`tests/webhook-validator.test.ts`)

**Test Categories**:
1. **Valid webhooks** - Happy path acceptance
2. **Missing components** - Header validation
3. **Timestamp validation** - Freshness checks
4. **Signature validation** - HMAC verification
5. **Replay attack prevention** - Old timestamp rejection

**Coverage Target**: >95%

---

### Integration Tests (`tests/integration.test.ts`)

**Test Categories**:
1. **Complete webhook flow** - Sign → Send → Validate → Process
2. **Webhook lifecycle** - Multiple sequential webhooks
3. **Error handling** - Status code mapping
4. **Security boundaries** - Information leakage prevention

**Coverage Target**: All critical paths

---

## 📚 Documentation Files

### README.md
- Quick start guide
- Security features overview
- API documentation
- Configuration reference
- Production considerations

### SECURITY.md
- Threat model
- Attack vector analysis
- Implementation details
- Best practices
- Compliance considerations

### COMMIT_RITUAL.md
- Commit message format
- Example commits
- Philosophy and tone guidance

### webhook-audit.md
- Audit log format
- Example entries
- Implementation notes

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Webhook Lifecycle                            │
└─────────────────────────────────────────────────────────────────┘

1. SENDING SIDE
   ┌──────────────┐
   │ Webhook Event│
   └──────┬───────┘
          │
   ┌──────▼────────────┐
   │ signWebhook()     │ Creates signature & timestamp
   └──────┬────────────┘
          │
   ┌──────▼────────────┐
   │ HTTP POST         │ Sends to receiver
   └──────┬────────────┘
          │
          ▼
   ═══════════════════════════════════════════════════════════
          │
2. RECEIVING SIDE  │
          │
   ┌──────▼────────────┐
   │ handleWebhook()   │ API endpoint
   └──────┬────────────┘
          │
   ┌──────▼────────────┐
   │ validateWebhook() │ Security check
   └──────┬────────────┘
          │
     ┌────▼────┐
     │ Valid?  │
     └─┬────┬──┘
    No │    │ Yes
   ┌───▼──┐ │
   │Reject│ │
   └──────┘ │
         ┌──▼────────────────┐
         │ Process Payload   │
         └──┬────────────────┘
            │
         ┌──▼────────────────┐
         │ Audit Log Entry   │
         └───────────────────┘
```

---

## 🔐 Security Layers

```
┌────────────────────────────────────────────────────┐
│ Layer 4: Audit Logging                             │
│ - All validation attempts recorded                 │
│ - Forensic evidence for incident response          │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│ Layer 3: Timestamp Validation                      │
│ - Replay attack prevention                         │
│ - Configurable tolerance window                    │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│ Layer 2: Signature Verification                    │
│ - HMAC-SHA256 with shared secret                   │
│ - Constant-time comparison                         │
└────────────────────────────────────────────────────┘
                       ▲
┌────────────────────────────────────────────────────┐
│ Layer 1: Header Presence Checks                    │
│ - Signature header required                        │
│ - Timestamp header required                        │
└────────────────────────────────────────────────────┘
```

---

## 🚀 Integration Points

### Next.js App Router
```typescript
// app/api/webhook/route.ts
export { POST } from '@/api/webhook';
```

### Next.js Pages Router
```typescript
// pages/api/webhook.ts
import { handleWebhook } from '@/api/webhook';
export default handleWebhook;
```

### Express.js
```typescript
app.post('/webhook', async (req, res) => {
  const request = new Request(req);
  const response = await handleWebhook(request);
  res.status(response.status).json(await response.json());
});
```

### Cloudflare Workers
```typescript
export default {
  async fetch(request) {
    if (request.url.endsWith('/webhook')) {
      return handleWebhook(request);
    }
  }
};
```

---

## 📦 Build & Deploy

### TypeScript Compilation
```bash
npm run typecheck  # Check for type errors
```

### Testing
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

### Linting
```bash
npm run lint       # Check code style
```

---

## 🎯 Extension Points

### Custom Validation Rules
Extend `validateWebhook()` to add:
- IP allowlisting
- Rate limiting per source
- Custom header validation
- Payload schema validation

### Custom Audit Storage
Replace console logging in `webhook.ts` with:
- Database persistence (PostgreSQL, MongoDB)
- Log aggregation (Datadog, Splunk)
- SIEM integration (Elastic Security)

### Custom Processing Logic
Implement event handlers in `processWebhookEvent()`:
- User lifecycle events
- Payment processing
- Third-party API calls
- Background job scheduling

---

## 📊 Dependencies

### Runtime
- **None** - Uses Web APIs only (crypto.subtle, fetch)

### Development
- `typescript` - Type checking
- `vitest` - Testing framework
- `eslint` - Linting
- `tsx` - TypeScript execution

### React Components
- `react` - UI library (peer dependency)
- `react-dom` - DOM rendering (peer dependency)

---

## 🔮 Future Enhancements

Potential additions for v2.0:

1. **Database Integration**
   - Persistent audit log storage
   - Webhook deduplication
   - Processing status tracking

2. **Advanced Security**
   - JWT webhook tokens (asymmetric)
   - Webhook event encryption
   - Mutual TLS support

3. **Observability**
   - OpenTelemetry tracing
   - Prometheus metrics
   - Health check endpoints

4. **Developer Experience**
   - CLI tool for testing webhooks locally
   - Interactive webhook debugger
   - Signature verification playground

---

**Architecture sealed. Structure documented. Path illuminated.**
