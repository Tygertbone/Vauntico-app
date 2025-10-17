/**
 * Webhook Validation Ritual
 * 
 * This module guards the sanctity of incoming webhooks through:
 * 1. HMAC signature verification (authenticity)
 * 2. Timestamp freshness checks (replay attack prevention)
 * 3. Constant-time comparison (timing attack resistance)
 * 
 * The sacred contract: webhooks must bear both signature and timestamp,
 * signed with the shared secret known only to the sender and this sentinel.
 */

/**
 * Validates webhook authenticity and freshness
 * 
 * @param req - The incoming webhook request
 * @returns Validation result with detailed outcome
 * 
 * @example
 * ```ts
 * const result = await validateWebhook(req);
 * if (!result.valid) {
 *   return Response.json({ error: result.reason }, { status: 401 });
 * }
 * ```
 */
export async function validateWebhook(req: Request): Promise<WebhookValidationResult> {
  const secret = process.env.WEBHOOK_SECRET;
  
  // Guard: Ensure the sacred secret is configured
  if (!secret) {
    return {
      valid: false,
      reason: "MISSING_SECRET",
      message: "Webhook secret not configured. Set WEBHOOK_SECRET in environment.",
    };
  }

  // Extract the ritual tokens from request headers
  const signature = req.headers.get("x-signature");
  const timestamp = req.headers.get("x-timestamp");

  // Guard: Signature must be present
  if (!signature) {
    return {
      valid: false,
      reason: "MISSING_SIGNATURE",
      message: "Webhook signature header 'x-signature' is required.",
    };
  }

  // Guard: Timestamp must be present
  if (!timestamp) {
    return {
      valid: false,
      reason: "MISSING_TIMESTAMP",
      message: "Webhook timestamp header 'x-timestamp' is required.",
    };
  }

  // Parse and validate timestamp format
  const timestampMs = parseInt(timestamp, 10);
  if (isNaN(timestampMs) || timestampMs <= 0) {
    return {
      valid: false,
      reason: "INVALID_TIMESTAMP_FORMAT",
      message: "Timestamp must be a valid Unix timestamp in milliseconds.",
    };
  }

  // Check timestamp freshness (default: 5 minutes tolerance)
  const toleranceSeconds = parseInt(process.env.WEBHOOK_TIMESTAMP_TOLERANCE || "300", 10);
  const now = Date.now();
  const age = Math.abs(now - timestampMs);
  const maxAge = toleranceSeconds * 1000;

  if (age > maxAge) {
    return {
      valid: false,
      reason: "TIMESTAMP_EXPIRED",
      message: `Webhook timestamp is stale. Age: ${Math.floor(age / 1000)}s, Max: ${toleranceSeconds}s`,
      metadata: {
        timestampAge: Math.floor(age / 1000),
        maxAge: toleranceSeconds,
      },
    };
  }

  // Read the request body for signature computation
  const body = await req.text();
  
  // Compute expected signature: HMAC-SHA256(timestamp + "." + body, secret)
  const payload = `${timestamp}.${body}`;
  const expectedSignature = await computeHmacSha256(payload, secret);

  // Use constant-time comparison to prevent timing attacks
  if (!secureCompare(signature, expectedSignature)) {
    return {
      valid: false,
      reason: "SIGNATURE_MISMATCH",
      message: "Webhook signature verification failed. Possible tampering detected.",
    };
  }

  // The webhook has passed all trials
  return {
    valid: true,
    reason: "VERIFIED",
    message: "Webhook signature and timestamp verified successfully.",
    metadata: {
      timestamp: new Date(timestampMs).toISOString(),
      timestampAge: Math.floor(age / 1000),
    },
  };
}

/**
 * Computes HMAC-SHA256 signature
 */
async function computeHmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  // Import the secret as a cryptographic key
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Compute the signature
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
  
  // Convert to hex string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return signatureHex;
}

/**
 * Constant-time string comparison to prevent timing attacks
 * 
 * Standard === comparison can leak information about how many characters
 * match through execution time. This implementation always compares every
 * character regardless of when a mismatch is found.
 */
function secureCompare(a: string, b: string): boolean {
  // If lengths differ, still compare to maintain constant time
  const aLen = a.length;
  const bLen = b.length;
  
  // Use the longer length for comparison loop
  const maxLen = Math.max(aLen, bLen);
  
  let mismatch = aLen !== bLen ? 1 : 0;
  
  for (let i = 0; i < maxLen; i++) {
    const charA = i < aLen ? a.charCodeAt(i) : 0;
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }
  
  return mismatch === 0;
}

/**
 * Webhook validation result type
 */
export interface WebhookValidationResult {
  valid: boolean;
  reason: WebhookValidationReason;
  message: string;
  metadata?: {
    timestamp?: string;
    timestampAge?: number;
    maxAge?: number;
  };
}

export type WebhookValidationReason =
  | "VERIFIED"
  | "MISSING_SECRET"
  | "MISSING_SIGNATURE"
  | "MISSING_TIMESTAMP"
  | "INVALID_TIMESTAMP_FORMAT"
  | "TIMESTAMP_EXPIRED"
  | "SIGNATURE_MISMATCH";
