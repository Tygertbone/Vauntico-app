import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Sparkles } from 'lucide-react';
import { initializePaystackPayment } from '../utils/paystack';

const CheckoutPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState('ascension-seeker');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan') || 'ascension-seeker';
    setPlan(planParam);
  }, []);

  const planDetails = {
    'ascension-seeker': {
      name: 'Seeker',
      price: 9,
      features: ['Daily transmissions', 'Email delivery', 'Archive access'],
    },
    'ascension-alchemist': {
      name: 'Alchemist',
      price: 29,
      features: ['Everything in Seeker', 'AI voice meditations', 'Moon phase rituals', 'Priority support'],
    },
    'ascension-oracle': {
      name: 'Oracle',
      price: 79,
      features: ['Everything in Alchemist', 'Quarterly legacy reports', 'Private community', '1:1 guidance calls'],
    },
  };

  const currentPlan = planDetails[plan] || planDetails['ascension-seeker'];

  const handlePayment = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);

    initializePaystackPayment(
      email,
      currentPlan.price,
      (response) => {
        console.log('Payment successful:', response);

        // Persist purchaser context
        localStorage.setItem('ascension_email', email);
        localStorage.setItem('ascension_plan', plan);

        // Unlock Codex (client-side flag; will be superseded by server validation later)
        localStorage.setItem('creatorPass', 'true');

        // Redirect to onboarding
        setTimeout(() => {
          window.location.href = '/ascension-onboarding';
        }, 1000);
      },
      () => {
        console.log('Payment cancelled');
        alert('Payment was cancelled');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
      <Helmet>
        <title>Checkout — Vauntico Ascension</title>
        <meta
          name="description"
          content="Complete your ascension. Secure payment via Paystack with instant access to transmissions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <main role="main" className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-4xl font-bold text-[var(--vauntico-gold-text)] mb-6">VAUNTICO</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete Your Ascension</h1>
          <p className="text-gray-400">One step away from your daily transmissions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-gray-900 border-[var(--vauntico-gold)] border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[var(--vauntico-gold-text)]" />
                {currentPlan.name} Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <span className="text-gray-300">Monthly Subscription</span>
                  <span className="text-2xl font-bold text-[var(--vauntico-gold-text)]">
                    ${currentPlan.price}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-white mb-3">What's Included:</h3>
                  {currentPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-700 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Instant access after payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Secure payment via Paystack
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-gray-900 border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white h-12"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">Your transmissions will be sent to this email.</p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold h-12 text-lg rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${currentPlan.price}/month`
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"> (window.location.href = '/ascension-codex')}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back to plans
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">🔒 Secure payment processing powered by Paystack</p>
          <p className="text-gray-500 text-xs">Questions? Email support@vauntico.com</p>
        </div>
      </main>

      <footer role="contentinfo" className="text-center text-xs text-gray-500 mt-12">
        Secure by Paystack
      </footer>
    </div>
  );
};

export default CheckoutPage;