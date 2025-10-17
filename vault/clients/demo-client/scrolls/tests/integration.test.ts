/**
 * Integration Test Suite
 * 
 * End-to-end tests that exercise the complete webhook flow:
 * signing → sending → validation → processing
 */

import { describe, it, expect, beforeEach } from "vitest";
import { handleWebhook } from "../src/api/webhook";
import { createSignedRequest } from "../src/utils/webhook-signer";

describe("Webhook Integration", () => {
  const SECRET = "integration-test-secret-key";
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, WEBHOOK_SECRET: SECRET };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Complete webhook flow", () => {
    it("should successfully process a signed webhook end-to-end", async () => {
      // 1. Create a signed webhook request
      const payload = {
        event: "user.created",
        data: {
          id: 123,
          email: "test@example.com",
          name: "Test User",
        },
      };

      const request = await createSignedRequest(
        "https://api.example.com/webhook",
        payload,
        SECRET
      );

      // 2. Handle the webhook through the API handler
      const response = await handleWebhook(request);

      // 3. Verify successful processing
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.message).toBe("Webhook processed successfully");
    });

    it("should reject unsigned webhook at the API level", async () => {
      const payload = { event: "test" };

      const request = new Request("https://api.example.com/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await handleWebhook(request);

      expect(response.status).toBe(400);
      
      const result = await response.json();
      expect(result.error).toBe("MISSING_SIGNATURE");
    });

    it("should reject expired webhook at the API level", async () => {
      // Create webhook with old timestamp
      const oldTimestamp = (Date.now() - 10 * 60 * 1000).toString();
      const payload = JSON.stringify({ event: "test" });
      
      const signature = await computeSignature(oldTimestamp, payload, SECRET);

      const request = new Request("https://api.example.com/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signature": signature,
          "x-timestamp": oldTimestamp,
        },
        body: payload,
      });

      const response = await handleWebhook(request);

      expect(response.status).toBe(408); // Request Timeout
      
      const result = await response.json();
      expect(result.error).toBe("TIMESTAMP_EXPIRED");
    });

    it("should reject tampered webhook at the API level", async () => {
      // Create valid signed request
      const originalPayload = { event: "payment.completed", amount: 100 };
      const request = await createSignedRequest(
        "https://api.example.com/webhook",
        originalPayload,
        SECRET
      );

      // Tamper with the body (change amount)
      const tamperedPayload = { event: "payment.completed", amount: 999999 };
      const tamperedRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(tamperedPayload),
      });

      const response = await handleWebhook(tamperedRequest);

      expect(response.status).toBe(401); // Unauthorized
      
      const result = await response.json();
      expect(result.error).toBe("SIGNATURE_MISMATCH");
    });
  });

  describe("Webhook lifecycle", () => {
    it("should handle multiple sequential webhooks", async () => {
      const events = ["user.created", "user.updated", "payment.completed"];
      const results = [];

      for (const event of events) {
        const request = await createSignedRequest(
          "https://api.example.com/webhook",
          { event, data: { id: 123 } },
          SECRET
        );

        const response = await handleWebhook(request);
        const result = await response.json();
        
        results.push({ event, success: result.success });
      }

      expect(results).toHaveLength(3);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it("should validate webhooks with different payloads", async () => {
      const payloads = [
        { event: "test", data: null },
        { event: "test", data: {} },
        { event: "test", data: { nested: { deep: { value: 123 } } } },
        { event: "test", data: [1, 2, 3, 4, 5] },
        { event: "test", data: "string value" },
      ];

      for (const payload of payloads) {
        const request = await createSignedRequest(
          "https://api.example.com/webhook",
          payload,
          SECRET
        );

        const response = await handleWebhook(request);
        expect(response.status).toBe(200);
      }
    });
  });

  describe("Error handling", () => {
    it("should provide appropriate status codes for different errors", async () => {
      const testCases = [
        {
          name: "missing signature",
          makeRequest: () =>
            new Request("https://api.example.com/webhook", {
              method: "POST",
              headers: { "x-timestamp": Date.now().toString() },
              body: JSON.stringify({}),
            }),
          expectedStatus: 400,
        },
        {
          name: "missing timestamp",
          makeRequest: () =>
            new Request("https://api.example.com/webhook", {
              method: "POST",
              headers: { "x-signature": "fake" },
              body: JSON.stringify({}),
            }),
          expectedStatus: 400,
        },
        {
          name: "invalid timestamp format",
          makeRequest: () =>
            new Request("https://api.example.com/webhook", {
              method: "POST",
              headers: {
                "x-signature": "fake",
                "x-timestamp": "not-a-number",
              },
              body: JSON.stringify({}),
            }),
          expectedStatus: 400,
        },
      ];

      for (const testCase of testCases) {
        const request = testCase.makeRequest();
        const response = await handleWebhook(request);
        
        expect(response.status).toBe(testCase.expectedStatus);
      }
    });
  });

  describe("Security boundaries", () => {
    it("should not leak information about signature correctness", async () => {
      const timestamp = Date.now().toString();
      const body = JSON.stringify({ test: true });
      const validSignature = await computeSignature(timestamp, body, SECRET);

      // Test with incrementally wrong signatures
      const almostValidSignature = validSignature.slice(0, -2) + "00";
      const completelyWrongSignature = "0".repeat(64);

      const request1 = new Request("https://api.example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": almostValidSignature,
          "x-timestamp": timestamp,
        },
        body,
      });

      const request2 = new Request("https://api.example.com/webhook", {
        method: "POST",
        headers: {
          "x-signature": completelyWrongSignature,
          "x-timestamp": timestamp,
        },
        body,
      });

      const response1 = await handleWebhook(request1);
      const response2 = await handleWebhook(request2);

      // Both should return same error
      expect(response1.status).toBe(401);
      expect(response2.status).toBe(401);

      const result1 = await response1.json();
      const result2 = await response2.json();

      expect(result1.error).toBe("SIGNATURE_MISMATCH");
      expect(result2.error).toBe("SIGNATURE_MISMATCH");
      
      // Error messages should not leak how close the signature was
      expect(result1.message).toBe(result2.message);
    });

    it("should not process webhooks when secret is misconfigured", async () => {
      delete process.env.WEBHOOK_SECRET;

      const request = await createSignedRequest(
        "https://api.example.com/webhook",
        { test: true },
        "any-secret"
      );

      const response = await handleWebhook(request);

      expect(response.status).toBe(500);
      
      const result = await response.json();
      expect(result.error).toBe("MISSING_SECRET");
    });
  });
});

// Helper function
async function computeSignature(
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
