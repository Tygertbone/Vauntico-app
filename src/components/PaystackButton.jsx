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
      <div className="space-y-3">
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email for checkout"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--vauntico-gold)]"
            required
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className={`${className} hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300`}
              disabled={!userEmail}>
              Continue to Payment
            </button>
            <button 
              onClick={() => setShowEmailInput(false)}
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
      className={`${className} hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300`}>
      {isLoading ? 'Processing...' : children}
    </button>
  )
}

export default PaystackButton

