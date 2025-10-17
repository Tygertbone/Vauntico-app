# Security Documentation

## Threat Model

This webhook validation system defends against the following attack vectors:

### 1. **Message Tampering** 🔐
**Attack**: Adversary intercepts webhook and modifies payload  
**Defense**: HMAC-SHA256 signature verification  
**Mitigation**: Any modification invalidates signature, request rejected

### 2. **Replay Attacks** ⏰
**Attack**: Adversary captures valid webhook, replays it later  
**Defense**: Timestamp freshness validation (default 5min window)  
**Mitigation**: Old webhooks rejected, even with valid signatures

### 3. **Timing Attacks** ⚡
**Attack**: Adversary measures signature comparison time to leak information  
**Defense**: Constant-time comparison algorithm  
**Mitigation**: All comparisons take same time regardless of match position

### 4. **Missing Authentication** ⚠️
**Attack**: Unauthenticated webhooks accepted  
**Defense**: Required signature and timestamp headers  
**Mitigation**: Webhooks without proper headers rejected immediately

### 5. **Configuration Errors** 🔑
**Attack**: System deployed without proper secret configuration  
**Defense**: Explicit secret validation before processing  
**Mitigation**: Clear error message, system fails closed

## Security Properties

### Authenticity
- **Property**: Only parties with the shared secret can create valid webhooks
- **Mechanism**: HMAC-SHA256 with 256-bit key
- **Guarantee**: Cryptographically infeasible to forge without secret

### Integrity
- **Property**: Any modification to timestamp or payload is detectable
- **Mechanism**: Signature covers both timestamp and full body
- **Guarantee**: Tampered webhooks fail validation

### Freshness
- **Property**: Only recent webhooks are accepted
- **Mechanism**: Timestamp validation with configurable tolerance
- **Guarantee**: Stale webhooks rejected, limiting replay window

### Non-Repudiation
- **Property**: Audit trail of all validation attempts
- **Mechanism**: Structured logging with outcomes
- **Guarantee**: Forensic evidence of webhook activity

## Implementation Details

### Signature Scheme

```
message = timestamp + "." + body
signature = HMAC-SHA256(message, secret)
```

**Why this scheme?**
- Including timestamp in signature prevents replay with forged timestamps
- Including full body prevents any payload modification
- Delimiter prevents collision attacks (e.g., "123" + "456" vs "1234" + "56")

### Constant-Time Comparison

```typescript
function secureCompare(a: string, b: string): boolean {
  const aLen = a.length;
  const bLen = b.length;
  const maxLen = Math.max(aLen, bLen);
  
  let mismatch = aLen !== bLen ? 1 : 0;
  
  for (let i = 0; i < maxLen; i++) {
    const charA = i < aLen ? a.charCodeAt(i) : 0;
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }
  
  return mismatch === 0;
}
```

**Why constant-time?**
- Standard `===` comparison can leak position of first mismatch through timing
- Adversary could iteratively guess signature bytes
- This implementation always compares all bytes regardless of mismatches

### Timestamp Validation

```typescript
const age = Math.abs(now - timestampMs);
const maxAge = toleranceSeconds * 1000;

if (age > maxAge) {
  return { valid: false, reason: "TIMESTAMP_EXPIRED" };
}
```

**Why absolute value?**
- Handles both past and future timestamps (clock skew)
- Rejects timestamps too far in either direction
- Symmetric tolerance window

## Security Best Practices

### Secret Management

**DO:**
- ✅ Use cryptographically random secrets (≥256 bits)
- ✅ Store secrets in environment variables or secret managers
- ✅ Use different secrets per environment
- ✅ Rotate secrets periodically (quarterly recommended)
- ✅ Use HTTPS for all webhook endpoints

**DON'T:**
- ❌ Hardcode secrets in source code
- ❌ Commit secrets to version control
- ❌ Share secrets via insecure channels
- ❌ Reuse secrets across services
- ❌ Use weak or predictable secrets

### Timestamp Tolerance

**Recommendations by use case:**

| Use Case | Tolerance | Trade-off |
|----------|-----------|-----------|
| High-security financial | 30s | Tight replay window, requires accurate clocks |
| Standard production | 300s (5min) | Balanced security and reliability |
| Development/testing | 900s (15min) | Forgiving for clock skew, larger replay window |

### Deployment Checklist

- [ ] `WEBHOOK_SECRET` configured in production
- [ ] HTTPS enforced on webhook endpoints
- [ ] Rate limiting implemented per source
- [ ] Audit logs persisted to durable storage
- [ ] Monitoring alerts configured for validation failures
- [ ] Webhook retry logic implements exponential backoff
- [ ] IP allowlisting configured (if applicable)

## Incident Response

### Suspected Compromise

If you suspect the webhook secret has been compromised:

1. **Immediate Actions**
   - Generate new secret: `openssl rand -base64 32`
   - Update `WEBHOOK_SECRET` in production
   - Coordinate rotation with webhook senders

2. **Investigation**
   - Review audit logs for suspicious validation failures
   - Check for unusual IP addresses or user agents
   - Analyze timing patterns of webhook receipts

3. **Communication**
   - Notify webhook senders of secret rotation
   - Provide new secret via secure channel
   - Document incident timeline

### Validation Failures

High rate of validation failures may indicate:

- **Clock skew**: Sender/receiver time out of sync
  - Solution: Sync NTP on both systems
  
- **Configuration mismatch**: Different secrets in use
  - Solution: Verify secret configuration on both sides
  
- **Active attack**: Tampering or replay attempts
  - Solution: Enable IP-based blocking, increase monitoring

## Cryptographic Choices

### Why HMAC-SHA256?

- **Widely supported**: Available in all modern platforms
- **Cryptographically secure**: No known practical attacks
- **Fast**: Efficient for webhook validation
- **Standard**: Used by Stripe, GitHub, Twilio, etc.

### Alternatives Considered

| Algorithm | Pros | Cons | Verdict |
|-----------|------|------|---------|
| HMAC-SHA256 | Standard, fast, secure | None significant | ✅ **Selected** |
| HMAC-SHA512 | Stronger security margin | Slower, longer signatures | ❌ Overkill for this use case |
| RSA Signatures | Asymmetric (public verification) | Complex key management, slower | ❌ Unnecessary complexity |
| Ed25519 | Modern, fast asymmetric | Less universal support | ❌ HMAC simpler for shared-secret model |

## Compliance Considerations

### GDPR
- Audit logs may contain PII (IP addresses)
- Implement data retention policies
- Support right to erasure for user-specific logs

### PCI-DSS
- If processing payment webhooks, ensure compliance
- Log all webhook validation attempts
- Implement secure secret storage (requirement 3.4)

### SOC 2
- Maintain audit trails (CC7.2)
- Implement access controls for secrets (CC6.1)
- Monitor for security events (CC7.3)

## References

- [RFC 2104: HMAC](https://tools.ietf.org/html/rfc2104)
- [OWASP: Webhook Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html)
- [Stripe: Webhook Signatures](https://stripe.com/docs/webhooks/signatures)
- [CWE-208: Observable Timing Discrepancy](https://cwe.mitre.org/data/definitions/208.html)

---

**Last Updated**: 2024  
**Review Cycle**: Quarterly  
**Responsible**: Security Team
