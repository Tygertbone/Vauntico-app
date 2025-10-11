import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Zap, Crown, Moon, Star, ArrowRight } from 'lucide-react';

const AscensionCodexPage = () => {
  const [email, setEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tiers = [
    {
      id: 'seeker',
      name: 'Seeker',
      price: '$9',
      priceMonthly: 9,
      icon: <Star className="w-8 h-8 text-purple-400" />,
      color: 'from-purple-900 to-purple-700',
      features: [
        'Daily personalized transmission',
        'Morning alignment prompt',
        'Access to transmission archive',
        'Email delivery',
      ],
      cta: 'Begin Seeking',
    },
    {
      id: 'alchemist',
      name: 'Alchemist',
      price: '$29',
      priceMonthly: 29,
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-900 to-amber-700',
      featured: true,
      features: [
        'Everything in Seeker',
        'AI-voiced meditations (weekly)',
        'Personalized insight reports',
        'Moon phase rituals',
        'Priority support',
      ],
      cta: 'Become Alchemist',
    },
    {
      id: 'oracle',
      name: 'Oracle',
      price: '$79',
      priceMonthly: 79,
      icon: <Crown className="w-8 h-8 text-[#D4AF37]" />,
      color: 'from-yellow-600 to-yellow-500',
      features: [
        'Everything in Alchemist',
        'Quarterly Legacy Reports',
        'Your journey mapped & analyzed',
        'Private community access',
        'Early access to new rituals',
        '1:1 monthly guidance call',
      ],
      cta: 'Ascend to Oracle',
    },
  ];

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setIsLoading(true);

    // Simulate checkout process
    console.log('📊 Tier selected:', tier.name);
    
    // In production, redirect to checkout page
    setTimeout(() => {
      window.location.href = `/checkout?plan=ascension-${tier.id}&amount=${tier.priceMonthly}`;
    }, 1000);
  };

  const handleEarlyAccess = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Email capture logic here
      console.log('Email captured:', email);
      setShowSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Email capture error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-16" role="banner">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-4xl font-bold text-[#D4AF37] mb-4" role="heading" aria-level="1">VAUNTICO</div>
          </div>

          <Badge className="mb-6 bg-[#D4AF37] text-black px-4 py-2 text-sm font-semibold">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Now Available
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-[#D4AF37] bg-clip-text text-transparent">
            The Ascension Codex
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Your Daily Transmission from the Infinite
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            AI-powered spiritual growth sequences designed for founders, creators, and seekers building legacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" role="group" aria-label="Call to action buttons">
            <Button
              onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
              data-cta="ascension-hero-begin"
              aria-label="Scroll to pricing tiers to begin your ascension journey"
              className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-semibold px-8 py-6 text-lg rounded-lg hover:scale-105 transition-transform"
            >
              Begin Your Ascension
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-black bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#D4AF37]">
            Sacred Technology Meets Ancient Wisdom
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-purple-500 border-2">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Moon className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-white">Personalized Alchemy</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Complete your Soul Profile. Our AI studies your phase, challenges, and intentions to craft transmissions that speak directly to your journey.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-500 border-2">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-xl text-white">Daily Transmissions</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Every morning, receive wisdom designed for where you are right now. Ancient principles meet modern execution. Spiritual meets strategic.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-[#D4AF37] border-2">
              <CardHeader>
                <div className="w-12 h-12 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <CardTitle className="text-xl text-white">Legacy Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                Watch your transformation unfold. Quarterly reports reveal patterns, breakthroughs, and the mythology you're writing through your work.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="tiers" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Choose Your Path
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Every tier includes personalized transmissions. Higher tiers unlock deeper tools for transformation.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative bg-gradient-to-br ${tier.color} border-0 hover:scale-105 transition-all duration-300 ${
                  tier.featured ? 'ring-4 ring-[#D4AF37]' : ''
                }`}
              >
                {tier.featured && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 font-semibold">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-black bg-opacity-30 rounded-full">
                      {tier.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-white mb-1">
                    {tier.price}
                    <span className="text-lg text-gray-300">/month</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul 
                    id={`tier-${tier.id}-features`}
                    className="space-y-3 mb-6" 
                    role="list" 
                    aria-label={`Features included in ${tier.name} tier`}
                  >
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-white" role="listitem">
                        <span className="text-[#D4AF37] mr-2" aria-hidden="true">✦</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleTierSelect(tier)}
                    disabled={isLoading && selectedTier?.id === tier.id}
                    data-cta={`ascension-tier-${tier.id}`}
                    aria-label={`Select ${tier.name} tier for ${tier.price} per month`}
                    aria-describedby={`tier-${tier.id}-features`}
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-6 text-lg rounded-lg"
                  >
                    {isLoading && selectedTier?.id === tier.id ? 'Processing...' : tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Cancel anytime. Your transformation, your timeline.
          </p>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Not Ready to Commit?
          </h2>
          <p className="text-gray-300 mb-8">
            Join our list for free sample transmissions and founder updates.
          </p>

          {showSuccess ? (
            <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-6">
              <div className="text-green-400 text-lg font-semibold mb-2">
                🎉 You're on the list!
              </div>
              <p className="text-gray-300">Check your email for your first sample transmission.</p>
            </div>
          ) : (
            <form 
              onSubmit={handleEarlyAccess} 
              className="flex flex-col sm:flex-row gap-4"
              role="form"
              aria-labelledby="early-access-title"
            >
              <label htmlFor="early-access-email" className="sr-only">
                Email address for free sample transmissions
              </label>
              <Input
                id="early-access-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Enter your email address for free sample transmissions"
                className="flex-1 h-12 bg-white text-black border-0"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                data-cta="ascension-free-samples"
                aria-label="Sign up for free sample transmissions"
                className="bg-[#D4AF37] text-black hover:bg-yellow-600 h-12 px-8 font-semibold rounded-lg"
              >
                {isLoading ? 'Joining...' : 'Get Free Samples'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-12 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 italic text-lg">
            "Every empire begins with a single ritual. Not a business plan. A ritual."
          </p>
          <p className="text-[#D4AF37] mt-4 font-semibold">
            — The Vauntico Doctrine
          </p>
        </div>
      </section>
    </div>
  );
};

export default AscensionCodexPage;