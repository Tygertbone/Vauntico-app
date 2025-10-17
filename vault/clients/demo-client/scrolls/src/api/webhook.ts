/**
 * Webhook API Handler
 * 
 * This module demonstrates how to use the webhook validator in an API route.
 * It showcases the complete lifecycle: validation, audit logging, and response.
 */

import { validateWebhook, type WebhookValidationResult } from "../lib/webhook-validator";

/**
 * Main webhook handler
 * 
 * @example
 * ```ts
 * // In your API route (Next.js, Remix, etc.)
 * export async function POST(request: Request) {
 *   return handleWebhook(request);
 * }
 * ```
 */
export async function handleWebhook(req: Request): Promise<Response> {
  // Step 1: Validate the webhook
  const validation = await validateWebhook(req);

  // Step 2: Log the validation attempt
  await auditLog({
    timestamp: new Date().toISOString(),
    source: extractSource(req),
    signature: req.headers.get("x-signature") || "missing",
    result: validation,
    ip: extractIp(req),
  });

  // Step 3: If validation fails, reject with appropriate status
  if (!validation.valid) {
    return Response.json(
      {
        error: validation.reason,
        message: validation.message,
      },
      { 
        status: getStatusCode(validation.reason),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Step 4: Process the validated webhook
  try {
    // Clone request to read body again (since validation consumed it)
    const body = await req.clone().json();
    
    const result = await processWebhookPayload(body);

    return Response.json(
      {
        success: true,
        message: "Webhook processed successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    
    return Response.json(
      {
        error: "PROCESSING_FAILED",
        message: "Webhook validation passed but processing failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Determines HTTP status code based on validation reason
 */
function getStatusCode(reason: string): number {
  switch (reason) {
    case "MISSING_SECRET":
      return 500; // Server configuration error
    case "MISSING_SIGNATURE":
    case "MISSING_TIMESTAMP":
    case "INVALID_TIMESTAMP_FORMAT":
      return 400; // Bad request
    case "TIMESTAMP_EXPIRED":
      return 408; // Request timeout
    case "SIGNATURE_MISMATCH":
      return 401; // Unauthorized
    default:
      return 400;
  }
}

/**
 * Extract source identifier from request
 */
function extractSource(req: Request): string {
  return (
    req.headers.get("x-webhook-source") ||
    req.headers.get("user-agent") ||
    "unknown"
  );
}

/**
 * Extract IP address from request
 */
function extractIp(req: Request): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

/**
 * Audit logging function
 * 
 * In production, this should write to your audit database, logging service,
 * or SIEM system. This example shows the structure.
 */
async function auditLog(entry: AuditLogEntry): Promise<void> {
  const auditEntry = {
    id: crypto.randomUUID(),
    timestamp: entry.timestamp,
    source: entry.source,
    signature: entry.signature,
    result: entry.result,
    ip: entry.ip,
    outcome: entry.result.valid ? "✅ Authentic and fresh" : getOutcomeEmoji(entry.result.reason),
  };

  // TODO: Persist to your audit storage
  console.log("[AUDIT]", JSON.stringify(auditEntry, null, 2));

  // In production, write to database or logging service:
  // await db.auditLogs.create({ data: auditEntry });
  // await logger.info("webhook_validation", auditEntry);
}

function getOutcomeEmoji(reason: string): string {
  switch (reason) {
    case "TIMESTAMP_EXPIRED":
      return "❌ Expired";
    case "SIGNATURE_MISMATCH":
      return "❌ Tampered";
    default:
      return "❌ Invalid";
  }
}

/**
 * Process the validated webhook payload
 * 
 * This is where your business logic goes. The webhook has been verified
 * as authentic and fresh, so you can trust the data.
 */
async function processWebhookPayload(payload: unknown): Promise<unknown> {
  // TODO: Implement your webhook processing logic
  console.log("[WEBHOOK] Processing payload:", payload);
  
  // Example: Route based on event type
  // if (payload.event === "user.created") {
  //   await handleUserCreated(payload.data);
  // }
  
  return { processed: true };
}

interface AuditLogEntry {
  timestamp: string;
  source: string;
  signature: string;
  result: WebhookValidationResult;
  ip?: string;
}
