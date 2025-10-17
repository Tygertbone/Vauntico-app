/**
 * Next.js API Route Example
 * 
 * Shows how to integrate the webhook validator in a Next.js app.
 * Place this in: app/api/webhook/route.ts (App Router)
 * or: pages/api/webhook.ts (Pages Router)
 */

import { validateWebhook } from "@/lib/webhook-validator";
import { NextRequest, NextResponse } from "next/server";

/**
 * App Router Example (app/api/webhook/route.ts)
 */
export async function POST(request: NextRequest) {
  console.log("[WEBHOOK] Incoming webhook request");

  // Validate the webhook signature and freshness
  const validation = await validateWebhook(request);

  // If validation fails, return error response
  if (!validation.valid) {
    console.error("[WEBHOOK] Validation failed:", validation.reason);
    
    return NextResponse.json(
      {
        error: validation.reason,
        message: validation.message,
      },
      { 
        status: getStatusCode(validation.reason),
      }
    );
  }

  console.log("[WEBHOOK] Validation successful ✅");

  // Parse the webhook payload
  try {
    const payload = await request.json();
    console.log("[WEBHOOK] Payload:", payload);

    // Process based on event type
    const result = await processWebhookEvent(payload);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("[WEBHOOK] Processing error:", error);
    
    return NextResponse.json(
      {
        error: "PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Process the webhook event based on type
 */
async function processWebhookEvent(payload: any) {
  const { event, data } = payload;

  switch (event) {
    case "user.created":
      return handleUserCreated(data);
    
    case "user.updated":
      return handleUserUpdated(data);
    
    case "payment.completed":
      return handlePaymentCompleted(data);
    
    default:
      console.warn(`[WEBHOOK] Unknown event type: ${event}`);
      return { processed: false, reason: "unknown_event" };
  }
}

async function handleUserCreated(data: any) {
  console.log("[WEBHOOK] Handling user.created:", data);
  // TODO: Your business logic here
  return { processed: true, event: "user.created" };
}

async function handleUserUpdated(data: any) {
  console.log("[WEBHOOK] Handling user.updated:", data);
  // TODO: Your business logic here
  return { processed: true, event: "user.updated" };
}

async function handlePaymentCompleted(data: any) {
  console.log("[WEBHOOK] Handling payment.completed:", data);
  // TODO: Your business logic here
  return { processed: true, event: "payment.completed" };
}

function getStatusCode(reason: string): number {
  const statusCodes: Record<string, number> = {
    MISSING_SECRET: 500,
    MISSING_SIGNATURE: 400,
    MISSING_TIMESTAMP: 400,
    INVALID_TIMESTAMP_FORMAT: 400,
    TIMESTAMP_EXPIRED: 408,
    SIGNATURE_MISMATCH: 401,
  };
  return statusCodes[reason] || 400;
}
