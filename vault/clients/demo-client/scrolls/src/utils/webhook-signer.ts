/**
 * Webhook Signing Utility
 * 
 * Use this on the SENDING side to sign outgoing webhooks.
 * It creates the signature that the receiver will validate.
 * 
 * This is useful for testing and for implementing webhook sending
 * in your own services.
 */

/**
 * Signs a webhook payload with HMAC-SHA256
 * 
 * @param payload - The JSON payload to send
 * @param secret - The shared secret
 * @returns Headers object with signature and timestamp
 * 
 * @example
 * ```ts
 * const headers = await signWebhook({ event: "user.created" }, secret);
 * 
 * await fetch("https://api.example.com/webhook", {
 *   method: "POST",
 *   headers: {
 *     "Content-Type": "application/json",
 *     ...headers,
 *   },
 *   body: JSON.stringify(payload),
 * });
 * ```
 */
export async function signWebhook(
  payload: unknown,
  secret: string
): Promise<Record<string, string>> {
  const timestamp = Date.now().toString();
  const body = JSON.stringify(payload);
  
  // Compute signature: HMAC-SHA256(timestamp + "." + body, secret)
  const message = `${timestamp}.${body}`;
  const signature = await computeHmacSha256(message, secret);

  return {
    "x-signature": signature,
    "x-timestamp": timestamp,
  };
}

/**
 * Computes HMAC-SHA256 signature
 */
async function computeHmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return signatureHex;
}

/**
 * Test helper: Creates a complete signed request for testing
 * 
 * @example
 * ```ts
 * const req = await createSignedRequest(
 *   "https://localhost:3000/api/webhook",
 *   { event: "test" },
 *   "my-secret"
 * );
 * 
 * const result = await validateWebhook(req);
 * ```
 */
export async function createSignedRequest(
  url: string,
  payload: unknown,
  secret: string
): Promise<Request> {
  const headers = await signWebhook(payload, secret);
  
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
}
