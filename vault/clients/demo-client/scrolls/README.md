# Vauntico Webhook Security System

A production-ready webhook validation system featuring HMAC-SHA256 signature verification, timestamp freshness checks, and comprehensive audit logging. Built for the Vauntico MVP with security, clarity, and legacy in mind.

## 🛡️ Security Features

### 1. **HMAC-SHA256 Signature Verification**
- Ensures webhook authenticity using shared secret
- Protects against message tampering
- Implements constant-time comparison to prevent timing attacks

### 2. **Timestamp Freshness Validation**
- Prevents replay attacks by enforcing timestamp tolerance
- Default 5-minute window (configurable)
- Rejects stale webhooks automatically

### 3. **Comprehensive Validation**
- Checks for missing headers
- Validates timestamp format
- Provides detailed error messages for debugging

## 📦 Project Structure

```
├── .env.example                          # Environment configuration template
├── src/
│   ├── lib/
│   │   └── webhook-validator.ts          # Core validation logic
│   ├── utils/
│   │   └── webhook-signer.ts             # Signing utility for sending webhooks
│   ├── api/
│   │   └── webhook.ts                    # Example API handler
│   └── components/
│       ├── WebhookAuditLog.tsx           # Audit log UI component
│       └── WebhookStatusBadge.tsx        # Status badge component
├── tests/
│   └── webhook-validator.test.ts         # Comprehensive test suite
└── README.md
```

## 🚀 Quick Start

### 1. Configure Environment

```bash
cp .env.example .env
```

Generate a strong secret:
```bash
openssl rand -base64 32
```

Add to `.env`:
```env
WEBHOOK_SECRET=your-generated-secret-here
WEBHOOK_TIMESTAMP_TOLERANCE=300
```

### 2. Validate Incoming Webhooks

```typescript
import { validateWebhook } from "./src/lib/webhook-validator";

export async function POST(request: Request) {
  // Validate the webhook
  const result = await validateWebhook(request);
  
  if (!result.valid) {
    return Response.json(
      { error: result.reason, message: result.message },
      { status: 401 }
    );
  }
  
  // Process the validated webhook
  const payload = await request.json();
  // ... your business logic
  
  return Response.json({ success: true });
}
```

### 3. Send Signed Webhooks

```typescript
import { signWebhook } from "./src/utils/webhook-signer";

const payload = { event: "user.created", data: { id: 123 } };
const headers = await signWebhook(payload, process.env.WEBHOOK_SECRET);

await fetch("https://api.example.com/webhook", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...headers,
  },
  body: JSON.stringify(payload),
});
```

## 🔒 Security Model

### Signature Computation

```
signature = HMAC-SHA256(timestamp + "." + body, secret)
```

### Headers Required

- `x-signature`: Hex-encoded HMAC-SHA256 signature
- `x-timestamp`: Unix timestamp in milliseconds

### Validation Flow

```
┌─────────────────┐
│ Incoming Webhook│
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Extract  │
    │ Headers  │
    └────┬─────┘
         │
    ┌────▼─────────┐      ❌ Missing
    │ Check Headers├──────► Reject
    └────┬─────────┘
         │ ✅ Present
    ┌────▼──────────┐     ❌ Too Old
    │ Check Freshness├────► Reject
    └────┬──────────┘
         │ ✅ Fresh
    ┌────▼──────────┐     ❌ Invalid
    │ Verify HMAC   ├────► Reject
    └────┬──────────┘
         │ ✅ Valid
    ┌────▼────┐
    │ Process │
    └─────────┘
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:
- ✅ Valid webhook acceptance
- ❌ Missing signature rejection
- ❌ Missing timestamp rejection
- ❌ Expired timestamp rejection
- ❌ Invalid signature rejection
- ❌ Tampered payload rejection
- ❌ Replay attack prevention
- ✅ Timing attack resistance

## 📊 Audit Logging

### Programmatic Usage

```typescript
import { AuditEntry } from "./src/components/WebhookAuditLog";

const entries: AuditEntry[] = [
  {
    id: "uuid-here",
    timestamp: new Date().toISOString(),
    source: "payment-provider",
    signature: "abc123...",
    result: validationResult,
  },
];
```

### React Component

```tsx
import { WebhookAuditLog } from "./src/components/WebhookAuditLog";

function AuditPage() {
  return <WebhookAuditLog entries={entries} maxEntries={50} />;
}
```

## 🎯 Validation Results

The `validateWebhook` function returns detailed results:

```typescript
interface WebhookValidationResult {
  valid: boolean;
  reason: 
    | "VERIFIED"                    // ✅ Success
    | "MISSING_SECRET"              // 🔑 Config error
    | "MISSING_SIGNATURE"           // ⚠️  Client error
    | "MISSING_TIMESTAMP"           // ⚠️  Client error
    | "INVALID_TIMESTAMP_FORMAT"    // ❌ Client error
    | "TIMESTAMP_EXPIRED"           // ⏰ Replay attempt
    | "SIGNATURE_MISMATCH";         // 🔐 Tampering detected
  message: string;
  metadata?: {
    timestamp?: string;
    timestampAge?: number;
    maxAge?: number;
  };
}
```

## 🛠️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WEBHOOK_SECRET` | *(required)* | Shared secret for HMAC signing |
| `WEBHOOK_TIMESTAMP_TOLERANCE` | `300` | Max age in seconds (5 minutes) |

### Customization

Adjust tolerance for your use case:

- **Tight security** (30s): Minimal replay window, requires accurate clocks
- **Standard** (300s): Balances security and reliability
- **Lenient** (900s): More forgiving for clock skew, larger replay window

## 📜 Commit Messages (Ritual Suggestions)

```
feat: ⚔️ forge webhook validation sentinel with HMAC-SHA256 armor

BREAKING: Webhooks now require x-signature and x-timestamp headers.

- Implement HMAC-SHA256 signature verification
- Add timestamp freshness validation (300s tolerance)
- Guard against replay attacks with constant-time comparison
- Return detailed validation results for audit trails

The sentinel stands watch. Only the worthy shall pass.
```

```
feat: 🎨 craft audit log components for webhook chronicle

- Create WebhookAuditLog for displaying validation history
- Add WebhookStatusBadge for quick status visualization
- Implement pure JSX with zero abstractions
- Format timestamps, truncate hashes, show validation reasons

Every webhook's journey is now inscribed in the scroll.
```

```
feat: 🔐 add webhook signing utility for the sending side

- Implement signWebhook helper for outgoing webhooks
- Create test helper createSignedRequest
- Mirror validation logic for perfect symmetry
- Enable end-to-end webhook testing

The circle is complete: sender and receiver in harmony.
```

```
test: 🛡️ fortify webhook validator with comprehensive test suite

- Test valid webhook acceptance
- Test replay attack prevention
- Test tampering detection
- Test timing attack resistance
- Test all error paths with meaningful assertions

The validation logic has been baptized by fire. It holds.
```

## 🔮 Production Considerations

### 1. Secret Management
- Store `WEBHOOK_SECRET` in secure secret manager (Vault, AWS Secrets Manager)
- Rotate secrets periodically
- Use different secrets per environment

### 2. Audit Persistence
- Write audit logs to durable storage (database, logging service)
- Include IP addresses, user agents for forensics
- Set up alerting for validation failures

### 3. Rate Limiting
- Add rate limiting per source/IP
- Implement exponential backoff for failures
- Consider webhook retries with exponential backoff

### 4. Monitoring
- Track validation success/failure rates
- Alert on unusual patterns
- Monitor timestamp distribution for clock skew issues

## 📖 Further Reading

- [OWASP: Webhook Security](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)
- [RFC 2104: HMAC](https://tools.ietf.org/html/rfc2104)
- [Stripe Webhook Security](https://stripe.com/docs/webhooks/signatures)

## 🤝 Contributing

This is MVP-grade code built for clarity and security. When extending:

1. Keep validation logic pure and testable
2. Add tests for new attack vectors
3. Document security implications
4. Update audit logging for new fields

---

**Built with resilience for the Vauntico MVP arc.**  
*The scroll is sealed. The sentinel stands watch. The webhooks flow true.*
