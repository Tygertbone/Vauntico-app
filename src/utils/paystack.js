// Paystack Integration Utility
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export const initializePaystackPayment = (email, amountZAR, onSuccess, onClose, planCode, metadata = {}) => {
  if (!PAYSTACK_PUBLIC_KEY) {
    console.error('Missing VITE_PAYSTACK_PUBLIC_KEY. Set it in your env.');
    alert('Payment configuration error. Please try again later.');
    return;
  }
  // Load Paystack script if not already loaded
  if (!window.PaystackPop) {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => {
      startPayment(email, amountZAR, onSuccess, onClose, planCode, metadata)
    }
    document.head.appendChild(script)
  } else {
    startPayment(email, amountZAR, onSuccess, onClose, planCode, metadata)
  }
}

const startPayment = (email, amountZAR, onSuccess, onClose, planCode, metadata) => {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amountZAR * 100, // Paystack expects amount in kobo (cents)
    currency: 'ZAR',
    ref: 'vault_' + Math.floor((Math.random() * 1000000000) + 1),
    ...(planCode ? { plan: planCode } : {}),
    metadata: {
      product: 'Vauntico Prompt Vault',
      ...metadata
    },
    callback: function(response) {
      // Payment successful
      onSuccess(response)
    },
    onClose: function() {
      // Payment cancelled
      onClose()
    }
  })
  
  handler.openIframe()
}

export const redirectToSuccess = () => {
  window.location.href = '/vault-success'
}
