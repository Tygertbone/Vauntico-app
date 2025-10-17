/**
 * Webhook Validator Test Suite
 * 
 * These tests ensure the validation logic holds strong against
 * various attack vectors and edge cases.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { validateWebhook } from "../src/lib/webhook-validator";
import { createSignedRequest } from "../src/utils/webhook-signer";

describe("validateWebhook", () => {
  const SECRET = "test-secret-key-for-webhook-validation";
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, WEBHOOK_SECRET: SECRET };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Valid webhooks", () => {
    it("should accept a properly signed webhook", async () => {
      const req = await createSignedRequest(
        "https://example.com/webhook",
        { event: "test", data: { id: 123 } },
        SECRET
      );

      const result = await validateWebhook(req);

      expect(result.valid).toBe(true);
      expect(result.reason).toBe("VERIFIED");
    });

    it("should accept webhook with current timestamp", async () => {
      const timestamp = Date.now().toString();
      const payload = JSON.stringify({ test: true });
      const signature = await signPayload(timestamp, payload, SECRET);

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": signature,
          "x-timestamp": timestamp,
        },
        body: payload,
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(true);
    });
  });

  describe("Missing components", () => {
    it("should reject webhook without signature", async () => {
      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-timestamp": Date.now().toString(),
        },
        body: JSON.stringify({ test: true }),
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("MISSING_SIGNATURE");
    });

    it("should reject webhook without timestamp", async () => {
      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": "fake-signature",
        },
        body: JSON.stringify({ test: true }),
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("MISSING_TIMESTAMP");
    });

    it("should reject when WEBHOOK_SECRET is not configured", async () => {
      delete process.env.WEBHOOK_SECRET;

      const req = await createSignedRequest(
        "https://example.com/webhook",
        { test: true },
        SECRET
      );

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("MISSING_SECRET");
    });
  });

  describe("Timestamp validation", () => {
    it("should reject webhook with expired timestamp", async () => {
      // Create a timestamp from 10 minutes ago
      const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString();
      const payload = JSON.stringify({ test: true });
      const signature = await signPayload(oldTimestamp, payload, SECRET);

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": signature,
          "x-timestamp": oldTimestamp,
        },
        body: payload,
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TIMESTAMP_EXPIRED");
    });

    it("should reject webhook with invalid timestamp format", async () => {
      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": "fake-sig",
          "x-timestamp": "not-a-number",
        },
        body: JSON.stringify({ test: true }),
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("INVALID_TIMESTAMP_FORMAT");
    });

    it("should accept webhook within tolerance window", async () => {
      process.env.WEBHOOK_TIMESTAMP_TOLERANCE = "300"; // 5 minutes

      // Create timestamp from 2 minutes ago (within tolerance)
      const recentTimestamp = (Date.now() - 2 * 60 * 1000).toString();
      const payload = JSON.stringify({ test: true });
      const signature = await signPayload(recentTimestamp, payload, SECRET);

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": signature,
          "x-timestamp": recentTimestamp,
        },
        body: payload,
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(true);
    });
  });

  describe("Signature validation", () => {
    it("should reject webhook with tampered signature", async () => {
      const timestamp = Date.now().toString();
      const payload = JSON.stringify({ test: true });
      const signature = await signPayload(timestamp, payload, SECRET);

      // Tamper with the signature
      const tamperedSignature = signature.slice(0, -2) + "00";

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": tamperedSignature,
          "x-timestamp": timestamp,
        },
        body: payload,
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("SIGNATURE_MISMATCH");
    });

    it("should reject webhook with tampered body", async () => {
      const timestamp = Date.now().toString();
      const originalPayload = JSON.stringify({ test: true });
      const signature = await signPayload(timestamp, originalPayload, SECRET);

      // Send different body than what was signed
      const tamperedPayload = JSON.stringify({ test: false });

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": signature,
          "x-timestamp": timestamp,
        },
        body: tamperedPayload,
      });

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("SIGNATURE_MISMATCH");
    });

    it("should reject webhook signed with wrong secret", async () => {
      const wrongSecret = "wrong-secret";
      const req = await createSignedRequest(
        "https://example.com/webhook",
        { test: true },
        wrongSecret
      );

      const result = await validateWebhook(req);

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("SIGNATURE_MISMATCH");
    });
  });

  describe("Replay attack prevention", () => {
    it("should reject replayed webhook with old timestamp", async () => {
      // Create a valid signed request with old timestamp
      const oldTimestamp = (Date.now() - 20 * 60 * 1000).toString();
      const payload = JSON.stringify({ transfer: { amount: 1000 } });
      const signature = await signPayload(oldTimestamp, payload, SECRET);

      const req = new Request("https://example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": signature,
          "x-timestamp": oldTimestamp,
        },
        body: payload,
      });

      const result = await validateWebhook(req);

      // Even though signature is valid, timestamp is too old
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TIMESTAMP_EXPIRED");
    });
  });
});

// Helper function to sign payload
async function signPayload(
  timestamp: string,
  body: string,
  secret: string
): Promise<string> {
  const message = `${timestamp}.${body}`;
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
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
