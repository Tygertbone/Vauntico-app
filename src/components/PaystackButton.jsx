import { useState } from 'react'
import { initializePaystackPayment, redirectToSuccess } from '../utils/paystack'

const PaystackButton = ({ 
  amount = 97, // Default price in USD
  email = '',
  className = 'vauntico-btn',
  children = 'Buy with Apple Pay'
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [userEmail, setUserEmail] = useState(email)

  const handlePayment = () => {
    if (!userEmail) {
      setShowEmailInput(true)
      return
    }

    setIsLoading(true)
    
    initializePaystackPayment(
      userEmail,
      amount,
      (response) => {
        // Payment successful
        console.log('Payment successful:', response)
        setIsLoading(false)
        redirectToSuccess()
      },
      () => {
        // Payment cancelled
        console.log('Payment cancelled')
        setIsLoading(false)
      }
    )
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (userEmail) {
      setShowEmailInput(false)
      handlePayment()
    }
  }

  if (showEmailInput) {
    return (
      <div className="space-y-3" role="dialog" aria-labelledby="email-dialog-title" aria-describedby="email-dialog-desc">
        <div id="email-dialog-title" className="sr-only">Email Required for Checkout</div>
        <div id="email-dialog-desc" className="sr-only">Please provide your email address to proceed with secure payment</div>
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email for checkout"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vauntico-gold)]"
            aria-label="Email address for secure checkout"
            aria-describedby="email-help"
            required
            autoFocus
          />
          <div id="email-help" className="sr-only">Your email will be used for payment confirmation and receipt delivery</div>
          <div className="flex gap-2">
            <button
              type="submit"
              data-cta="paystack-email-continue"
              aria-label="Continue to secure payment with Paystack"
              className={`${className} hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300`}
              disabled={!userEmail}>
              Continue to Payment
            </button>
            <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"> setShowEmailInput(false)}
              data-cta="paystack-email-cancel"
              aria-label="Cancel email input and return to payment options"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <button 
      onClick={handlePayment}
      disabled={isLoading}
      data-cta="paystack-payment-initiate"
      aria-label={`Secure payment for $${amount} via Paystack${isLoading ? ' - Processing...' : ''}`}
      aria-describedby="payment-security-info"
      className={`${className} hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300`}>
      {isLoading ? 'Processing...' : children}
      <div id="payment-security-info" className="sr-only">
        Secure payment powered by Paystack. Your payment information is encrypted and protected.
      </div>
    </button>
  )
}

export default PaystackButton

