# Quick Reference Card

One-page reference for the Vauntico Webhook Security System.

---

## 🚀 5-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate secret
openssl rand -base64 32

# 3. Configure environment
echo "WEBHOOK_SECRET=<your-secret>" > .env
echo "WEBHOOK_TIMESTAMP_TOLERANCE=300" >> .env

# 4. Run tests
npm test
```

---

## 📋 Essential Code Snippets

### Validate Incoming Webhook

```typescript
import { validateWebhook } from './lib/webhook-validator';

const result = await validateWebhook(request);

if (!result.valid) {
  return Response.json({ error: result.reason }, { status: 401 });
}

// Process webhook...
```

### Send Signed Webhook

```typescript
import { signWebhook } from './utils/webhook-signer';

const headers = await signWebhook(payload, process.env.WEBHOOK_SECRET);

await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(payload),
});
```

### Display Audit Log

```tsx
import { WebhookAuditLog } from './components/WebhookAuditLog';

<WebhookAuditLog entries={auditEntries} maxEntries={50} />
```

---

## 🔐 Required Headers

| Header | Format | Example |
|--------|--------|---------|
| `x-signature` | Hex HMAC-SHA256 | `a7f3e9d2c4b8f1a6...` |
| `x-timestamp` | Unix ms | `1705320645000` |

---

## ✅ Validation Reasons

| Reason | HTTP | Meaning |
|--------|------|---------|
| `VERIFIED` | 200 | ✅ Valid webhook |
| `MISSING_SECRET` | 500 | 🔑 Config error |
| `MISSING_SIGNATURE` | 400 | ⚠️ Client error |
| `MISSING_TIMESTAMP` | 400 | ⚠️ Client error |
| `INVALID_TIMESTAMP_FORMAT` | 400 | ❌ Malformed |
| `TIMESTAMP_EXPIRED` | 408 | ⏰ Too old/new |
| `SIGNATURE_MISMATCH` | 401 | 🔐 Tampering |

---

## 🎯 Signature Scheme

```
signature = HMAC-SHA256(timestamp + "." + body, secret)
```

**Critical**: Signature covers both timestamp and full body to prevent:
- Replay attacks with forged timestamps
- Payload modification attacks

---

## ⚙️ Configuration

### Environment Variables

```bash
WEBHOOK_SECRET=<256-bit-secret>           # Required
WEBHOOK_TIMESTAMP_TOLERANCE=300           # Optional (default: 300s)
```

### Timestamp Tolerance Recommendations

| Environment | Value | Window |
|-------------|-------|--------|
| Production | 300s | 5 minutes (balanced) |
| High-Security | 30s | 30 seconds (tight) |
| Development | 900s | 15 minutes (lenient) |

---

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run typecheck        # Type checking
```

---

## 🛡️ Security Checklist

- [ ] Strong secret (≥256 bits) generated
- [ ] Secret stored in env vars, not code
- [ ] HTTPS enforced on all endpoints
- [ ] Timestamp tolerance appropriate for use case
- [ ] Audit logs persisted to durable storage
- [ ] Rate limiting implemented
- [ ] Monitoring alerts configured

---

## 📊 Common Validation Flows

### ✅ Success Path

```
Request → Extract Headers → Check Presence → Check Freshness 
→ Verify Signature → Process Payload → 200 OK
```

### ❌ Failure Paths

```
Missing Signature → 400 Bad Request
Missing Timestamp → 400 Bad Request
Expired Timestamp → 408 Request Timeout
Invalid Signature → 401 Unauthorized
Missing Secret → 500 Internal Server Error
```

---

## 🔍 Debugging

### Validation Failing?

```typescript
const result = await validateWebhook(request);
console.log('Validation:', result);
// Check: result.reason, result.message, result.metadata
```

### Check Signature Computation

```bash
# Manual signature test
timestamp="1705320645000"
body='{"event":"test"}'
secret="your-secret"

echo -n "${timestamp}.${body}" | \
  openssl dgst -sha256 -hmac "${secret}" -hex
```

### Verify Timestamp

```typescript
const now = Date.now();
const timestamp = parseInt(req.headers.get('x-timestamp'), 10);
const age = Math.abs(now - timestamp) / 1000;
console.log(`Webhook age: ${age}s`);
```

---

## 📚 File Locations

```
src/lib/webhook-validator.ts       # Core validation
src/utils/webhook-signer.ts         # Signing utility
src/api/webhook.ts                  # API handler example
src/components/WebhookAuditLog.tsx  # Audit UI
tests/webhook-validator.test.ts     # Unit tests
tests/integration.test.ts           # Integration tests
examples/nextjs-api-route.ts        # Next.js example
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "MISSING_SECRET" | Set WEBHOOK_SECRET in .env |
| "TIMESTAMP_EXPIRED" | Sync NTP on both systems |
| "SIGNATURE_MISMATCH" | Verify same secret on sender/receiver |
| High CPU usage | Check constant-time comparison (expected) |
| Tests failing | Run `npm install` for dependencies |

---

## 📞 Support Resources

- **Documentation**: README.md, SECURITY.md
- **Examples**: examples/ directory
- **Tests**: tests/ directory (usage patterns)
- **Architecture**: PROJECT_STRUCTURE.md

---

## 🎓 Learning Path

1. Read README.md (15 min)
2. Review src/lib/webhook-validator.ts (10 min)
3. Run tests: `npm test` (2 min)
4. Try examples/send-webhook.ts (5 min)
5. Review SECURITY.md for deep dive (20 min)

**Total**: ~1 hour to full understanding

---

## 🚨 Emergency Procedures

### Secret Compromise

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update production env
export WEBHOOK_SECRET="<new-secret>"

# 3. Notify webhook senders
# 4. Review audit logs for suspicious activity
# 5. Rotate again in 90 days
```

### High Validation Failure Rate

```bash
# Check audit logs
grep "SIGNATURE_MISMATCH" audit.log | wc -l

# Analyze patterns
grep "TIMESTAMP_EXPIRED" audit.log | \
  jq '.metadata.timestampAge' | \
  sort -n
```

---

**Quick reference sealed. Knowledge distilled. Path shortened.**

*Print this page and keep it near your keyboard.* 🖨️
