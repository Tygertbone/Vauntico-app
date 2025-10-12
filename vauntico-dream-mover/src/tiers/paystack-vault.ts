// Paystack intent stub (Phase 5): returns a URL to open for payment in ZAR.
export interface PaystackIntent { url: string, amount: number, currency: string }
export async function createPaystackIntent(email: string, amountCents: number, currency = 'ZAR'): Promise<PaystackIntent> {
  // Stub: in production, call your /api/paystack/intent and return authorization_url
  const url = `https://paystack.com/pay/intent?email=${encodeURIComponent(email)}&amount=${amountCents}&currency=${currency}`
  return { url, amount: amountCents, currency }
}