/**
 * Webhook Sending Example
 * 
 * Demonstrates how to send properly signed webhooks to your own
 * or third-party endpoints.
 */

import { signWebhook } from "../src/utils/webhook-signer";

/**
 * Send a webhook to a specific endpoint
 */
async function sendWebhook(
  endpoint: string,
  event: string,
  data: unknown,
  secret: string
): Promise<void> {
  const payload = {
    event,
    data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  console.log(`[WEBHOOK] Sending ${event} to ${endpoint}`);

  // Sign the webhook
  const headers = await signWebhook(payload, secret);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Vauntico-Webhook-Sender/1.0",
        "x-webhook-source": "vauntico-audit",
        ...headers,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[WEBHOOK] Successfully sent ${event} ✅`);
      const result = await response.json();
      console.log("[WEBHOOK] Response:", result);
    } else {
      console.error(`[WEBHOOK] Failed to send ${event} ❌`);
      console.error(`[WEBHOOK] Status: ${response.status}`);
      const error = await response.text();
      console.error("[WEBHOOK] Error:", error);
    }
  } catch (error) {
    console.error(`[WEBHOOK] Network error sending ${event}:`, error);
    throw error;
  }
}

/**
 * Example usage: Send different webhook events
 */
async function main() {
  const ENDPOINT = process.env.WEBHOOK_ENDPOINT || "http://localhost:3000/api/webhook";
  const SECRET = process.env.WEBHOOK_SECRET || "your-secret-here";

  // Example 1: User creation event
  await sendWebhook(
    ENDPOINT,
    "user.created",
    {
      id: 123,
      email: "user@example.com",
      name: "Alice Smith",
      createdAt: new Date().toISOString(),
    },
    SECRET
  );

  // Example 2: Payment completed event
  await sendWebhook(
    ENDPOINT,
    "payment.completed",
    {
      transactionId: "txn_abc123",
      amount: 99.99,
      currency: "USD",
      userId: 123,
    },
    SECRET
  );

  // Example 3: Audit event
  await sendWebhook(
    ENDPOINT,
    "audit.log",
    {
      action: "user.login",
      userId: 123,
      ip: "192.168.1.1",
      timestamp: new Date().toISOString(),
      success: true,
    },
    SECRET
  );
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { sendWebhook };
